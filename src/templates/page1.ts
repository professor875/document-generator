/**
 * Page 1 Template — Statement of Claim Header
 *
 * All red-boxed content is now dynamic via fields.
 * Headings use bordered boxes matching the original PDF layout.
 * Textarea fields are split by newlines and rendered line-by-line.
 */

import type { PageLayout } from './layout'
import type { DocumentFields } from './types'
import { renderHeader } from './header'

// Re-export DocumentFields so existing imports still work
export type { DocumentFields } from './types'

// -------------------------------------------------------------------
// Template function
// -------------------------------------------------------------------

/**
 * Render page 1 of the lawsuit document.
 */
export function renderPage1(layout: PageLayout, fields: DocumentFields): void {
  const bold = { bold: true } as const

  // ===============================================================
  // SECTION: Shared header (case number, parties, attorneys)
  // ===============================================================
  renderHeader(layout, fields)

  layout.addSpacing(12)

  // ===============================================================
  // SECTION: Case type and amounts (dynamic textarea, bordered box)
  // ===============================================================
  const caseInfoLines = fields.caseInfoBlock.split('\n').filter(l => l.trim())
  layout.addBorderedSection(
    caseInfoLines.map(line => ({
      text: line,
      style: { ...bold, fontSize: 10 },
      alignment: 'right' as const,
    })),
  )

  layout.addSpacing(12)

  // ===============================================================
  // SECTION: "הזמנה לדין" heading — bold underlined centered, boxed
  // ===============================================================
  layout.addBoxedHeading(fields.summonsHeading, { ...bold, fontSize: 11, underline: true })

  layout.addSpacing(8)

  // ===============================================================
  // SECTION: Summons text (dynamic textarea, no border)
  // ===============================================================
  layout.addRightText(fields.summonsText, { ...bold, fontSize: 10 })

  layout.addSpacing(12)

  // ===============================================================
  // SECTION: "כתב תביעה" heading — bold underlined centered, boxed
  // ===============================================================
  layout.addBoxedHeading(fields.claimHeading, { ...bold, fontSize: 12, underline: true })

  layout.addSpacing(10)

  // ===============================================================
  // SECTION: "צדדים:" heading — bold underlined right-aligned, boxed
  // ===============================================================
  layout.addBoxedHeading(fields.partiesHeading, { ...bold, fontSize: 10, underline: true }, { alignment: 'right' })

  layout.addSpacing(8)

  // ===============================================================
  // SECTION: Parties description
  // ===============================================================

  // Paragraph 1: Plaintiff description
  layout.addNumberedParagraph(
    '1.',
    `התובע, יליד ${fields.plaintiffBirthDate} מתגורר ב${fields.plaintiffCity}, והוא יהיה מיוצג ע"י בא כוחו הנ"ל כפי שמפורט בכותרת.`,
  )

  layout.addSpacing(3)
  layout.addRightText('מצ"ב ייפוי כוח כנספח המסומן א\'', { ...bold, fontSize: 9 })

  layout.addSpacing(6)

  // Paragraph 2: Defendant description
  layout.addNumberedParagraph(
    '2.',
    'הנתבעת הינה הפול חברה לביטוח בע"מ ,חברה לביטוח אשר התאגדה ופועלת בישראל כדין, ואשר במועדים הרלוונטיים לתביעה ביטחה את השימוש ברכבו של התובע בפוליסת ביטוח חובה',
  )

  layout.addSpacing(2)
  layout.addRightText(
    `שמספרה ${fields.policyNumber} בהתאם להוראות חוק פיצויים לנפגעי תאונות דרכים.`,
  )

  layout.addSpacing(3)
  layout.addRightText('מצ"ב פוליסת ביטוח חובה כנספח המסומן ב\'', { ...bold, fontSize: 9 })

  // ===============================================================
  // SECTION: Page number footer
  // ===============================================================
  layout.addSpacing(10)
  layout.drawTextLine(
    layout.margins.left, layout.margins.bottom - 10,
    '1 / 53', layout.contentWidth, 'left', { fontSize: 8 }
  )
}
