/**
 * PDF Generation Service (v2) — From-Scratch Approach
 *
 * This service generates the 5-page PDF document from blank pages
 * using the layout engine.
 *
 * Process:
 *   1. Create a blank PDF document (no template loading)
 *   2. Embed Hebrew fonts (NotoSansHebrew Regular + Bold)
 *   3. Add 5 US Letter pages (612x792 points each)
 *   4. Instantiate PageLayout for each page and call the render function
 *   5. Return the PDF bytes as Uint8Array
 *
 * Font bytes are cached after the first fetch to avoid redundant network
 * requests on subsequent PDF generations.
 */

import { PDFDocument } from 'pdf-lib'
import fontkit from '@pdf-lib/fontkit'

import { PageLayout } from '@/templates/layout'
import type { Fonts } from '@/templates/layout'
import { renderPage1 } from '@/templates/page1'
import { renderPage2 } from '@/templates/page2'
import { renderPage3 } from '@/templates/page3'
import { renderPage4 } from '@/templates/page4'
import { renderPage5 } from '@/templates/page5'
import type { DocumentFields } from '@/templates/types'
import { DOCUMENT_FIELDS } from './fields'

// Font URLs resolved by Vite at build time
import fontRegularUrl from '@/assets/NotoSansHebrew-Regular.ttf'
import fontBoldUrl from '@/assets/NotoSansHebrew-Bold.ttf'

// -------------------------------------------------------------------
// Font loading (cached)
// -------------------------------------------------------------------

let fontCache: {
  regular: ArrayBuffer
  bold: ArrayBuffer
} | null = null

/**
 * Fetch and cache the Hebrew font files.
 * After the first call, subsequent calls return the cached ArrayBuffers
 * without any network requests.
 */
async function loadFonts(): Promise<{ regular: ArrayBuffer; bold: ArrayBuffer }> {
  if (fontCache) return fontCache

  const [regularResp, boldResp] = await Promise.all([
    fetch(fontRegularUrl),
    fetch(fontBoldUrl),
  ])

  fontCache = {
    regular: await regularResp.arrayBuffer(),
    bold: await boldResp.arrayBuffer(),
  }

  return fontCache
}

// -------------------------------------------------------------------
// Form data mapping
// -------------------------------------------------------------------

/**
 * Map the flat formData (keyed by field IDs from DOCUMENT_FIELDS) into
 * the structured DocumentFields object expected by the page templates.
 *
 * For each DocumentFields key, we look up the corresponding value in
 * formData. If the value is empty or missing, we fall back to the
 * field's defaultValue from DOCUMENT_FIELDS.
 */
function mapFormDataToFields(formData: Record<string, string>): DocumentFields {
  // Helper to get a field value by its ID, falling back to defaultValue
  function getField(id: string): string {
    const value = formData[id]
    if (value !== undefined && value !== '') return value

    // Look up defaultValue from the field definition
    const fieldDef = DOCUMENT_FIELDS.find(f => f.id === id)
    return fieldDef?.defaultValue ?? ''
  }

  return {
    // Header fields (pages 1 & 5)
    courtName: getField('courtName'),
    caseNumber: getField('caseNumber'),
    plaintiffName: getField('plaintiffName'),
    plaintiffId: getField('plaintiffId'),
    plaintiffAddress: getField('plaintiffAddress'),
    plaintiffPhone: getField('plaintiffPhone'),
    plaintiffBirthDate: getField('plaintiffBirthDate'),
    plaintiffCity: getField('plaintiffCity'),
    attorney1: getField('attorney1'),
    attorney2: getField('attorney2'),
    attorneyAddress: getField('attorneyAddress'),
    attorneyPhone: getField('attorneyPhone'),
    email: getField('email'),
    attorneySignName: getField('attorneySignName'),
    plaintiffLabel: getField('plaintiffLabel'),
    defendantLabel: getField('defendantLabel'),
    defendantCompanyId: getField('defendantCompanyId'),

    // Page 1 body
    policyNumber: getField('policyNumber'),
    courtFee: getField('courtFee'),
    caseInfoBlock: getField('caseInfoBlock'),
    summonsText: getField('summonsText'),

    // Page 2: Accident & Medical
    accidentDate: getField('accidentDate'),
    accidentTime: getField('accidentTime'),
    plaintiffVehicleReg: getField('plaintiffVehicleReg'),
    busCompany: getField('busCompany'),
    busReg: getField('busReg'),
    medicalVisit1Date: getField('medicalVisit1Date'),
    medicalVisit2Date: getField('medicalVisit2Date'),
    medicalVisit3Date: getField('medicalVisit3Date'),
    physioStartDate: getField('physioStartDate'),
    physioEndDate: getField('physioEndDate'),
    medicalVisit4Date: getField('medicalVisit4Date'),
    imagingDate: getField('imagingDate'),
    medicalVisit5Date: getField('medicalVisit5Date'),

    // Page 3: Continued medical & Damages
    medicalVisit6Date: getField('medicalVisit6Date'),
    physioCount: getField('physioCount'),
    medicalExpenses: getField('medicalExpenses'),
    thirdPartyHelp: getField('thirdPartyHelp'),
    pastLostWages: getField('pastLostWages'),
    claimsText: getField('claimsText'),
    specialDamages: getField('specialDamages'),
    generalDamages: getField('generalDamages'),

    // Page 4: Legal prayer & Signature
    legalPrayer: getField('legalPrayer'),
  }
}

// -------------------------------------------------------------------
// Helper: create a new page with layout
// -------------------------------------------------------------------

/**
 * Add a new US Letter page to the document and return a PageLayout
 * instance ready for content rendering.
 */
function createPage(doc: PDFDocument, fonts: Fonts): PageLayout {
  const page = doc.addPage([612, 792])
  return new PageLayout(page, fonts)
}

// -------------------------------------------------------------------
// Public API
// -------------------------------------------------------------------

/**
 * Generate a 5-page PDF document from scratch using the layout engine.
 *
 * @param formData  Object mapping field IDs to user-entered values.
 *                  Keys correspond to DOCUMENT_FIELDS[].id.
 * @returns         The PDF file as a Uint8Array (ready for Blob creation)
 */
export async function generateDocument(
  formData: Record<string, string>
): Promise<Uint8Array> {
  // Load fonts (cached after first call)
  const fontBytes = await loadFonts()

  // Create a blank PDF document
  const doc = await PDFDocument.create()
  doc.registerFontkit(fontkit)

  // Embed the Hebrew fonts into the document
  const regularFont = await doc.embedFont(fontBytes.regular)
  const boldFont = await doc.embedFont(fontBytes.bold)
  const fonts: Fonts = { regular: regularFont, bold: boldFont }

  // Map flat form data to the structured DocumentFields
  const fields = mapFormDataToFields(formData)

  // Render all 5 pages
  const renderers = [renderPage1, renderPage2, renderPage3, renderPage4, renderPage5]
  for (const render of renderers) {
    const layout = createPage(doc, fonts)
    render(layout, fields)
  }

  // Save and return the PDF bytes
  return doc.save()
}
