/**
 * Page 2 Template — Accident Event & Medical Treatments
 *
 * Contains:
 *   - "אירוע התאונה" section with items 3-4
 *   - Attachments references
 *   - "טיפולים רפואיים" section with items 5-11 (partial)
 *
 * All headings are bold underlined text WITHOUT bordered boxes.
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
  // SECTION: "אירוע התאונה" heading — bold underlined, NO box
  // ===============================================================
  layout.addRightText('אירוע התאונה :', { ...bold, fontSize: 10, underline: true })

  layout.addSpacing(6)

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
    'התאונה אירעה במהלך שימוש ברכב מנועי כהגדרתו בחוק פיצויים לנפגעי תאונות דרכים, התשל"ה–1975, ולפיכך מהווה "תאונת דרכים" כמשמעותה בחוק. (להלן : "התאונה").',
  )

  layout.addSpacing(6)

  // ===============================================================
  // SECTION: Attachments for accident
  // ===============================================================
  layout.addRightText('מצ"ב אישור משטרה על התאונה כנספח המסומן ג\'', { ...bold, fontSize: 8 })
  layout.addSpacing(2)
  layout.addRightText('מצ"ב רישיון נהיגה של הנהג בעת התרחשות התאונה כנספח המסומן ד\'', { ...bold, fontSize: 8 })
  layout.addSpacing(2)
  layout.addRightText('מצ"ב תמונות של הרכבים כנספח המסומן ה\'', { ...bold, fontSize: 8 })

  layout.addSpacing(10)

  // ===============================================================
  // SECTION: "טיפולים רפואיים" heading — bold underlined, NO box
  // ===============================================================
  layout.addRightText('טיפולים רפואיים :', { ...bold, fontSize: 10, underline: true })

  layout.addSpacing(6)

  // ===============================================================
  // SECTION: Item 5 — First medical visit (emergency)
  // ===============================================================
  layout.addNumberedParagraph(
    '5.',
    `ביום ${fields.medicalVisit1Date} פנה התובע למרכז לרפואה דחופה "טרם" לאחר שהיה מעורב בתאונת הדרכים. התובע התלונן על כאבים באזור הצוואר והגב בעקבות התאונה. בבדיקה הגופנית נמצא כי הינו סובל מרגישות במישוש באזור הצוואר והגב. אובחן כסובל מחבלה בעקבות תאונת דרכים ומכאבי שרירים. התובע טופל במשכך כאבים, שוחרר לביתו והונחה להמשך מעקב רפואי לפי הצורך.`,
  )

  layout.addSpacing(6)

  // ===============================================================
  // SECTION: Item 6 — Family doctor visit
  // ===============================================================
  layout.addNumberedParagraph(
    '6.',
    `ביום ${fields.medicalVisit2Date} נבדק התובע על ידי רופא המשפחה. התלונן על כאבים מתמשכים בצוואר ובגב התחתון בעקבות התאונה. בבדיקה נמצאה רגישות והגבלה בטווחי התנועה. התובע הופנה לקבלת טיפולי פיזיותרפיה והמשך מעקב רפואי.`,
  )

  layout.addSpacing(6)

  // ===============================================================
  // SECTION: Item 7 — Orthopedic specialist
  // ===============================================================
  layout.addNumberedParagraph(
    '7.',
    `ביום ${fields.medicalVisit3Date} נבדק התובע על ידי מומחה באורתופדיה. התובע שב והתלונן על כאבים בצוואר ובגב התחתון עם קושי תפקודי. בבדיקה נמצאה רגישות לאורך עמוד השדרה הצווארי והמותני, לצד הגבלה בטווחי התנועה. הומלץ על המשך טיפול פיזיותרפי, טיפול תרופתי, חופשת מחלה ומעקב אורתופדי.`,
  )

  layout.addSpacing(6)

  // ===============================================================
  // SECTION: Item 8 — Physiotherapy series
  // ===============================================================
  layout.addNumberedParagraph(
    '8.',
    `במהלך התקופה שמיום ${fields.physioStartDate} ועד ${fields.physioEndDate} עבר התובע סדרת טיפולי פיזיותרפיה בשל תלונות מתמשכות על כאבים בצוואר ובגב התחתון. במהלך הטיפולים הודגמה הגבלה בתנועות עמוד השדרה הצווארי והמותני, רגישות בשרירי הצוואר והגב ושיפור חלקי בלבד לאחר סדרת הטיפולים. בסיום הטיפול המשיך התובע להתלונן על כאבים, בעיקר לאחר מאמץ גופני, עמידה ממושכת והליכה ממושכת.`,
  )

  layout.addSpacing(6)

  // ===============================================================
  // SECTION: Item 9 — Orthopedic follow-up
  // ===============================================================
  layout.addNumberedParagraph(
    '9.',
    `ביום ${fields.medicalVisit4Date} נבדק התובע בביקורת אורתופדית. התובע המשיך להתלונן על כאבים בצוואר ובגב התחתון. בבדיקה נמצאו רגישות במישוש והגבלה בטווחי התנועה של עמוד השדרה הצווארי והמותני. הומלץ על המשך טיפול שמרני, טיפול פיזיותרפי ומעקב רפואי.`,
  )

  layout.addSpacing(6)

  // ===============================================================
  // SECTION: Item 10 — Imaging exams
  // ===============================================================
  layout.addNumberedParagraph(
    '10.',
    `ביום ${fields.imagingDate} עבר התובע בדיקות הדמיה של עמוד השדרה הצווארי והמותני. בבדיקת עמוד השדרה הצווארי הודגמו מספר בלטי דיסק בגבהים C3-C4, C4-C5, C5-C6 הגורמים ללחץ על קדמת השק התקאלי. בבדיקת עמוד השדרה המותני הודגמו בלטי דיסק בגבהים L3-L4, L4-L5, L5-S1 כאשר בגובה L5-S1 הודגם בלט דיסק עם לחץ על קדמת השק התקאלי.`,
  )

  layout.addSpacing(6)

  // ===============================================================
  // SECTION: Item 11 — Additional orthopedic follow-up (partial, continues on page 3)
  // ===============================================================
  layout.addNumberedParagraph(
    '11.',
    `ביום ${fields.medicalVisit5Date} נבדק התובע בביקורת אורתופדית נוספת. התובע המשיך להתלונן על כאבי צוואר וגב תחתון המקרינים לסירוגין ומתגברים במאמץ. בבדיקה נמצאו רגישות והגבלה`,
  )

  // ===============================================================
  // SECTION: Page number footer
  // ===============================================================
  layout.drawTextLine(
    layout.margins.left, layout.margins.bottom - 10,
    '2 / 53', layout.contentWidth, 'left', { fontSize: 8 }
  )
}
