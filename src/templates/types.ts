/**
 * Shared Types for Document Templates
 *
 * Contains the DocumentFields interface used by all page templates.
 * Each field represents a dynamic (user-editable) value that appears
 * in the generated PDF document.
 *
 * Fields are grouped by page/section for clarity. ALL red-boxed content
 * from the original PDF is represented here as a dynamic field.
 */

/** All user-editable values across all 5 pages of the document */
export interface DocumentFields {
  // ----- Header fields (pages 1 & 5) -----

  /** Court name, e.g. "בבית המשפט השלום בחיפה" */
  courtName: string

  /** Court case number, e.g. "ת"א 07-26-" */
  caseNumber: string

  /** Plaintiff full name */
  plaintiffName: string

  /** Plaintiff ID number */
  plaintiffId: string

  /** Plaintiff street address */
  plaintiffAddress: string

  /** Plaintiff phone */
  plaintiffPhone: string

  /** Plaintiff birth date, e.g. "05/05/1985" */
  plaintiffBirthDate: string

  /** Plaintiff city of residence */
  plaintiffCity: string

  /** Primary attorney name and license */
  attorney1: string

  /** Secondary attorney (optional) */
  attorney2: string

  /** Attorney office address */
  attorneyAddress: string

  /** Attorney phone */
  attorneyPhone: string

  /** Attorney email line */
  email: string

  /** Attorney name for the signature line */
  attorneySignName: string

  /** Title for the signature line, e.g. 'ב"כ התובע' */
  signatureTitle: string

  // ----- Page 5: Separate header fields -----

  /** Page 5 court name */
  p5CourtName: string
  /** Page 5 case number */
  p5CaseNumber: string
  /** Page 5 regarding label */
  p5RegardingLabel: string
  /** Page 5 plaintiff name */
  p5PlaintiffName: string
  /** Page 5 plaintiff ID */
  p5PlaintiffId: string
  /** Page 5 plaintiff address */
  p5PlaintiffAddress: string
  /** Page 5 plaintiff phone */
  p5PlaintiffPhone: string
  /** Page 5 attorney 1 */
  p5Attorney1: string
  /** Page 5 attorney 2 */
  p5Attorney2: string
  /** Page 5 attorney address */
  p5AttorneyAddress: string
  /** Page 5 attorney phone */
  p5AttorneyPhone: string
  /** Page 5 email */
  p5Email: string
  /** Page 5 plaintiff label */
  p5PlaintiffLabel: string
  /** Page 5 defendant company ID */
  p5DefendantCompanyId: string
  /** Page 5 defendant label */
  p5DefendantLabel: string
  /** Page 5 attorney sign name */
  p5SignName: string
  /** Page 5 signature title */
  p5SignTitle: string

  /** Label for the plaintiff, e.g. 'להלן: "התובע"' */
  plaintiffLabel: string

  /** Label for the defendant, e.g. 'להלן: "הנתבעת"' */
  defendantLabel: string

  /** Defendant company registration number */
  defendantCompanyId: string

  // ----- Page 1 body: Case info & Summons -----

  /** Insurance policy number */
  policyNumber: string

  /** Parties heading, e.g. "צדדים :" */
  partiesHeading: string

  /** "בעניין :" label */
  regardingLabel: string

  /** "הזמנה לדין" heading */
  summonsHeading: string

  /** "כ ת ב    ת ב י ע ה" heading */
  claimHeading: string

  /** "אירוע התאונה :" heading */
  accidentHeading: string

  /** Item 4 — legal classification of the accident */
  accidentLegalText: string

  /** "טיפולים רפואיים :" heading */
  medicalHeading: string

  /** "סעדים נדרשים :" heading */
  remediesHeading: string

  /** "א. נזקים מיוחדים" heading */
  specialDamagesHeading: string

  /** "ב. נזקים כלליים" heading */
  generalDamagesHeading: string

  /** "בקשה למינוי מומחים רפואיים" heading (page 5) */
  expertRequestHeading: string

  /** Expert request body text (page 5) */
  expertRequestBody: string

  /** "*** רצ"ב העתק..." note (page 5) */
  expertRequestNote: string

  /** Full case type/amounts text block (textarea) */
  caseInfoBlock: string

  /** Full summons paragraph (textarea) */
  summonsText: string

  // ----- Page 2: Accident & Medical -----

  /** Date of the accident, e.g. "14.4.2022" */
  accidentDate: string

  /** Time of the accident, e.g. "18:00" */
  accidentTime: string

  /** Plaintiff vehicle registration number */
  plaintiffVehicleReg: string

  /** Bus company name, e.g. "אגד" */
  busCompany: string

  /** Bus registration number */
  busReg: string

  /** Full medical treatments text, items 5-14 (textarea) */
  medicalTreatmentsText: string

  /** Required claims text, items 15-19 (textarea) */
  claimsText: string

  /** Special damages listing (textarea) */
  specialDamages: string

  /** General damages listing (textarea) */
  generalDamages: string

  // ----- Page 4: Legal prayer & Signature -----

  /** Legal prayer for relief, items 20-23 (textarea) */
  legalPrayer: string
}
