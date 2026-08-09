/**
 * Layout Engine for PDF Generation
 *
 * A simple, RTL-aware layout engine built on pdf-lib.
 * Instead of specifying absolute X/Y coordinates, content is placed
 * using high-level methods that automatically track position and
 * handle text wrapping.
 *
 * Example usage:
 *   const layout = new PageLayout(page, fonts, { ... })
 *   layout.addCenteredText('שלום עולם', { bold: true, fontSize: 12 })
 *   layout.addSpacing(5)
 *   layout.addCenteredText('Next line follows automatically')
 *
 * The Y position flows downward automatically.  No manual coordinates.
 *
 * TEXT RENDERING (RTL):
 *   Hebrew text is rendered using the segment-based approach:
 *   1. Split text into same-direction segments (Hebrew vs Latin/digits)
 *   2. Keep all text in LOGICAL order (NO reversal)
 *   3. Draw each segment as a separate drawText() call
 *   4. Position segments right-to-left (first segment rightmost)
 *   The PDF viewer handles BiDi within each segment independently.
 *
 * TEXT WRAPPING:
 *   Long text wraps at word boundaries.  The engine:
 *   1. Splits text into words (at spaces)
 *   2. Measures each word's width using the font
 *   3. Determines line breaks based on available width
 *   4. Wraps in LOGICAL order, then renders each line with segment splitting
 *   This ensures correct reading order across wrapped lines.
 */

import { rgb } from 'pdf-lib'
import type { PDFFont, PDFPage } from 'pdf-lib'

// -------------------------------------------------------------------
// Types
// -------------------------------------------------------------------

export interface Fonts {
  regular: PDFFont
  bold: PDFFont
}

export interface PageMargins {
  top: number
  bottom: number
  left: number
  right: number
}

export interface TextStyle {
  fontSize?: number
  bold?: boolean
  underline?: boolean
  color?: [number, number, number]
}

// -------------------------------------------------------------------
// Hebrew/RTL segment processing
// -------------------------------------------------------------------

function isHebrew(ch: string): boolean {
  const code = ch.charCodeAt(0)
  return (code >= 0x0590 && code <= 0x05FF) || (code >= 0xFB1D && code <= 0xFB4F)
}

function isLTR(ch: string): boolean {
  const code = ch.charCodeAt(0)
  return (code >= 0x30 && code <= 0x39) ||
         (code >= 0x41 && code <= 0x5A) ||
         (code >= 0x61 && code <= 0x7A)
}

interface TextSegment {
  text: string
  isRTL: boolean
}

/**
 * Mirror BiDi-mirrored characters (brackets, parentheses, etc.).
 * PDF viewers auto-mirror these in RTL runs, so we pre-mirror them
 * to cancel out that effect and display the intended glyph.
 */
const MIRROR_MAP: Record<string, string> = {
  '(': ')', ')': '(',
  '[': ']', ']': '[',
  '{': '}', '}': '{',
  '\u00AB': '\u00BB', '\u00BB': '\u00AB', // « »
  '\u2039': '\u203A', '\u203A': '\u2039', // ‹ ›
}

function mirrorBrackets(text: string): string {
  let result = ''
  for (const ch of text) {
    result += MIRROR_MAP[ch] ?? ch
  }
  return result
}

/**
 * Split a string into same-direction segments.
 * Neutral characters (spaces, punctuation) attach to the
 * preceding direction.
 */
function splitSegments(text: string): TextSegment[] {
  const segments: TextSegment[] = []
  let cur = ''
  let curRTL: boolean | null = null

  for (const ch of text) {
    if (isHebrew(ch)) {
      if (curRTL === false) {
        segments.push({ text: cur, isRTL: false })
        cur = ''
      }
      curRTL = true
      cur += ch
    } else if (isLTR(ch)) {
      if (curRTL === true) {
        segments.push({ text: cur, isRTL: true })
        cur = ''
      }
      curRTL = false
      cur += ch
    } else {
      cur += ch
    }
  }

  if (cur) segments.push({ text: cur, isRTL: curRTL ?? true })
  return segments
}

// -------------------------------------------------------------------
// PageLayout class
// -------------------------------------------------------------------

export class PageLayout {
  page: PDFPage
  fonts: Fonts
  margins: PageMargins
  pageWidth: number
  pageHeight: number
  contentWidth: number

  /** Current Y position (decreases as content is added, PDF origin at bottom) */
  y: number

  /** Default font size */
  defaultFontSize: number

  constructor(
    page: PDFPage,
    fonts: Fonts,
    margins: PageMargins = { top: 50, bottom: 50, left: 50, right: 50 },
    defaultFontSize: number = 10
  ) {
    this.page = page
    this.fonts = fonts
    this.margins = margins
    this.defaultFontSize = defaultFontSize

    const size = page.getSize()
    this.pageWidth = size.width
    this.pageHeight = size.height
    this.contentWidth = size.width - margins.left - margins.right

    // Start at the top of the content area
    this.y = size.height - margins.top
  }

  // -----------------------------------------------------------------
  // Low-level: draw text segments at a specific position
  // -----------------------------------------------------------------

