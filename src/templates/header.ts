/**
 * Shared Header Template
 *
 * Renders the document header (case number, plaintiff details,
 * attorneys, defendant) used by both page 1 and page 5.
 *
 * Borders are ONLY used for the case number box (top left).
 * All other content is rendered without borders.
 */

import type { PageLayout } from './layout'
import type { DocumentFields } from './types'

/**
 * Render the standard document header with case number, court name,
 * plaintiff details, attorneys, and defendant information.
 */
export function renderHeader(layout: PageLayout, fields: DocumentFields): void {
  const bold = { bold: true } as const

  // Court header row: case number (left, bordered) + court name (right, no border)
  layout.addRow(
    { text: fields.caseNumber, style: { ...bold, fontSize: 10 } },
    { text: fields.courtName, style: { ...bold, fontSize: 10, underline: true } }
  )

  layout.addSpacing(8)

  // "בעניין:" label — keep border per requirements
  layout.addRightLabel('בעניין :')

  layout.addSpacing(2)

  // Plaintiff details (all dynamic, no borders)
  layout.addCenteredText(
    `${fields.plaintiffName}  ת"ז ${fields.plaintiffId}`,
    { ...bold, fontSize: 10 }
  )
  layout.addCenteredText(fields.plaintiffAddress)
  layout.addCenteredText(`טל: ${fields.plaintiffPhone}`)
  layout.addCenteredText(fields.attorney1)
  layout.addCenteredText(fields.attorney2)
  layout.addCenteredText(fields.attorneyAddress)
  layout.addCenteredText(`טל: ${fields.attorneyPhone}`)
  layout.addCenteredText(fields.email)

  layout.addSpacing(4)

  // Plaintiff label — dynamic, rendered as plain bold text (no border)
  layout.addRightText(fields.plaintiffLabel, { ...bold, fontSize: 9 })

  layout.addSpacing(8)

  // "נ ג ד" (versus) — static
  layout.addCenteredText('נ       ג       ד', { fontSize: 10 })

  layout.addSpacing(8)

  // Defendant details (company name is static, ID is dynamic)
  layout.addCenteredText(
    'התאגיד המנהל של המאגר לביטוח רכב חובה ("הפול") בע"מ',
    { ...bold, fontSize: 9 }
  )
  layout.addCenteredText(`ח.פ ${fields.defendantCompanyId}`)
  layout.addCenteredText('אצי"ל 1, ראשון לציון')

  layout.addSpacing(4)

  // Defendant label — dynamic, rendered as plain bold text (no border)
  layout.addRightText(fields.defendantLabel, { ...bold, fontSize: 9 })
}
