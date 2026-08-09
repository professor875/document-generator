/**
 * Shared Header Template
 *
 * Renders the document header (case number, plaintiff details,
 * attorneys, defendant) used by both page 1 and page 5.
 *
 * Both the court name and case number are bordered boxes.
 * Plaintiff/defendant labels use red-bordered left-aligned boxes.
 */

import type { PageLayout } from './layout'
import type { DocumentFields } from './types'

/**
 * Render the standard document header with case number, court name,
 * plaintiff details, attorneys, and defendant information.
 */
export function renderHeader(layout: PageLayout, fields: DocumentFields): void {
  const bold = { bold: true } as const

  // Court header row: case number (left, bordered) + court name (right, bordered)
  layout.addRow(
    { text: fields.caseNumber, style: { ...bold, fontSize: 11 }, border: true },
    { text: fields.courtName, style: { ...bold, fontSize: 13, underline: true }, border: true }
  )

  layout.addSpacing(12)

  // "בעניין:" label — right-aligned, bordered box
  layout.addRightLabel(fields.regardingLabel)

  layout.addSpacing(5)

  // Plaintiff details (all dynamic, no borders)
  layout.addCenteredText(
    `${fields.plaintiffName}  ת"ז ${fields.plaintiffId}`,
    { ...bold, fontSize: 11 }
  )
  layout.addCenteredText(fields.plaintiffAddress)
  layout.addCenteredText(`טל: ${fields.plaintiffPhone}`)
  layout.addCenteredText(fields.attorney1)
  layout.addCenteredText(fields.attorney2)
  layout.addCenteredText(fields.attorneyAddress)
  layout.addCenteredText(`טל: ${fields.attorneyPhone}`)
  layout.addCenteredText(fields.email)

  layout.addSpacing(6)

  // Plaintiff label — left-aligned red bordered box, bold+underline
  layout.addLeftBoxedLabel(fields.plaintiffLabel, { ...bold, fontSize: 10, underline: true })

  layout.addSpacing(10)

  // "נ ג ד" (versus) — centered, ~11pt
  layout.addCenteredText('נ       ג       ד', { fontSize: 11 })

  layout.addSpacing(10)

  // Defendant details (company name is static, ID is dynamic)
  layout.addCenteredText(
    'התאגיד המנהל של המאגר לביטוח רכב חובה ("הפול") בע"מ',
    { ...bold, fontSize: 10 }
  )
  layout.addCenteredText(`ח.פ ${fields.defendantCompanyId}`)
  layout.addCenteredText('אצי"ל 1, ראשון לציון')

  layout.addSpacing(6)

  // Defendant label — left-aligned red bordered box, bold+underline
  layout.addLeftBoxedLabel(fields.defendantLabel, { ...bold, fontSize: 10, underline: true })
}
