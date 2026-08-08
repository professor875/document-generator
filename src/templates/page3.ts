/**
 * Page 3 Template — Continued Medical & Damages
 *
 * Contains:
 *   - Continuation of item 11 from page 2
 *   - Items 12-14 (continued medical documentation)
 *   - Attachments references
 *   - "סעדים נדרשים" heading and claims text (dynamic textarea)
 *   - Special and general damages (dynamic textareas)
 *
 * All headings are bold underlined text WITHOUT bordered boxes.
 * Damage sections use dynamic textarea content.
 */

import type { PageLayout } from './layout'
import type { DocumentFields } from './types'

/**
 * Render page 3 of the lawsuit document.
 */
export function renderPage3(layout: PageLayout, fields: DocumentFields): void {
  const bold = { bold: true } as const

  // ===============================================================
  // SECTION: Medical treatments — remaining paragraphs (items 11-14)
  // ===============================================================
  const medicalParagraphs = fields.medicalTreatmentsText
    .split(/\n\s*\n/)
    .map(p => p.trim())
    .filter(p => p.length > 0)

  const page3Paragraphs = medicalParagraphs.slice(6)
  for (const para of page3Paragraphs) {
    const match = para.match(/^(\d+\.)\s*(.*)$/s)
    if (match) {
      layout.addNumberedParagraph(match[1]!, match[2]!)
    } else {
      layout.addRightText(para)
    }
    layout.addSpacing(6)
  }

  layout.addSpacing(6)

  // ===============================================================
  // SECTION: Medical attachments
  // ===============================================================
  layout.addRightText('תיעוד רפואי מצורף כנספח המסומן ו\'', { ...bold, fontSize: 8 })
  layout.addSpacing(2)
  layout.addRightText('טופס ויתור על סודיות רפואית מצורף כנספח המסומן ז\'', { ...bold, fontSize: 8 })

  layout.addSpacing(10)

  // ===============================================================
  // SECTION: "סעדים נדרשים" heading — bold underlined, NO box
  // ===============================================================
  layout.addRightText(fields.remediesHeading, { ...bold, fontSize: 10, underline: true })

  layout.addSpacing(6)

  // ===============================================================
  // SECTION: Claims text (dynamic textarea, items 15-19)
  // ===============================================================
  const claimsLines = fields.claimsText.split('\n').filter(l => l.trim())
  for (const line of claimsLines) {
    layout.addRightText(line, { fontSize: 9 })
  }

  layout.addSpacing(6)

  // ===============================================================
  // SECTION: Special damages — heading as bold underlined, NO box
  // ===============================================================
  layout.addRightText(fields.specialDamagesHeading, { ...bold, fontSize: 9, underline: true })

  layout.addSpacing(4)

  // Special damage items (dynamic textarea)
  const specialLines = fields.specialDamages.split('\n').filter(l => l.trim())
  for (const line of specialLines) {
    layout.addRightText(line)
    layout.addSpacing(2)
  }

  layout.addSpacing(4)

  // ===============================================================
  // SECTION: General damages — heading as bold underlined, NO box
  // ===============================================================
  layout.addRightText(fields.generalDamagesHeading, { ...bold, fontSize: 9, underline: true })

  layout.addSpacing(4)

  // General damage items (dynamic textarea)
  const generalLines = fields.generalDamages.split('\n').filter(l => l.trim())
  for (const line of generalLines) {
    layout.addRightText(line)
    layout.addSpacing(2)
  }

  // ===============================================================
  // SECTION: Page number footer
  // ===============================================================
  layout.drawTextLine(
    layout.margins.left, layout.margins.bottom - 10,
    '3 / 53', layout.contentWidth, 'left', { fontSize: 8 }
  )
}
