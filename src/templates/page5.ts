/**
 * Page 5 Template — Request for Medical Expert Appointment
 *
 * Contains:
 *   - Same header as page 1 (reuses renderHeader)
 *   - "בקשה למינוי מומחים רפואיים" as centered bold underlined (NO box)
 *   - Request text as plain paragraph (NO border)
 *   - Attorney signature line
 */

import type { PageLayout } from './layout'
import type { DocumentFields } from './types'
import { renderHeader } from './header'

/**
 * Render page 5 of the lawsuit document.
 */
export function renderPage5(layout: PageLayout, fields: DocumentFields): void {
  const bold = { bold: true } as const

  // ===============================================================
  // SECTION: Shared header (same as page 1)
  // ===============================================================
  renderHeader(layout, fields)

  layout.addSpacing(15)

  // ===============================================================
  // SECTION: "בקשה למינוי מומחים רפואיים" heading — bold underlined centered, NO box
  // ===============================================================
  layout.addCenteredText('בקשה למינוי מומחים רפואיים', { ...bold, fontSize: 10, underline: true })

  layout.addSpacing(10)

  // ===============================================================
  // SECTION: Request body (plain text, NO border)
  // ===============================================================
  layout.addRightText(
    'התובע מבקש בזאת למנות לו מומחה רפואי בנושא הנכות הרפואית שלו בתחום האורתופדיה, לצורך בדיקת התובע ומתן חוות דעת בעניין.',
    { fontSize: 9 }
  )

  layout.addSpacing(10)

  // ===============================================================
  // SECTION: Attached medical documentation note
  // ===============================================================
  layout.addRightText('*** רצ"ב העתק התיעוד הרפואי שברשותו.', { ...bold, fontSize: 9 })

  layout.addSpacing(30)

  // ===============================================================
  // SECTION: Attorney signature
  // ===============================================================
  layout.addCenteredText('____________________')
  layout.addSpacing(4)
  layout.addCenteredText(`${fields.attorneySignName},עו"ד`, { ...bold, fontSize: 10 })
  layout.addSpacing(2)
  layout.addCenteredText('ב"כ התובע', { fontSize: 9 })

  // ===============================================================
  // SECTION: Page number footer
  // ===============================================================
  layout.drawTextLine(
    layout.margins.left, layout.margins.bottom - 10,
    '5 / 53', layout.contentWidth, 'left', { fontSize: 8 }
  )
}
