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

  /** Label for the plaintiff, e.g. 'להלן: "התובע"' */
  plaintiffLabel: string

  /** Label for the defendant, e.g. 'להלן: "הנתבעת"' */
  defendantLabel: string

  /** Defendant company registration number */
  defendantCompanyId: string

  // ----- Page 1 body: Case info & Summons -----

  /** Insurance policy number */
  policyNumber: string

  /** Court fee amount, e.g. "839" */
  courtFee: string

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

  /** First medical visit date (emergency) */
  medicalVisit1Date: string

  /** Second medical visit date (family doctor) */
  medicalVisit2Date: string

  /** Third medical visit date (orthopedics) */
  medicalVisit3Date: string

  /** Physiotherapy start date */
  physioStartDate: string

  /** Physiotherapy end date */
  physioEndDate: string

  /** Fourth medical visit date (orthopedic follow-up) */
  medicalVisit4Date: string

  /** Imaging exam date */
  imagingDate: string

  /** Fifth medical visit date (orthopedic follow-up) */
  medicalVisit5Date: string

  // ----- Page 3: Continued medical & Damages -----

  /** Sixth medical visit date (orthopedic follow-up) */
  medicalVisit6Date: string

  /** Number of physiotherapy treatments */
  physioCount: string

  /** Medical expenses amount in NIS */
  medicalExpenses: string

  /** Third-party help expenses in NIS */
  thirdPartyHelp: string

  /** Past lost wages amount in NIS */
  pastLostWages: string

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
