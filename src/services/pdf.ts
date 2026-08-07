/**
 * PDF Generation Service
 *
 * Loads the existing PDF template, overlays user-provided values onto
 * the editable (red-highlighted) fields, and returns the modified PDF
 * as a Uint8Array ready for download or preview.
 *
 * KEY DESIGN DECISIONS:
 *
 * 1. "White Rectangle + Text Overlay" approach
 *    The template PDF has no AcroForm fields.  For each editable area:
 *      a) Draw a white rectangle to cover the original content.
 *      b) Draw the user's new text on top at the same position.
 *
 * 2. Segment-based Hebrew/RTL text rendering
 *    Analysis of the original template PDF revealed that it encodes:
 *      - Hebrew text in VISUAL order (reversed) using a custom font
 *      - Numbers/English in LOGICAL order (as-is)
 *    When we use a Unicode font (Noto Sans Hebrew), PDF viewers may
 *    apply BiDi to text containing Hebrew characters, which reverses
 *    embedded numbers (double-reversal).
 *
 *    Solution: NEVER mix Hebrew and non-Hebrew characters in a single
 *    drawText() call.  Instead, split the text into same-script
 *    segments and draw each one separately:
 *      - Hebrew segments: reverse characters for visual rendering
 *      - Number/English segments: keep in logical order
 *      - Position all segments right-to-left (RTL base direction)
 *
 * 3. Fonts
 *    Noto Sans Hebrew (Regular + Bold) is embedded into the PDF.
 */

import { PDFDocument, rgb } from 'pdf-lib'
import type { PDFFont, PDFPage } from 'pdf-lib'
import fontkit from '@pdf-lib/fontkit'

import { DOCUMENT_FIELDS } from './fields'
import type { FieldDefinition, FieldPlacement } from './fields'

import fontRegularUrl from '@/assets/NotoSansHebrew-Regular.ttf'
import fontBoldUrl from '@/assets/NotoSansHebrew-Bold.ttf'

// -------------------------------------------------------------------
// Segment-based RTL text processing
// -------------------------------------------------------------------

/**
 * A segment of text with a single script direction.
 *
 *   text  — the characters in this segment
 *   isRTL — true for Hebrew characters, false for numbers/Latin/etc.
 */
interface TextSegment {
  text: string
  isRTL: boolean
}

/**
 * Check if a character is in the Hebrew Unicode range.
 * Covers the main Hebrew block (U+0590–U+05FF) and the
 * Hebrew presentation forms (U+FB1D–U+FB4F).
 */
function isHebrew(ch: string): boolean {
  const code = ch.charCodeAt(0)
  return (code >= 0x0590 && code <= 0x05FF) ||
         (code >= 0xFB1D && code <= 0xFB4F)
}

/**
 * Check if a character is "strongly directional" (LTR).
 * Digits and Latin letters are LTR.
 */
function isLTR(ch: string): boolean {
  const code = ch.charCodeAt(0)
  // ASCII digits
  if (code >= 0x30 && code <= 0x39) return true
  // ASCII Latin letters
  if (code >= 0x41 && code <= 0x5A) return true  // A-Z
  if (code >= 0x61 && code <= 0x7A) return true  // a-z
  return false
}

/**
 * Split a string into segments of same-direction text.
 *
 * Each segment contains either:
 *   - Hebrew characters (RTL) — possibly with attached punctuation
 *   - Non-Hebrew characters (LTR) — digits, Latin, punctuation
 *
 * Neutral characters (spaces, punctuation like :,-."') are attached
 * to the segment of the previous strong character's direction.  If
 * there's no previous strong character, they attach to the next one.
 *
 * Examples:
 *   "ת"א 07-26-"   → [{text: "ת\"א ", isRTL: true}, {text: "07-26-", isRTL: false}]
 *   "טל: 050-7761618" → [{text: "טל: ", isRTL: true}, {text: "050-7761618", isRTL: false}]
 *   "E-MAIL: ananhosenadv@gmail.com" → [{text: "E-MAIL: ananhosenadv@gmail.com", isRTL: false}]
 */
function splitIntoSegments(text: string): TextSegment[] {
  if (!text) return []

  const segments: TextSegment[] = []
  let currentText = ''
  let currentIsRTL: boolean | null = null  // null = undecided (only neutrals so far)

  for (let i = 0; i < text.length; i++) {
    const ch = text[i]!
    const charIsHebrew = isHebrew(ch)
    const charIsLTR = isLTR(ch)

    if (charIsHebrew) {
      // Strong RTL character
      if (currentIsRTL === false) {
        // Direction changed from LTR → RTL: flush the LTR segment
        segments.push({ text: currentText, isRTL: false })
        currentText = ''
      }
      currentIsRTL = true
      currentText += ch
    } else if (charIsLTR) {
      // Strong LTR character
      if (currentIsRTL === true) {
        // Direction changed from RTL → LTR: flush the RTL segment
        segments.push({ text: currentText, isRTL: true })
        currentText = ''
      }
      currentIsRTL = false
      currentText += ch
    } else {
      // Neutral character (space, punctuation, etc.)
      // Attach to current segment direction
      currentText += ch
    }
  }

  // Flush remaining text
  if (currentText) {
    segments.push({ text: currentText, isRTL: currentIsRTL ?? true })
  }

  return segments
}

/**
 * Reverse a string character by character.
 * Used to convert Hebrew text from logical to visual order.
 */
