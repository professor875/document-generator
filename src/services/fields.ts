/**
 * Field Definitions for the Document Generator
 *
 * This file defines every editable field in the PDF template.
 * Each field has:
 *   - Form metadata (id, label, type, defaultValue) — used by DocumentForm.vue
 *   - PDF placement data (page, x, y, width, height) — used by the PDF service
 *
 * The separation allows the form UI and PDF generation logic to stay
 * independent: the form only cares about labels and types, while the
 * PDF service only cares about coordinates.
 *
 * COORDINATE SYSTEM:
 *   PDF coordinates have (0, 0) at the bottom-left corner of the page.
 *   Y increases going UP.  The template is US Letter: 612 x 792 points.
 *   Coordinates were measured using a calibration grid overlay.
 *
 * ADDING NEW FIELDS:
 *   1. Add a new entry to DOCUMENT_FIELDS below.
 *   2. Generate a calibration grid to find the x/y coordinates.
 *   3. Add one or more placements (the same field can appear on
 *      multiple pages — e.g., the header repeats on pages 1 and 5).
 */

// -------------------------------------------------------------------
// Types
// -------------------------------------------------------------------

/**
 * Where a field's value should be drawn on a specific page of the PDF.
 *
 *   page   — 0-based page index
 *   x      — left edge of the white cover rectangle (points)
 *   y      — bottom edge of the white cover rectangle (points)
 *   width  — width of the white cover rectangle (points)
 *   height — height of the white cover rectangle (points)
 *
 * The white rectangle erases the original red text, then the user's
 * new value is drawn on top at the correct position.
 */
export interface FieldPlacement {
  page: number
  x: number
  y: number
  width: number
  height: number
}

/**
 * Full definition for one editable field.
 *
 * Form-facing properties (used by DocumentForm.vue):
 *   id, label, type, defaultValue, placeholder
 *
 * PDF-facing properties (used by pdf.ts):
 *   placements, fontSize, bold, align
 */
export interface FieldDefinition {
  // -- Form properties --
  id: string
  label: string                       // Hebrew label shown in the form
  type: 'text' | 'date' | 'time'     // HTML input type
  defaultValue: string                // Pre-filled from the template
  placeholder?: string               // Input placeholder text

  // -- PDF properties --
  placements: FieldPlacement[]        // One or more locations in the PDF
  fontSize: number                    // Font size in points
  bold?: boolean                      // Use bold font variant?
  align?: 'right' | 'left' | 'center' // Text alignment within the field area
}

// -------------------------------------------------------------------
// Field definitions — initial 8 representative fields
//
// These cover the key text patterns found in the template:
//   - Pure Hebrew (address, plaintiff name)
//   - Hebrew + numbers (case number, phone, attorney license)
//   - English / LTR (email)
//   - Pure numbers (company ID)
//   - Long mixed strings (insurance policy)
//
// Coordinates are based on the US Letter (612x792) template.
// Fields that appear on both page 1 and page 5 have two placements.
// -------------------------------------------------------------------