  /**
   * Draw a single line of text using the logical-order segment approach.
   *
   * KEY INSIGHT: The PDF viewer applies BiDi to each drawText call.
   * - Hebrew-only drawText → viewer renders RTL (correct)
   * - Number-only drawText → viewer renders LTR (correct)
   * - Mixed drawText → viewer reverses numbers (WRONG)
   *
   * Solution: split text into same-script segments and draw each
   * as a separate drawText call.  All text stays in LOGICAL order
   * (exactly as the user typed it).  The viewer handles rendering
   * direction for each segment independently.
   *
   * Segments are POSITIONED right-to-left (RTL document flow):
   * the first logical segment appears rightmost.
   *
   * @param x          Left edge of the available area
   * @param y          Baseline Y position
   * @param text       The logical-order text string (as user types it)
   * @param width      Available width for positioning
   * @param alignment  'right' | 'center' | 'left'
   * @param style      Font size, bold, etc.
   */
  drawTextLine(
    x: number,
    y: number,
    text: string,
    width: number,
    alignment: 'right' | 'center' | 'left',
    style: TextStyle = {}
  ): void {
    const font = style.bold ? this.fonts.bold : this.fonts.regular
    const fontSize = style.fontSize ?? this.defaultFontSize
    const [cr, cg, cb] = style.color ?? [0, 0, 0]

    // Split into same-direction segments — NO reversal, keep logical order.
    // Pre-mirror brackets in RTL segments so the viewer's auto-mirroring
    // produces the correct glyphs.
    const segments = splitSegments(text)
    const prepared = segments.map(seg => {
      const rendered = seg.isRTL ? mirrorBrackets(seg.text) : seg.text
      const w = font.widthOfTextAtSize(rendered, fontSize)
      return { text: rendered, w, isRTL: seg.isRTL }
    })

    const totalWidth = prepared.reduce((sum, p) => sum + p.w, 0)

    // Calculate starting right edge based on alignment
    let startRight: number
    if (alignment === 'right') {
      startRight = x + width
    } else if (alignment === 'center') {
      startRight = x + (width + totalWidth) / 2
    } else {
      startRight = x + totalWidth
    }

    // Draw each segment from right to left (RTL document flow).
    // First logical segment appears rightmost.
    let cursorRight = startRight
    for (const seg of prepared) {
      const segX = cursorRight - seg.w
      this.page.drawText(seg.text, {
        x: segX,
        y,
        size: fontSize,
        font,
        color: rgb(cr, cg, cb),
      })
      cursorRight -= seg.w
    }

    // Underline if requested
    if (style.underline) {
      const lineY = y - 2
      const lineLeft = alignment === 'right'
        ? x + width - totalWidth
        : alignment === 'center'
          ? x + (width - totalWidth) / 2
          : x
      this.page.drawLine({
        start: { x: lineLeft, y: lineY },
        end: { x: lineLeft + totalWidth, y: lineY },
        thickness: 0.8,
        color: rgb(cr, cg, cb),
      })
    }
  }

  // -----------------------------------------------------------------
  // Text measurement
  // -----------------------------------------------------------------

  measureText(text: string, style: TextStyle = {}): number {
    const font = style.bold ? this.fonts.bold : this.fonts.regular
    const fontSize = style.fontSize ?? this.defaultFontSize
    // Measure total width — same regardless of direction
    return font.widthOfTextAtSize(text, fontSize)
  }

  /**
   * Split text into wrapped lines based on available width.
   * Wrapping is done on LOGICAL order text (correct reading order).
   * Each line is then rendered with RTL segment processing.
   */
  wrapText(text: string, maxWidth: number, style: TextStyle = {}): string[] {
    const words = text.split(/(\s+)/) // keep whitespace tokens
    const lines: string[] = []
    let currentLine = ''

    for (const word of words) {
      const testLine = currentLine + word
      const testWidth = this.measureText(testLine.trim(), style)

      if (testWidth > maxWidth && currentLine.trim()) {
        lines.push(currentLine.trim())
        currentLine = word.trimStart()
      } else {
        currentLine = testLine
      }
    }

    if (currentLine.trim()) {
      lines.push(currentLine.trim())
    }

    return lines.length > 0 ? lines : ['']
  }

  // -----------------------------------------------------------------
  // High-level layout methods
  // -----------------------------------------------------------------

  /** Add vertical spacing (move the cursor down) */
  addSpacing(points: number): void {
    this.y -= points
  }

  /**
   * Add a single line of text, centered horizontally.
   * If text is too long for one line, it wraps automatically.
   */
  addCenteredText(text: string, style: TextStyle = {}): void {
    const fontSize = style.fontSize ?? this.defaultFontSize
    const lineHeight = fontSize * 1.4

    const lines = this.wrapText(text, this.contentWidth, style)
    for (const line of lines) {
      this.drawTextLine(
        this.margins.left, this.y, line,
        this.contentWidth, 'center', style
      )
      this.y -= lineHeight
    }
  }

