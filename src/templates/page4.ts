/**
 * Page 4 Template — Legal Prayer for Relief & Signature
 *
 * Contains:
 *   - Items 20-23 as dynamic textarea (legal claims and prayer) in bordered section
 *   - Attachment reference
 *   - Attorney signature line in bordered section
 */

import type { PageLayout } from './layout'
import type { DocumentFields } from './types'

/**
 * Render page 4 of the lawsuit document.
 */
export function renderPage4(layout: PageLayout, fields: DocumentFields): void {
  const bold = { bold: true } as const

  // ===============================================================
  // SECTION: Items 20-23 — Legal prayer for relief (bordered, red border)
  // ===============================================================
  const prayerLines = fields.legalPrayer.split('\n').filter(l => l.trim())
  layout.addBorderedSection(
    prayerLines.map(line => ({ text: line, style: { fontSize: 10 }, alignment: 'right' as const })),
    { borderColor: [0.86, 0.15, 0.15] }
  )

  layout.addSpacing(10)

  // ===============================================================
  // SECTION: Attachment reference
  // ===============================================================
  layout.addRightText('מצ"ב הצהרת תובע כנספח המסומן ח\'', { ...bold, fontSize: 9 })

  layout.addSpacing(30)

  // ===============================================================
  // SECTION: Attorney signature (bordered)
  // ===============================================================
  layout.addBorderedSection(
    [
      { text: '____________________', alignment: 'center' as const },
      { text: `${fields.attorneySignName}, עו"ד`, style: { ...bold, fontSize: 10 }, alignment: 'center' as const },
      { text: fields.signatureTitle, style: { fontSize: 9 }, alignment: 'center' as const },
    ]
  )

  // ===============================================================
  // SECTION: Page number footer
  // ===============================================================
  layout.drawTextLine(
    layout.margins.left, layout.margins.bottom - 10,
    '4 / 53', layout.contentWidth, 'left', { fontSize: 8 }
  )
}
