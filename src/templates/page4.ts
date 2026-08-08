/**
 * Page 4 Template — Legal Prayer for Relief & Signature
 *
 * Contains:
 *   - Items 20-23 as dynamic textarea (legal claims and prayer)
 *   - Attachment reference
 *   - Attorney signature line
 *
 * NO bordered sections — all content rendered as plain text.
 */

import type { PageLayout } from './layout'
import type { DocumentFields } from './types'

/**
 * Render page 4 of the lawsuit document.
 */
export function renderPage4(layout: PageLayout, fields: DocumentFields): void {
  const bold = { bold: true } as const

  // ===============================================================
  // SECTION: Items 20-23 — Legal prayer for relief (dynamic textarea, NO border)
  // ===============================================================
  const prayerLines = fields.legalPrayer.split('\n').filter(l => l.trim())
  for (const line of prayerLines) {
    layout.addRightText(line, { fontSize: 9 })
  }

  layout.addSpacing(10)

  // ===============================================================
  // SECTION: Attachment reference
  // ===============================================================
  layout.addRightText('מצ"ב הצהרת תובע כנספח המסומן ח\'', { ...bold, fontSize: 8 })

  layout.addSpacing(30)

  // ===============================================================
  // SECTION: Attorney signature
  // ===============================================================
  layout.addCenteredText('____________________')
  layout.addSpacing(4)
  layout.addCenteredText(`${fields.attorneySignName}, עו"ד`, { ...bold, fontSize: 10 })
  layout.addSpacing(2)
  layout.addCenteredText(fields.signatureTitle, { fontSize: 9 })

  // ===============================================================
  // SECTION: Page number footer
  // ===============================================================
  layout.drawTextLine(
    layout.margins.left, layout.margins.bottom - 10,
    '4 / 53', layout.contentWidth, 'left', { fontSize: 8 }
  )
}