function reverseString(s: string): string {
  return s.split('').reverse().join('')
}

// -------------------------------------------------------------------
// Font loading (cached)
// -------------------------------------------------------------------

let fontCache: {
  regular: ArrayBuffer
  bold: ArrayBuffer
} | null = null

async function loadFonts(): Promise<{ regular: ArrayBuffer; bold: ArrayBuffer }> {
  if (fontCache) return fontCache

  const [regularResp, boldResp] = await Promise.all([
    fetch(fontRegularUrl),
    fetch(fontBoldUrl),
  ])

  fontCache = {
    regular: await regularResp.arrayBuffer(),
    bold: await boldResp.arrayBuffer(),
  }

  return fontCache
}

// -------------------------------------------------------------------
// Template loading (cached)
// -------------------------------------------------------------------

let templateCache: ArrayBuffer | null = null

async function loadTemplate(): Promise<ArrayBuffer> {
  if (templateCache) return templateCache

  const resp = await fetch('/template.pdf')
  templateCache = await resp.arrayBuffer()
  return templateCache
}

// -------------------------------------------------------------------
// Core: draw one field onto the PDF
// -------------------------------------------------------------------

/**
 * Draw a single field value onto the PDF at each of its placements.
 *
 * The text is split into segments and each segment is drawn as a
 * separate drawText() call to avoid PDF viewer BiDi interference.
 *
 * Segment positioning for RTL base direction:
 *   - Segments are arranged right-to-left within the field area.
 *   - The first logical segment (e.g., "ת"א ") appears rightmost.
 *   - Hebrew segments have their characters reversed.
 *   - Number/English segments keep their logical order.
 *
 * @param doc    The loaded PDFDocument
 * @param field  The field definition (placements, font info)
 * @param value  The user-entered text for this field
 * @param fonts  Embedded regular and bold PDFFont instances
 */
function drawField(
  doc: PDFDocument,
  field: FieldDefinition,
  value: string,
  fonts: { regular: PDFFont; bold: PDFFont }
): void {
  const font = field.bold ? fonts.bold : fonts.regular
  const fontSize = field.fontSize

  // Split text into directional segments
  const segments = splitIntoSegments(value)

  // Prepare each segment: reverse RTL segments, measure widths
  const prepared = segments.map(seg => {
    // For RTL segments, reverse the characters so they render
    // correctly when drawn left-to-right by pdf-lib.
    const displayText = seg.isRTL ? reverseString(seg.text) : seg.text
    const width = font.widthOfTextAtSize(displayText, fontSize)
    return { displayText, width, isRTL: seg.isRTL }
  })

  // Calculate total width of all segments combined
  const totalWidth = prepared.reduce((sum, p) => sum + p.width, 0)

  for (const placement of field.placements) {
    const page: PDFPage = doc.getPage(placement.page)

    // Step 1: Draw white rectangle to erase original content
    page.drawRectangle({
      x: placement.x,
      y: placement.y,
      width: placement.width,
      height: placement.height,
      color: rgb(1, 1, 1),
      borderWidth: 0,
    })

    // Step 2: Calculate the starting X position based on alignment.
    // For RTL text, the "start" is the RIGHT edge.
    // Baseline sits at ~35% of the rectangle height from the bottom.
    // This vertically centers text within the generous cover rectangle.
    const baselineY = placement.y + placement.height * 0.35
    const align = field.align || 'center'

    let startRight: number  // right edge of where the text block goes

    if (align === 'right') {
      startRight = placement.x + placement.width - 2
    } else if (align === 'left') {
      startRight = placement.x + totalWidth + 2
    } else {
      // Center
      startRight = placement.x + (placement.width + totalWidth) / 2
    }

    // Step 3: Draw each segment right-to-left.
    // The first segment in the array is the rightmost (since Hebrew
    // reads right-to-left, the first word appears on the right).
    let cursorRight = startRight

    for (const seg of prepared) {
      // Position this segment so its right edge aligns with cursorRight
      const segX = cursorRight - seg.width

      page.drawText(seg.displayText, {
        x: Math.max(placement.x, segX),
        y: baselineY,
        size: fontSize,
        font,
        color: rgb(0, 0, 0),
      })

      // Move cursor left for the next segment
      cursorRight -= seg.width
    }
  }
}

// -------------------------------------------------------------------
// Public API
// -------------------------------------------------------------------

/**
 * Generate a PDF document by overlaying user values onto the template.
 *
 * @param formData  Object mapping field IDs to user-entered values
 * @returns         The PDF file as a Uint8Array (ready for Blob creation)
 */
export async function generateDocument(
  formData: Record<string, string>
): Promise<Uint8Array> {
  const [templateBytes, fontBytes] = await Promise.all([
    loadTemplate(),
    loadFonts(),
  ])

  const doc = await PDFDocument.load(templateBytes, {
    ignoreEncryption: true,
  })

  doc.registerFontkit(fontkit)

  const regularFont = await doc.embedFont(fontBytes.regular)
  const boldFont = await doc.embedFont(fontBytes.bold)
  const fonts = { regular: regularFont, bold: boldFont }

  for (const field of DOCUMENT_FIELDS) {
    const value = formData[field.id]
    const textToDraw = (value !== undefined && value !== '')
      ? value
      : field.defaultValue

    drawField(doc, field, textToDraw, fonts)
  }

  return doc.save()
}
