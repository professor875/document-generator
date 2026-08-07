/**
 * Page 3 Template — Continued Medical & Damages
 *
 * Contains:
 *   - Continuation of item 11 from page 2
 *   - Items 12-14 (continued medical documentation)
 *   - Attachments references
 *   - "סעדים נדרשים" heading and claims text (dynamic textarea)
 *   - Special and general damages (dynamic textareas)
 *
 * All headings are bold underlined text WITHOUT bordered boxes.
 * Damage sections use dynamic textarea content.
 */

import type { PageLayout } from './layout'
import type { DocumentFields } from './types'

/**
 * Render page 3 of the lawsuit document.
 */
export function renderPage3(layout: PageLayout, fields: DocumentFields): void {
  const bold = { bold: true } as const

  // ===============================================================
  // SECTION: Continuation of item 11 from page 2
  // ===============================================================
  layout.addRightText(
    'בתנועות עמוד השדרה הצווארי והמותני. ממצאי בדיקות ההדמיה נבחנו והומלץ על המשך טיפול שמרני, טיפול תרופתי, פיזיותרפיה והמשך מעקב אורתופדי.',
  )

  layout.addSpacing(6)

  // ===============================================================
  // SECTION: Item 12 — Additional orthopedic follow-up
  // ===============================================================
  layout.addNumberedParagraph(
    '12.',
    `ביום ${fields.medicalVisit6Date} נבדק התובע בביקורת אורתופדית נוספת. התובע המשיך להתלונן על כאבים בצוואר ובגב התחתון, על אף הטיפולים שעבר. בבדיקה נמצאו רגישות במישוש עמוד השדרה הצווארי והמותני. לאור התלונות המתמשכות וממצאי בדיקות ההדמיה הומלץ על המשך טיפול תרופתי, פיזיותרפיה, טיפול נגד כאבים והמשך מעקב רפואי.`,
  )

  layout.addSpacing(6)

  // ===============================================================
  // SECTION: Item 13 — Summary of physiotherapy outcome
  // ===============================================================
  layout.addNumberedParagraph(
    '13.',
    `חרף העובדה שהתובע עבר ${fields.physioCount} טיפולי פיזיותרפיה ,בהתאם להמלצות הרופאים המטפלים, לא הושגה הטבה ממשית במצבו. התובע המשיך להתלונן באופן עקבי על כאבים בצוואר ובגב התחתון, על הגבלה תפקודית ועל צורך בהמשך טיפול ומעקב רפואי, דבר המלמד על אופייה המתמשך של הפגיעה שנגרמה לו בעקבות התאונה.`,
  )

  layout.addSpacing(6)

  // ===============================================================
  // SECTION: Item 14 — Medical documentation summary
  // ===============================================================
  layout.addNumberedParagraph(
    '14.',
    'מן התיעוד הרפואי עולה כי מאז התאונה מצוי התובע ברצף טיפולי מתמשך, הכולל תלונות עקביות על כאבים בצוואר ובגב התחתון, הגבלה בטווחי התנועה, טיפולי פיזיותרפיה, מעקב אורתופדי ובדיקות הדמיה אשר הדגימו בלטי דיסק במספר גבהים בעמוד השדרה הצווארי והמותני. התיעוד הרפואי מלמד על פגיעה אורתופדית מתמשכת, אשר הצריכה טיפול ומעקב רפואי לאורך זמן.',
  )

  layout.addSpacing(6)

  // ===============================================================
  // SECTION: Medical attachments
  // ===============================================================
  layout.addRightText('תיעוד רפואי מצורף כנספח המסומן ו\'', { ...bold, fontSize: 8 })
  layout.addSpacing(2)
  layout.addRightText('טופס ויתור על סודיות רפואית מצורף כנספח המסומן ז\'', { ...bold, fontSize: 8 })

  layout.addSpacing(10)

  // ===============================================================
  // SECTION: "סעדים נדרשים" heading — bold underlined, NO box
  // ===============================================================
  layout.addRightText('סעדים נדרשים :', { ...bold, fontSize: 10, underline: true })

  layout.addSpacing(6)

  // ===============================================================
  // SECTION: Claims text (dynamic textarea, items 15-19)
  // ===============================================================
  const claimsLines = fields.claimsText.split('\n').filter(l => l.trim())
  for (const line of claimsLines) {
    layout.addRightText(line, { fontSize: 9 })
  }

  layout.addSpacing(6)

  // ===============================================================
  // SECTION: Special damages — heading as bold underlined, NO box
  // ===============================================================
  layout.addRightText('א. נזקים מיוחדים', { ...bold, fontSize: 9, underline: true })

  layout.addSpacing(4)

  // Special damage items (dynamic textarea)
  const specialLines = fields.specialDamages.split('\n').filter(l => l.trim())
  for (const line of specialLines) {
    layout.addRightText(line)
    layout.addSpacing(2)
  }

  layout.addSpacing(4)

  // ===============================================================
  // SECTION: General damages — heading as bold underlined, NO box
  // ===============================================================
  layout.addRightText('ב. נזקים כלליים', { ...bold, fontSize: 9, underline: true })

  layout.addSpacing(4)

  // General damage items (dynamic textarea)
  const generalLines = fields.generalDamages.split('\n').filter(l => l.trim())
  for (const line of generalLines) {
    layout.addRightText(line)
    layout.addSpacing(2)
  }

  // ===============================================================
  // SECTION: Page number footer
  // ===============================================================
  layout.drawTextLine(
    layout.margins.left, layout.margins.bottom - 10,
    '3 / 53', layout.contentWidth, 'left', { fontSize: 8 }
  )
}
