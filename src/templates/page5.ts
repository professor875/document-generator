/**
 * Page 5 Template — Request for Medical Expert Appointment
 *
 * Contains:
 *   - Header matching page 1 style (bordered court name/case number,
 *     red-bordered plaintiff/defendant labels)
 *   - "בקשה למינוי מומחים רפואיים" as centered bordered heading
 *   - Request body, note, and signature inside one bordered section
 */

import type { PageLayout } from './layout'
import type { DocumentFields } from './types'

/**
 * Render page 5 of the lawsuit document.
 */
export function renderPage5(layout: PageLayout, fields: DocumentFields): void {
  const bold = { bold: true } as const

  // ===============================================================
  // SECTION: Page 5 header (matching page 1 style)
  // ===============================================================

  // Court header row: case number (left, bordered) + court name (right, bordered)
  layout.addRow(
    { text: fields.p5CaseNumber, style: { ...bold, fontSize: 11 }, border: true },
    { text: fields.p5CourtName, style: { ...bold, fontSize: 13, underline: true }, border: true }
  )

  layout.addSpacing(12)

  // "בעניין:" label — right-aligned, bordered box
  layout.addRightLabel(fields.p5RegardingLabel)

  layout.addSpacing(5)

  // Plaintiff details (all dynamic, no borders)
  layout.addCenteredText(
    `${fields.p5PlaintiffName}  ת"ז ${fields.p5PlaintiffId}`,
    { ...bold, fontSize: 11 }
  )
  layout.addCenteredText(fields.p5PlaintiffAddress)
  layout.addCenteredText(`טל: ${fields.p5PlaintiffPhone}`)
  layout.addCenteredText(fields.p5Attorney1)
  layout.addCenteredText(fields.p5Attorney2)
  layout.addCenteredText(fields.p5AttorneyAddress)
  layout.addCenteredText(`טל: ${fields.p5AttorneyPhone}`)
  layout.addCenteredText(fields.p5Email)

  layout.addSpacing(6)

  // Plaintiff label — left-aligned red bordered box, bold+underline
  layout.addLeftBoxedLabel(fields.p5PlaintiffLabel, { ...bold, fontSize: 10, underline: true })

  layout.addSpacing(10)

  // "נ ג ד" (versus) — centered, 11pt
  layout.addCenteredText('נ       ג       ד', { fontSize: 11 })

  layout.addSpacing(10)

  // Defendant details (company name is static, ID is dynamic)
  layout.addCenteredText(
    'התאגיד המנהל של המאגר לביטוח רכב חובה ("הפול") בע"מ',
    { ...bold, fontSize: 10 }
  )
  layout.addCenteredText(`ח.פ ${fields.p5DefendantCompanyId}`)
  layout.addCenteredText('אצי"ל 1, ראשון לציון')

  layout.addSpacing(6)

  // Defendant label — left-aligned red bordered box, bold+underline
  layout.addLeftBoxedLabel(fields.p5DefendantLabel, { ...bold, fontSize: 10, underline: true })

  layout.addSpacing(15)

  // ===============================================================
  // SECTION: "בקשה למינוי מומחים רפואיים" heading — centered bordered box
  // ===============================================================
  layout.addBoxedHeading(fields.expertRequestHeading, { ...bold, fontSize: 11, underline: true })

  layout.addSpacing(10)

  // ===============================================================
  // SECTION: Request body + note + signature in one bordered section
  // ===============================================================
  layout.addBorderedSection([
    { text: fields.expertRequestBody, style: { fontSize: 10 }, alignment: 'right' },
    { text: '', style: { fontSize: 6 } },
    { text: fields.expertRequestNote, style: { ...bold, fontSize: 10 }, alignment: 'right' },
    { text: '', style: { fontSize: 20 } },
    { text: '____________________', alignment: 'left' },
    { text: `${fields.p5SignName},עו"ד`, style: { ...bold, fontSize: 10 }, alignment: 'left' },
    { text: fields.p5SignTitle, style: { fontSize: 9 }, alignment: 'left' },
  ], { borderColor: [0.86, 0.15, 0.15] })

  // ===============================================================
  // SECTION: Page number footer
  // ===============================================================
  layout.drawTextLine(
    layout.margins.left, layout.margins.bottom - 10,
    '5 / 53', layout.contentWidth, 'left', { fontSize: 8 }
  )
}
