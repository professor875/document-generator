/**
 * PDF Generation Service
 *
 * This module re-exports the generateDocument function from pdf-v2.ts,
 * which creates the PDF from scratch using the layout engine.
 *
 * This file exists so that existing imports in DocumentForm.vue
 * (import { generateDocument } from '@/services/pdf') continue to work
 * without any component changes.
 */

export { generateDocument } from './pdf-v2'