  /** Add left-aligned text */
  addLeftText(text: string, style: TextStyle = {}): void {
    const fontSize = style.fontSize ?? this.defaultFontSize
    const lineHeight = fontSize * 1.4

    const lines = this.wrapText(text, this.contentWidth, style)
    for (const line of lines) {
      this.drawTextLine(
        this.margins.left, this.y, line,
        this.contentWidth, 'left', style
      )
      this.y -= lineHeight
    }
  }

  /** Add right-aligned text (standard for Hebrew documents) */
  addRightText(text: string, style: TextStyle = {}): void {
    const fontSize = style.fontSize ?? this.defaultFontSize
    const lineHeight = fontSize * 1.4

    const lines = this.wrapText(text, this.contentWidth, style)
    for (const line of lines) {
      this.drawTextLine(
        this.margins.left, this.y, line,
        this.contentWidth, 'right', style
      )
      this.y -= lineHeight
    }
  }

  /**
   * Add a two-column row.
   * Used for headers like: [case number (left)]  ...  [court name (right)]
   */
  addRow(
    leftContent: { text: string; style?: TextStyle; border?: boolean },
    rightContent: { text: string; style?: TextStyle; border?: boolean }
  ): void {
    const leftStyle = leftContent.style ?? {}
    const rightStyle = rightContent.style ?? {}
    const fontSize = Math.max(
      leftStyle.fontSize ?? this.defaultFontSize,
      rightStyle.fontSize ?? this.defaultFontSize
    )
    const lineHeight = fontSize * 1.6

    // Draw left content
    if (leftContent.text) {
      this.drawTextLine(
        this.margins.left, this.y, leftContent.text,
        this.contentWidth / 2, 'left', leftStyle
      )
    }

    // Draw right content
    if (rightContent.text) {
      const rightX = this.margins.left + this.contentWidth / 2
      const rightW = this.contentWidth / 2
      this.drawTextLine(rightX, this.y, rightContent.text, rightW, 'right', rightStyle)
    }

    this.y -= lineHeight
  }

  /**
   * Add a multi-line section of content.
   * Renders lines sequentially with automatic Y tracking.
   */
  addBorderedSection(
    lines: Array<{ text: string; style?: TextStyle; alignment?: 'right' | 'center' | 'left' }>,
    _options: {
      borderColor?: [number, number, number]
      padding?: number
      borderWidth?: number
    } = {}
  ): void {
    for (const line of lines) {
      const fontSize = line.style?.fontSize ?? this.defaultFontSize
      const lineHeight = fontSize * 1.4
      const alignment = line.alignment ?? 'center'

      const wrapped = this.wrapText(line.text, this.contentWidth, line.style)
      for (const wl of wrapped) {
        this.drawTextLine(this.margins.left, this.y, wl, this.contentWidth, alignment, line.style)
        this.y -= lineHeight
      }
    }
  }

  /**
   * Add a heading with alignment support.
   * Supports center, right, and left alignment.
   */
  addBoxedHeading(
    text: string,
    style: TextStyle = {},
    options: { alignment?: 'center' | 'right' | 'left'; borderColor?: [number, number, number] } = {}
  ): void {
    const fontSize = style.fontSize ?? this.defaultFontSize
    const alignment = options.alignment ?? 'center'

    this.drawTextLine(
      this.margins.left, this.y, text,
      this.contentWidth, alignment, style
    )

    this.y -= fontSize * 1.4 + 10
  }

  /**
   * Add a right-aligned label (like "בעניין :").
   */
  addRightLabel(text: string, style: TextStyle = {}): void {
    const fontSize = style.fontSize ?? this.defaultFontSize

    this.drawTextLine(
      this.margins.left, this.y, text,
      this.contentWidth, 'right', style
    )

    this.y -= fontSize * 1.4 + 8
  }

  /**
   * Add a left-aligned label (like "להלן: "התובע"").
   */
  addLeftBoxedLabel(
    text: string,
    style: TextStyle = {},
    _borderColor: [number, number, number] = [0.86, 0.15, 0.15]
  ): void {
    const fontSize = style.fontSize ?? this.defaultFontSize

    this.drawTextLine(
      this.margins.left, this.y, text,
      this.contentWidth, 'left', style
    )

    this.y -= fontSize * 1.4 + 10
  }

  /**
   * Add a numbered paragraph (like "1. התובע, יליד...")
   * The number appears on the right, text wraps indented.
   */
  addNumberedParagraph(
    number: string,
    text: string,
    style: TextStyle = {}
  ): void {
    const fontSize = style.fontSize ?? this.defaultFontSize
    const lineHeight = fontSize * 1.4
    const indent = 25  // space for the number

    // Draw the number on the right
    this.drawTextLine(
      this.margins.left + this.contentWidth - indent,
      this.y,
      number,
      indent,
      'right',
      style
    )

    // Wrap the text in the indented area
    const textWidth = this.contentWidth - indent - 10
    const lines = this.wrapText(text, textWidth, style)

    for (let i = 0; i < lines.length; i++) {
      const lineText = lines[i]!
      this.drawTextLine(
        this.margins.left,
        this.y,
        lineText,
        textWidth,
        'right',
        style
      )
      this.y -= lineHeight
    }
  }

}
