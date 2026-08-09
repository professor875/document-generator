/**
 * Page 3 Template — Continued Medical & Damages
 *
 * Contains:
 *   - Continuation of item 11 from page 2
 *   - Items 12-14 (continued medical documentation)
 *   - Attachments references
 *   - "סעדים נדרשים" heading (bordered box) and claims text (dynamic textarea)
 *   - Special and general damages with bordered sections (dynamic textareas)
 *
 * Headings use bordered boxes matching the original PDF layout.
 * Damage sections use bordered sections with dynamic textarea content.
 */

import type { PageLayout } from './layout'
import type { DocumentFields } from './types'

/**
 * Render page 3 of the lawsuit document.
 */
export function renderPage3(layout: PageLayout, fields: DocumentFields): void {
  const bold = { bold: true } as const

  // ===============================================================
  // SECTION: Medical treatments — remaining paragraphs (items 12-14)
  // ===============================================================
  const medicalParagraphs = fields.medicalTreatmentsText
    .split(/\n\s*\n/)
    .map(p => p.trim())
    .filter(p => p.length > 0)

  const page3Paragraphs = medicalParagraphs.slice(7)
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
  layout.addRightText('תיעוד רפואי מצורף כנספח המסומן ו\'', { ...bold, fontSize: 9 })
  layout.addSpacing(2)
  layout.addRightText('טופס ויתור על סודיות רפואית מצורף כנספח המסומן ז\'', { ...bold, fontSize: 9 })

  layout.addSpacing(12)

  // ===============================================================
  // SECTION: "סעדים נדרשים" heading — bold underlined, bordered box
  // ===============================================================
  layout.addBoxedHeading(fields.remediesHeading, { ...bold, fontSize: 10, underline: true }, { alignment: 'right' })

  layout.addSpacing(8)

  // ===============================================================
  // SECTION: Claims text (dynamic textarea, items 15-19)
  // ===============================================================
  const claimsLines = fields.claimsText.split('\n').filter(l => l.trim())
  for (const line of claimsLines) {
    layout.addRightText(line)
  }

  layout.addSpacing(8)

  // ===============================================================
  // SECTION: Special damages — heading as bold underlined, bordered box
  // ===============================================================
  layout.addBoxedHeading(fields.specialDamagesHeading, { ...bold, fontSize: 10, underline: true }, { alignment: 'center' })

  layout.addSpacing(4)

  // Special damage items (dynamic textarea) — bordered section
  const specialLines = fields.specialDamages.split('\n').filter(l => l.trim())
  layout.addBorderedSection(
    specialLines.map(line => ({ text: line, alignment: 'right' as const }))
  )

  layout.addSpacing(6)

  // ===============================================================
  // SECTION: General damages — heading as bold underlined, bordered box
  // ===============================================================
  layout.addBoxedHeading(fields.generalDamagesHeading, { ...bold, fontSize: 10, underline: true }, { alignment: 'center' })

  layout.addSpacing(4)

  // General damage items (dynamic textarea) — bordered section
  const generalLines = fields.generalDamages.split('\n').filter(l => l.trim())
  layout.addBorderedSection(
    generalLines.map(line => ({ text: line, alignment: 'right' as const }))
  )

  // ===============================================================
  // SECTION: Page number footer
  // ===============================================================
  layout.drawTextLine(
    layout.margins.left, layout.margins.bottom - 10,
    '3 / 53', layout.contentWidth, 'left', { fontSize: 8 }
  )
}
