/**
 * Page 5 Template — Request for Medical Expert Appointment
 *
 * Contains:
 *   - Separate header fields (independent from page 1)
 *   - "בקשה למינוי מומחים רפואיים" as centered bold underlined (NO box)
 *   - Request text as plain paragraph (NO border)
 *   - Attorney signature line
 */

import type { PageLayout } from './layout'
import type { DocumentFields } from './types'

/**
 * Render page 5 of the lawsuit document.
 */
export function renderPage5(layout: PageLayout, fields: DocumentFields): void {
  const bold = { bold: true } as const

  // ===============================================================
  // SECTION: Page 5 header (independent from page 1)
  // ===============================================================

  // Court header row: case number (left, bordered) + court name (right, no border)
  layout.addRow(
    { text: fields.p5CaseNumber, style: { ...bold, fontSize: 10 } },
    { text: fields.p5CourtName, style: { ...bold, fontSize: 10, underline: true } }
  )

  layout.addSpacing(8)

  // "בעניין:" label
  layout.addRightLabel(fields.p5RegardingLabel)

  layout.addSpacing(2)

  // Plaintiff details
  layout.addCenteredText(
    `${fields.p5PlaintiffName}  ת"ז ${fields.p5PlaintiffId}`,
    { ...bold, fontSize: 10 }
  )
  layout.addCenteredText(fields.p5PlaintiffAddress)
  layout.addCenteredText(`טל: ${fields.p5PlaintiffPhone}`)
  layout.addCenteredText(fields.p5Attorney1)
  layout.addCenteredText(fields.p5Attorney2)
  layout.addCenteredText(fields.p5AttorneyAddress)
  layout.addCenteredText(`טל: ${fields.p5AttorneyPhone}`)
  layout.addCenteredText(fields.p5Email)

  layout.addSpacing(4)

  // Plaintiff label
  layout.addLeftText(fields.p5PlaintiffLabel, { ...bold, fontSize: 9 })

  layout.addSpacing(8)

  // "נ ג ד" (versus)
  layout.addCenteredText('נ       ג       ד', { fontSize: 10 })

  layout.addSpacing(8)

  // Defendant details
  layout.addCenteredText(
    'התאגיד המנהל של המאגר לביטוח רכב חובה ("הפול") בע"מ',
    { ...bold, fontSize: 9 }
  )
  layout.addCenteredText(`ח.פ ${fields.p5DefendantCompanyId}`)
  layout.addCenteredText('אצי"ל 1, ראשון לציון')

  layout.addSpacing(4)

  // Defendant label
  layout.addLeftText(fields.p5DefendantLabel, { ...bold, fontSize: 9 })

  layout.addSpacing(15)

  // ===============================================================
  // SECTION: "בקשה למינוי מומחים רפואיים" heading — bold underlined centered, NO box
  // ===============================================================
  layout.addCenteredText(fields.expertRequestHeading, { ...bold, fontSize: 10, underline: true })

  layout.addSpacing(10)

  // ===============================================================
  // SECTION: Request body (plain text, NO border)
  // ===============================================================
  layout.addRightText(fields.expertRequestBody, { fontSize: 9 })

  layout.addSpacing(10)

  // ===============================================================
  // SECTION: Attached medical documentation note
  // ===============================================================
  layout.addRightText(fields.expertRequestNote, { ...bold, fontSize: 9 })

  layout.addSpacing(30)

  // ===============================================================
  // SECTION: Attorney signature
  // ===============================================================
  layout.addCenteredText('____________________')
  layout.addSpacing(4)
  layout.addCenteredText(`${fields.p5SignName},עו"ד`, { ...bold, fontSize: 10 })
  layout.addSpacing(2)
  layout.addCenteredText(fields.p5SignTitle, { fontSize: 9 })

  // ===============================================================
  // SECTION: Page number footer
  // ===============================================================
  layout.drawTextLine(
    layout.margins.left, layout.margins.bottom - 10,
    '5 / 53', layout.contentWidth, 'left', { fontSize: 8 }
  )
}
