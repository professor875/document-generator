/**
 * Page 2 Template — Accident Event & Medical Treatments
 *
 * Contains:
 *   - "אירוע התאונה" section with items 3-4
 *   - Attachments references
 *   - "טיפולים רפואיים" section with items 5-11
 *
 * Headings use right-aligned bordered boxes (addBoxedHeading).
 * All dynamic values come from the fields object.
 */

import type { PageLayout } from './layout'
import type { DocumentFields } from './types'

/**
 * Render page 2 of the lawsuit document.
 */
export function renderPage2(layout: PageLayout, fields: DocumentFields): void {
  const bold = { bold: true } as const

  // ===============================================================
  // SECTION: "אירוע התאונה" heading — bold underlined, right-aligned bordered box
  // ===============================================================
  layout.addBoxedHeading(fields.accidentHeading, { ...bold, fontSize: 10, underline: true }, { alignment: 'right' })

  layout.addSpacing(8)

  // ===============================================================
  // SECTION: Item 3 — Accident description
  // ===============================================================
  layout.addNumberedParagraph(
    '3.',
    `ביום ${fields.accidentDate}, בשעה ${fields.accidentTime} או בסמוך לכך, נסע התובע ברכב מ.ר ${fields.plaintiffVehicleReg}, במהלך נסיעתו סטה אוטובוס של חברת ${fields.busCompany} מ.ר ${fields.busReg} מנתיב נסיעתו אל נתיב נסיעת התובע ופגע ברכבו. כתוצאה מהתאונה נגרמו לתובע נזקי גוף, והוא נזקק לקבלת טיפול רפואי.`,
  )

  layout.addSpacing(6)

  // ===============================================================
  // SECTION: Item 4 — Legal classification
  // ===============================================================
  layout.addNumberedParagraph(
    '4.',
    fields.accidentLegalText,
  )

  layout.addSpacing(6)

  // ===============================================================
  // SECTION: Attachments for accident
  // ===============================================================
  layout.addRightText('מצ"ב אישור משטרה על התאונה כנספח המסומן ג\'', { ...bold, fontSize: 9 })
  layout.addSpacing(2)
  layout.addRightText('מצ"ב רישיון נהיגה של הנהג בעת התרחשות התאונה כנספח המסומן ד\'', { ...bold, fontSize: 9 })
  layout.addSpacing(2)
  layout.addRightText('מצ"ב תמונות של הרכבים כנספח המסומן ה\'', { ...bold, fontSize: 9 })

  layout.addSpacing(12)

  // ===============================================================
  // SECTION: "טיפולים רפואיים" heading — bold underlined, right-aligned bordered box
  // ===============================================================
  layout.addBoxedHeading(fields.medicalHeading, { ...bold, fontSize: 10, underline: true }, { alignment: 'right' })

  layout.addSpacing(8)

  // ===============================================================
  // SECTION: Medical treatments — first 7 paragraphs (items 5-11)
  // ===============================================================
  const medicalParagraphs = fields.medicalTreatmentsText
    .split(/\n\s*\n/)
    .map(p => p.trim())
    .filter(p => p.length > 0)

  const page2Paragraphs = medicalParagraphs.slice(0, 7)
  for (const para of page2Paragraphs) {
    // Extract leading number (e.g. "5.") and the rest
    const match = para.match(/^(\d+\.)\s*(.*)$/s)
    if (match) {
      layout.addNumberedParagraph(match[1]!, match[2]!)
    } else {
      layout.addRightText(para)
    }
    layout.addSpacing(4)
  }

  // ===============================================================
  // SECTION: Page number footer
  // ===============================================================
  layout.drawTextLine(
    layout.margins.left, layout.margins.bottom - 10,
    '2 / 53', layout.contentWidth, 'left', { fontSize: 8 }
  )
}
