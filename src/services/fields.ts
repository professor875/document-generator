/**
 * Field Definitions for the Document Generator
 *
 * This file defines every editable field shown in the form UI.
 * Each field has:
 *   - id           — unique key, matches DocumentFields interface in types.ts
 *   - label        — Hebrew label shown in DocumentForm.vue
 *   - type         — HTML input type ('text', 'textarea')
 *   - defaultValue — pre-filled value
 *   - placeholder  — input placeholder text
 *   - group        — logical grouping for the form UI
 *
 * ALL red-boxed content from the original PDF is represented here as
 * a dynamic field. Textarea fields allow multi-line editing for large
 * text blocks (summons, claims, damages, etc.).
 */

// -------------------------------------------------------------------
// Types
// -------------------------------------------------------------------

export interface FieldDefinition {
  id: string
  label: string
  type: 'text' | 'textarea' | 'date' | 'time'
  defaultValue: string
  placeholder?: string
  group?: string
  /** When true the field label is displayed in red in the form UI */
  important?: boolean
}

// -------------------------------------------------------------------
// Field definitions — grouped logically
// -------------------------------------------------------------------

export const DOCUMENT_FIELDS: FieldDefinition[] = [
  // =============================================
  // פרטי תיק (Case details)
  // =============================================
  {
    id: 'courtName',
    label: 'שם בית המשפט',
    type: 'text',
    defaultValue: 'בבית המשפט השלום בחיפה',
    placeholder: 'בבית המשפט...',
    group: 'פרטי תיק',
    important: true,
  },
  {
    id: 'caseNumber',
    label: 'מספר תיק',
    type: 'text',
    defaultValue: 'ת"א 07-26-',
    placeholder: 'ת"א XX-XX-',
    group: 'פרטי תיק',
    important: true,
  },
  {
    id: 'partiesHeading',
    label: 'כותרת צדדים',
    type: 'text',
    defaultValue: 'צדדים :',
    placeholder: 'צדדים :',
    group: 'פרטי תיק',
    important: true,
  },
  {
    id: 'regardingLabel',
    label: 'כותרת בעניין',
    type: 'text',
    defaultValue: 'בעניין :',
    placeholder: 'בעניין :',
    group: 'פרטי תיק',
    important: true,
  },
  {
    id: 'summonsHeading',
    label: 'כותרת הזמנה לדין',
    type: 'text',
    defaultValue: 'הזמנה לדין',
    placeholder: 'הזמנה לדין',
    group: 'כותרות המסמך',
    important: true,
  },
  {
    id: 'claimHeading',
    label: 'כותרת כתב תביעה',
    type: 'text',
    defaultValue: 'כ ת ב    ת ב י ע ה',
    placeholder: 'כ ת ב    ת ב י ע ה',
    group: 'כותרות המסמך',
    important: true,
  },
  {
    id: 'accidentHeading',
    label: 'כותרת אירוע התאונה',
    type: 'text',
    defaultValue: 'אירוע התאונה :',
    placeholder: 'אירוע התאונה :',
    group: 'כותרות המסמך',
    important: true,
  },
  {
    id: 'accidentLegalText',
    label: 'סעיף 4 - סיווג משפטי של התאונה',
    type: 'textarea',
    defaultValue: 'התאונה אירעה במהלך שימוש ברכב מנועי כהגדרתו בחוק פיצויים לנפגעי תאונות דרכים, התשל"ה–1975, ולפיכך מהווה "תאונת דרכים" כמשמעותה בחוק. (להלן : "התאונה").',
    placeholder: 'סיווג משפטי...',
    group: 'כותרות המסמך',
    important: true,
  },
  {
    id: 'medicalHeading',
    label: 'כותרת טיפולים רפואיים',
    type: 'text',
    defaultValue: 'טיפולים רפואיים :',
    placeholder: 'טיפולים רפואיים :',
    group: 'כותרות המסמך',
    important: true,
  },
  {
    id: 'remediesHeading',
    label: 'כותרת סעדים נדרשים',
    type: 'text',
    defaultValue: 'סעדים נדרשים :',
    placeholder: 'סעדים נדרשים :',
    group: 'כותרות המסמך',
    important: true,
  },
  {
    id: 'specialDamagesHeading',
    label: 'כותרת נזקים מיוחדים',
    type: 'text',
    defaultValue: 'א. נזקים מיוחדים',
    placeholder: 'א. נזקים מיוחדים',
    group: 'כותרות המסמך',
    important: true,
  },
  {
    id: 'generalDamagesHeading',
    label: 'כותרת נזקים כלליים',
    type: 'text',
    defaultValue: 'ב. נזקים כלליים',
    placeholder: 'ב. נזקים כלליים',
    group: 'כותרות המסמך',
    important: true,
  },
  {
    id: 'expertRequestHeading',
    label: 'כותרת בקשה למינוי מומחים',
    type: 'text',
    defaultValue: 'בקשה למינוי מומחים רפואיים',
    placeholder: 'בקשה למינוי מומחים רפואיים',
    group: 'בקשה למינוי מומחים (עמוד 5)',
    important: true,
  },
  {
    id: 'expertRequestBody',
    label: 'טקסט בקשה למינוי מומחים',
    type: 'textarea',
    defaultValue: 'התובע מבקש בזאת למנות לו מומחה רפואי בנושא הנכות הרפואית שלו בתחום האורתופדיה, לצורך בדיקת התובע ומתן חוות דעת בעניין.',
    placeholder: 'טקסט הבקשה...',
    group: 'בקשה למינוי מומחים (עמוד 5)',
    important: true,
  },
  {
    id: 'expertRequestNote',
    label: 'הערת תיעוד רפואי מצורף',
    type: 'text',
    defaultValue: '*** רצ"ב העתק התיעוד הרפואי שברשותו.',
    placeholder: '*** רצ"ב...',
    group: 'בקשה למינוי מומחים (עמוד 5)',
    important: true,
  },

  // =============================================
  // פרטי התובע (Plaintiff details)
  // =============================================
  {
    id: 'plaintiffName',
    label: 'שם התובע',
    type: 'text',
    defaultValue: 'עבד אלחמיד חג\'אזי',
    placeholder: 'שם מלא',
    group: 'פרטי התובע',
  },
  {
    id: 'plaintiffId',
    label: 'תעודת זהות',
    type: 'text',
    defaultValue: '036600500',
    placeholder: 'XXXXXXXXX',
    group: 'פרטי התובע',
  },
  {
    id: 'plaintiffAddress',
    label: 'כתובת התובע',
    type: 'text',
    defaultValue: 'מרח\' סיף אל דין, דיר אלאסד',
    placeholder: 'רחוב, עיר',
    group: 'פרטי התובע',
  },
  {
    id: 'plaintiffPhone',
    label: 'טלפון התובע',
    type: 'text',
    defaultValue: '050-7761618',
    placeholder: '0XX-XXXXXXX',
    group: 'פרטי התובע',
  },
  {
    id: 'plaintiffBirthDate',
    label: 'תאריך לידת התובע',
    type: 'text',
    defaultValue: '05/05/1985',
    placeholder: 'DD/MM/YYYY',
    group: 'פרטי התובע',
  },
  {
    id: 'plaintiffCity',
    label: 'עיר מגורים',
    type: 'text',
    defaultValue: 'דיר אלאסד',
    placeholder: 'שם העיר',
    group: 'פרטי התובע',
  },
  {
    id: 'plaintiffLabel',
    label: 'כינוי התובע',
    type: 'text',
    defaultValue: 'להלן: "התובע"',
    placeholder: 'להלן: "..."',
    group: 'פרטי התובע',
    important: true,
  },

  // =============================================
  // פרטי עורך הדין (Attorney details)
  // =============================================
  {
    id: 'attorney1',
    label: 'עורך דין ראשי',
    type: 'text',
    defaultValue: 'ע"י ב"כ עוה"ד ענאן חוסיין מ.ר 100020',
    placeholder: 'ע"י ב"כ עוה"ד שם מ.ר XXXXXX',
    group: 'פרטי עורך הדין',
    important: true,
  },
  {
    id: 'attorney2',
    label: 'עורך דין משני',
    type: 'text',
    defaultValue: 'ו/או עוה"ד מאריא עמאש מ.ר 101927',
    placeholder: 'ו/או עוה"ד שם מ.ר XXXXXX',
    group: 'פרטי עורך הדין',
    important: true,
  },
  {
    id: 'attorneyAddress',
    label: 'כתובת עורך הדין',
    type: 'text',
    defaultValue: 'רח\' אלמריג\' נחף',
    placeholder: 'רחוב, עיר',
    group: 'פרטי עורך הדין',
    important: true,
  },
  {
    id: 'attorneyPhone',
    label: 'טלפון עורך הדין',
    type: 'text',
    defaultValue: '050-7761618',
    placeholder: '0XX-XXXXXXX',
    group: 'פרטי עורך הדין',
    important: true,
  },
  {
    id: 'email',
    label: 'דואר אלקטרוני',
    type: 'text',
    defaultValue: 'E-MAIL: ananhosenadv@gmail.com',
    placeholder: 'E-MAIL: example@domain.com',
    group: 'פרטי עורך הדין',
    important: true,
  },
  {
    id: 'attorneySignName',
    label: 'שם עורך הדין לחתימה',
    type: 'text',
    defaultValue: 'ענאן חוסיין',
    placeholder: 'שם עורך הדין',
    group: 'פרטי עורך הדין',
    important: true,
  },

  // =============================================
  // פרטי הנתבעת (Defendant details)
  // =============================================
  {
    id: 'defendantCompanyId',
    label: 'מספר ח.פ של הנתבעת',
    type: 'text',
    defaultValue: '513136895',
    placeholder: 'XXXXXXXXX',
    group: 'פרטי הנתבעת',
  },
  {
    id: 'defendantLabel',
    label: 'כינוי הנתבעת',
    type: 'text',
    defaultValue: 'להלן: "הנתבעת"',
    placeholder: 'להלן: "..."',
    group: 'פרטי הנתבעת',
    important: true,
  },

  // =============================================
  // פרטי התאונה (Accident details)
  // =============================================
  {
    id: 'accidentDate',
    label: 'תאריך התאונה',
    type: 'text',
    defaultValue: '14.4.2022',
    placeholder: 'DD.MM.YYYY',
    group: 'פרטי התאונה',
  },
  {
    id: 'accidentTime',
    label: 'שעת התאונה',
    type: 'text',
    defaultValue: '18:00',
    placeholder: 'HH:MM',
    group: 'פרטי התאונה',
  },
  {
    id: 'plaintiffVehicleReg',
    label: 'מספר רכב התובע',
    type: 'text',
    defaultValue: '1065553',
    placeholder: 'מספר רישוי',
    group: 'פרטי התאונה',
  },
  {
    id: 'busCompany',
    label: 'חברת האוטובוס',
    type: 'text',
    defaultValue: 'אגד',
    placeholder: 'שם חברה',
    group: 'פרטי התאונה',
  },
  {
    id: 'busReg',
    label: 'מספר רכב האוטובוס',
    type: 'text',
    defaultValue: '779969',
    placeholder: 'מספר רישוי',
    group: 'פרטי התאונה',
  },
  {
    id: 'policyNumber',
    label: 'מספר פוליסת ביטוח',
    type: 'text',
    defaultValue: '202-312102119821-00',
    placeholder: 'XXX-XXXXXXXXXXXX-XX',
    group: 'פרטי התאונה',
  },

  // =============================================
  // תאריכי טיפולים רפואיים (Medical visit dates)
  // =============================================
  {
    id: 'medicalVisit1Date',
    label: 'תאריך ביקור רפואי 1 (טרם)',
    type: 'text',
    defaultValue: '14.04.2022',
    placeholder: 'DD.MM.YYYY',
    group: 'תאריכי טיפולים רפואיים',
  },
  {
    id: 'medicalVisit2Date',
    label: 'תאריך ביקור רפואי 2 (רופא משפחה)',
    type: 'text',
    defaultValue: '23.04.2022',
    placeholder: 'DD.MM.YYYY',
    group: 'תאריכי טיפולים רפואיים',
  },
  {
    id: 'medicalVisit3Date',
    label: 'תאריך ביקור רפואי 3 (אורתופדיה)',
    type: 'text',
    defaultValue: '07.05.2022',
    placeholder: 'DD.MM.YYYY',
    group: 'תאריכי טיפולים רפואיים',
  },
  {
    id: 'physioStartDate',
    label: 'תאריך תחילת פיזיותרפיה',
    type: 'text',
    defaultValue: '13.05.2022',
    placeholder: 'DD.MM.YYYY',
    group: 'תאריכי טיפולים רפואיים',
  },
  {
    id: 'physioEndDate',
    label: 'תאריך סיום פיזיותרפיה',
    type: 'text',
    defaultValue: '24.06.2022',
    placeholder: 'DD.MM.YYYY',
    group: 'תאריכי טיפולים רפואיים',
  },
  {
    id: 'medicalVisit4Date',
    label: 'תאריך ביקור רפואי 4 (ביקורת אורתופדית)',
    type: 'text',
    defaultValue: '17.05.2022',
    placeholder: 'DD.MM.YYYY',
    group: 'תאריכי טיפולים רפואיים',
  },
  {
    id: 'imagingDate',
    label: 'תאריך בדיקות הדמיה',
    type: 'text',
    defaultValue: '01.08.2022',
    placeholder: 'DD.MM.YYYY',
    group: 'תאריכי טיפולים רפואיים',
  },
  {
    id: 'medicalVisit5Date',
    label: 'תאריך ביקור רפואי 5 (ביקורת אורתופדית)',
    type: 'text',
    defaultValue: '28.08.2022',
    placeholder: 'DD.MM.YYYY',
    group: 'תאריכי טיפולים רפואיים',
  },
  {
    id: 'medicalVisit6Date',
    label: 'תאריך ביקור רפואי 6 (ביקורת אורתופדית)',
    type: 'text',
    defaultValue: '17.12.2023',
    placeholder: 'DD.MM.YYYY',
    group: 'תאריכי טיפולים רפואיים',
  },

  // =============================================
  // נזקים (Damages)
  // =============================================
  {
    id: 'physioCount',
    label: 'מספר טיפולי פיזיותרפיה',
    type: 'text',
    defaultValue: '36',
    placeholder: 'מספר',
    group: 'נזקים',
  },

  // =============================================
  // בלוקים של טקסט (Text blocks — textarea fields)
  // =============================================
  {
    id: 'caseInfoBlock',
    label: 'פרטי התביעה והאגרה',
    type: 'textarea',
    defaultValue: `מהות התביעה: פיצויים בגין נזקי גוף עקב ת.ד (פלת"ד).
סכום התביעה : כגבול סמכותו של בית המשפט
סכום האגרה שיש לשלם: 839 בהתאם לפריט 34 לתוספת של תקנות בתי המשפט (אגרות),
תשס"ז-2007.
האם קיים הליך נוסף בבית משפט או בית דין: לא.`,
    placeholder: 'פרטי התביעה...',
    group: 'בלוקים של טקסט',
    important: true,
  },
  {
    id: 'summonsText',
    label: 'טקסט הזמנה לדין',
    type: 'textarea',
    defaultValue: 'הואיל והתובע הגיש כתב תביעה זה נגדך, אתה מוזמן להגיש כתב הגנה בתוך שישים ימים מיום שהומצאה לך הזמנה זו. לתשומת לבך, אם לא תגיש כתב הגנה אזי לפי תקנה 130 לתקנות סדר הדין האזרחי, התשע"ט-2018, תהיה לתובעת הזכות לקבל פסק דין שלא בפניך.',
    placeholder: 'טקסט הזמנה לדין...',
    group: 'בלוקים של טקסט',
    important: true,
  },
  {
    id: 'claimsText',
    label: 'סעדים נדרשים (סעיפים 15-19)',
    type: 'textarea',
    defaultValue: `15. התובע יטען כי עודנו סובל מכאבים והגבלה בתנועות אשר גורמים לו לפנות לרופאים וליטול תרופות משככי כאבים.

16. התובע יטען כי נותרה לו נכות בתחום האורתופדיה כתוצאה ישירה מהתאונה.

17. בעקבות התאונה, נותר התובע ללא כושר תפקודי דבר אשר גרם לו אובדן השתכרות בעבר. כמו כן, לאורך כל תקופת אי כושרו של התובע הוא נזקק לעזרת בני משפחתו באופן החורג מהעזרה הסבירה הניתנת ע"י בני המשפחה בחיי היומיום.

18. התובע שומר לעצמו את זכותו לשנות את כתב התביעה ו/או להוסיף עליו במידה ותחול החמרה במצבו, לרבות אשפוז נוסף ו/או יידרש להוצאת הוצאות נוספות מעבר לאמור בכתב התביעה.

19. ואלה, בין היתר, הנזקים שנגרמו לתובע כתוצאה ישירה ו/או עקיפה מהתאונה :`,
    placeholder: 'סעדים נדרשים...',
    group: 'בלוקים של טקסט',
    important: true,
  },
  {
    id: 'legalPrayer',
    label: 'סיכום ובקשות (סעיפים 20-23)',
    type: 'textarea',
    defaultValue: `20. התובע יטען, כי על הנתבעת לפצותו, בגין נזקיו בהיותה מבטחת את השימוש ברכב, כמתואר לעיל.

21. כל טענה ו/או פרט ו/או עובדה בכתב התביעה, נטענים במצטבר ו/או לחילופין, הכל לפי הקשר הדברים והעניין.

22. לבית המשפט הנכבד הסמכות העניינית לדון בתביעה, בין היתר, בגין סכום התביעה.

23. אשר על כן, מתבקש בית המשפט הנכבד להזמין את הנתבעת לדין ולחייבה לפצות את התובע בגין נזקיו עפ"י החלוקה המפורטת לעיל ו/או כל חלוקה אחרת שתימצא לנכון, בצירוף הפרשי הצמדה וריבית כחוק. כן יתבקש בית המשפט הנכבד לחייב את הנתבעת בהוצאות משפט ושכ"ט עו"ד בצרוף הפרשי הצמדה, ריבית ומע"מ כחוק.`,
    placeholder: 'סיכום ובקשות...',
    group: 'בלוקים של טקסט',
    important: true,
  },
  {
    id: 'specialDamages',
    label: 'נזקים מיוחדים',
    type: 'textarea',
    defaultValue: `2. הוצאות רפואיות: 10,000 ש"ח
4. עזרת הזולת: 10,000 ש"ח
5. הפסדי שכר בעבר: 30,000 ש"ח`,
    placeholder: 'נזקים מיוחדים...',
    group: 'בלוקים של טקסט',
    important: true,
  },
  {
    id: 'generalDamages',
    label: 'נזקים כלליים',
    type: 'textarea',
    defaultValue: `1. כאב וסבל.
2. הפסד שכר בעתיד ואובדן כושר השתכרות.
3. הוצאות רפואיות ונסיעות לעתיד.`,
    placeholder: 'נזקים כלליים...',
    group: 'בלוקים של טקסט',
    important: true,
  },
]