export const DOCUMENT_FIELDS: FieldDefinition[] = [
  // ---------------------------------------------------------------
  // Font sizes derived from template analysis:
  //   Template uses ~1.6x scaled coordinate system.
  //   Visible sizes = template sizes * 0.625
  //   Case number:   14.688 * 0.625 ≈ 9.2pt (bold)
  //   Plaintiff name: 16.704 * 0.625 ≈ 10.4pt (bold)
  //   Body text:     14.4 * 0.625 ≈ 9pt
  //   Company ID:    13.536 * 0.625 ≈ 8.5pt
  //
  // White rectangles are intentionally oversized to guarantee
  // full coverage of the original red text underneath.
  // ---------------------------------------------------------------

  {
    id: 'caseNumber',
    label: 'מספר תיק',
    type: 'text',
    defaultValue: 'ת"א 07-26-',
    placeholder: 'ת"א XX-XX-',
    fontSize: 9,
    bold: true,
    align: 'center',
    placements: [
      // Box in template at x≈132–237, baseline y≈728.
      // Generous rect: bottom at 718, top at 746 (h=28).
      { page: 0, x: 122, y: 718, width: 125, height: 28 },
      { page: 4, x: 122, y: 718, width: 125, height: 28 },
    ],
  },

  {
    id: 'plaintiffNameId',
    label: 'שם התובע ותעודת זהות',
    type: 'text',
    defaultValue: 'עבד אלחמיד חג\'אזי  ת"ז 036600500',
    placeholder: 'שם מלא  ת"ז XXXXXXXXX',
    fontSize: 10,
    bold: true,
    align: 'center',
    placements: [
      // Bold centered line, baseline y≈692.
      // Extended down to y=675 to cover descenders and any bleed.
      { page: 0, x: 240, y: 675, width: 370, height: 33 },
      { page: 4, x: 240, y: 675, width: 370, height: 33 },
    ],
  },

  {
    id: 'plaintiffAddress',
    label: 'כתובת התובע',
    type: 'text',
    defaultValue: 'מרח\' סיף אל דין, דיר אלאסד',
    placeholder: 'רחוב, עיר',
    fontSize: 9,
    align: 'center',
    placements: [
      // Baseline y≈668. Rect 656–682.
      { page: 0, x: 270, y: 656, width: 320, height: 26 },
      { page: 4, x: 270, y: 656, width: 320, height: 26 },
    ],
  },

  {
    id: 'plaintiffPhone',
    label: 'טלפון התובע',
    type: 'text',
    defaultValue: 'טל: 050-7761618',
    placeholder: 'טל: 0XX-XXXXXXX',
    fontSize: 9,
    align: 'center',
    placements: [
      // Baseline y≈652. Rect 640–666.
      { page: 0, x: 340, y: 640, width: 235, height: 26 },
      { page: 4, x: 340, y: 640, width: 235, height: 26 },
    ],
  },

  {
    id: 'attorneyName',
    label: 'שם עורך הדין ומספר רישיון',
    type: 'text',
    defaultValue: 'עוה"ד ענאן חוסיין מ.ר 100020',
    placeholder: 'עוה"ד שם מ.ר XXXXXX',
    fontSize: 9,
    align: 'center',
    placements: [
      // Baseline y≈636. Rect 624–650.
      { page: 0, x: 235, y: 624, width: 355, height: 26 },
      { page: 4, x: 235, y: 624, width: 355, height: 26 },
    ],
  },

  {
    id: 'email',
    label: 'דואר אלקטרוני',
    type: 'text',
    defaultValue: 'E-MAIL: ananhosenadv@gmail.com',
    placeholder: 'E-MAIL: example@domain.com',
    fontSize: 9,
    align: 'center',
    placements: [
      // Baseline y≈578. Rect 566–592.
      { page: 0, x: 225, y: 566, width: 350, height: 26 },
      { page: 4, x: 225, y: 566, width: 350, height: 26 },
    ],
  },

  {
    id: 'defendantCompanyId',
    label: 'מספר ח.פ של הנתבעת',
    type: 'text',
    defaultValue: 'ח.פ 513136895',
    placeholder: 'ח.פ XXXXXXXXX',
    fontSize: 8.5,
    align: 'center',
    placements: [
      // Baseline y≈509. Rect 500–518 — carefully avoids
      // the company name line above (baseline y≈525).
      { page: 0, x: 345, y: 500, width: 225, height: 18 },
      { page: 4, x: 345, y: 500, width: 225, height: 18 },
    ],
  },

  {
    id: 'policyNumber',
    label: 'מספר פוליסת ביטוח',
    type: 'text',
    defaultValue: 'שמספרה 202-312102119821-00',
    placeholder: 'שמספרה XXX-XXXXXXXXXXXX-XX',
    fontSize: 9,
    align: 'center',
    placements: [
      // Baseline y≈128. Rect 116–142.
      { page: 0, x: 160, y: 116, width: 340, height: 26 },
    ],
  },
]
