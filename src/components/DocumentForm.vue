<!--
  DocumentForm.vue -- Dynamic document generation form

  Renders form fields dynamically based on the DOCUMENT_FIELDS
  definition imported from the fields service.  The form is
  displayed in RTL direction since it targets Hebrew legal documents.

  Supports two actions:
    1. "Generate PDF" -- generates and immediately downloads the PDF.
    2. "Preview PDF"  -- generates the PDF and shows it in an iframe
       with an optional download button beside it.
-->

<template>
  <div class="form-card" dir="rtl">
    <h2 class="form-title">Generate Document</h2>

    <form @submit.prevent="handleGenerate">
      <template v-for="(fields, group) in groupedFields" :key="group">
        <fieldset class="group">
          <legend class="group-legend">{{ group }}</legend>

          <div class="group-fields" :class="{ 'group-fields--full': hasTextarea(fields) }">
            <div
              v-for="field in fields"
              :key="field.id"
              class="field"
              :class="{ 'field--full': field.type === 'textarea' }"
            >
              <label
                :for="field.id"
                :class="{ 'label--important': field.important }"
              >
                <span class="field-number">{{ getFieldNumber(field.id) }}.</span>
                {{ field.label }}
              </label>
              <textarea
                v-if="field.type === 'textarea'"
                :id="field.id"
                v-model="formData[field.id]"
                :placeholder="field.placeholder || ''"
                rows="5"
              ></textarea>
              <input
                v-else
                :id="field.id"
                v-model="formData[field.id]"
                :type="field.type"
                :placeholder="field.placeholder || ''"
              />
            </div>
          </div>
        </fieldset>
      </template>

      <div class="actions">
        <button type="submit" class="btn btn-primary" :disabled="loading">
          {{ loading ? 'Generating...' : 'Generate PDF' }}
        </button>
        <button type="button" class="btn btn-secondary" :disabled="loading" @click="handlePreview">
          Preview PDF
        </button>
      </div>
    </form>

    <div v-if="previewUrl" class="preview-section">
      <div class="preview-header">
        <h3>Preview</h3>
        <button class="btn btn-download" @click="downloadFromPreview">
          Download
        </button>
      </div>
      <iframe :src="previewUrl" class="preview-frame" title="PDF Preview"></iframe>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onBeforeUnmount } from 'vue'
import { DOCUMENT_FIELDS, type FieldDefinition } from '@/services/fields'
import { generateDocument } from '@/services/pdf'

const formData: Record<string, string> = reactive(
  DOCUMENT_FIELDS.reduce((acc, field) => {
    acc[field.id] = field.defaultValue
    return acc
  }, {} as Record<string, string>)
)

const loading = ref(false)

const groupedFields = computed(() => {
  const groups: Record<string, FieldDefinition[]> = {}
  for (const field of DOCUMENT_FIELDS) {
    const g = field.group || 'Other'
    if (!groups[g]) groups[g] = []
    groups[g].push(field)
  }
  return groups
})

function hasTextarea(fields: FieldDefinition[]): boolean {
  return fields.some(f => f.type === 'textarea')
}

const fieldNumberMap = computed(() => {
  const map: Record<string, number> = {}
  DOCUMENT_FIELDS.forEach((field, index) => {
    map[field.id] = index + 1
  })
  return map
})

function getFieldNumber(id: string): number {
  return fieldNumberMap.value[id] ?? 0
}

// Holds the object URL for the in-page PDF preview iframe
const previewUrl = ref<string | null>(null)

// Keep a reference to the latest preview blob so the "Download"
// button beside the preview can trigger a save without regenerating.
let previewBlob: Blob | null = null

// -------------------------------------------------------------------
// Helpers
// -------------------------------------------------------------------

/**
 * Revoke the current preview object URL (if any) to free memory,
 * then clear the reactive reference.
 */
function clearPreview(): void {
  if (previewUrl.value) {
    URL.revokeObjectURL(previewUrl.value)
    previewUrl.value = null
  }
  previewBlob = null
}

/**
 * Trigger a file download in the browser by creating a temporary
 * <a> element, clicking it, then removing it.
 */
function triggerDownload(blob: Blob, filename: string): void {
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = filename
  document.body.appendChild(link)
  link.click()
  // Clean up the temporary element and object URL
  document.body.removeChild(link)
  URL.revokeObjectURL(url)
}

// -------------------------------------------------------------------
// Event handlers
// -------------------------------------------------------------------

/**
 * Generate the PDF and start a download immediately.
 */
async function handleGenerate(): Promise<void> {
  loading.value = true
  try {
    const pdfBytes = await generateDocument({ ...formData })
    const blob = new Blob([pdfBytes as BlobPart], { type: 'application/pdf' })
    triggerDownload(blob, 'document.pdf')
  } catch (error) {
    console.error('PDF generation failed:', error)
  } finally {
    loading.value = false
  }
}

/**
 * Generate the PDF and show it in the inline preview iframe.
 * If a previous preview exists it is revoked first.
 */
async function handlePreview(): Promise<void> {
  loading.value = true
  // Clean up any previous preview to avoid memory leaks
  clearPreview()

  try {
    const pdfBytes = await generateDocument({ ...formData })
    previewBlob = new Blob([pdfBytes as BlobPart], { type: 'application/pdf' })
    // Create an object URL so the iframe can display the PDF
    previewUrl.value = URL.createObjectURL(previewBlob)
  } catch (error) {
    console.error('PDF preview failed:', error)
  } finally {
    loading.value = false
  }
}

/**
 * Download the currently previewed PDF without regenerating it.
 */
function downloadFromPreview(): void {
  if (previewBlob) {
    triggerDownload(previewBlob, 'document.pdf')
  }
}

// Revoke any lingering object URLs when the component is destroyed
onBeforeUnmount(() => {
  clearPreview()
})
</script>

<style scoped>
.form-card {
  width: 100%;
  max-width: 1200px;
  padding: 2.5rem;
  background: #fff;
  border-radius: 12px;
  box-shadow: 0 4px 24px rgba(0, 0, 0, 0.08);
}

.form-title {
  margin: 0 0 1.5rem;
  font-size: 1.5rem;
  font-weight: 700;
  color: #1e3a5f;
}

/* --- Group sections --- */
.group {
  border: 1px solid #e5e7eb;
  border-radius: 10px;
  padding: 1.25rem 1.25rem 0.25rem;
  margin-bottom: 1.5rem;
}

.group-legend {
  font-size: 0.95rem;
  font-weight: 600;
  color: #1e3a5f;
  padding: 0 0.5rem;
  background: #fff;
}

/* 3-col grid on desktop; textarea groups stay single-col */
.group-fields {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 0.75rem 1.25rem;
}

.group-fields--full {
  grid-template-columns: 1fr;
}

/* --- Fields --- */
.field {
  display: flex;
  flex-direction: column;
  gap: 0.3rem;
  margin-bottom: 0.75rem;
}

.field--full {
  grid-column: 1 / -1;
}

.field label {
  font-size: 0.85rem;
  font-weight: 500;
  color: #555;
  display: flex;
  align-items: center;
  gap: 0.3rem;
}

.field-number {
  font-weight: 700;
  font-size: 0.8rem;
  min-width: 1.5rem;
  color: inherit;
}

.field label.label--important {
  color: #dc2626;
  font-weight: 600;
}

.field input,
.field textarea {
  width: 100%;
  padding: 0.55rem 0.75rem;
  border: 1px solid #d1d5db;
  border-radius: 6px;
  font-size: 0.9rem;
  outline: none;
  transition: border-color 0.2s, box-shadow 0.2s;
  direction: rtl;
  box-sizing: border-box;
  font-family: inherit;
  background: #fafafa;
}

.field textarea {
  resize: vertical;
  min-height: 100px;
  line-height: 1.6;
}

.field input:focus,
.field textarea:focus {
  border-color: #3b82f6;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.12);
  background: #fff;
}

/* --- Action buttons --- */
.actions {
  display: flex;
  gap: 0.75rem;
  margin-top: 1rem;
  padding-top: 1.25rem;
  border-top: 1px solid #e5e7eb;
}

.btn {
  padding: 0.7rem 1.5rem;
  border: none;
  border-radius: 8px;
  font-size: 0.95rem;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.2s, transform 0.1s;
}

.btn:active:not(:disabled) {
  transform: scale(0.97);
}

.btn:disabled {
  opacity: 0.55;
  cursor: not-allowed;
}

.btn-primary {
  background-color: #1e3a5f;
  color: #fff;
}

.btn-primary:hover:not(:disabled) {
  background-color: #162d4a;
}

.btn-secondary {
  background-color: #e5e7eb;
  color: #333;
}

.btn-secondary:hover:not(:disabled) {
  background-color: #d1d5db;
}

.btn-download {
  background-color: #0ea5e9;
  color: #fff;
}

.btn-download:hover {
  background-color: #0284c7;
}

/* --- Preview --- */
.preview-section {
  margin-top: 2rem;
  border-top: 1px solid #e5e7eb;
  padding-top: 1.5rem;
}

.preview-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 1rem;
}

.preview-header h3 {
  margin: 0;
  font-size: 1.1rem;
  color: #333;
}

.preview-frame {
  width: 100%;
  height: 600px;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
}

/* --- Responsive: Tablet (577px – 1024px) --- */
@media (max-width: 1024px) {
  .form-card {
    max-width: 720px;
    padding: 1.75rem;
  }

  .group-fields {
    grid-template-columns: repeat(2, 1fr);
  }

  .preview-frame {
    height: 500px;
  }
}

/* --- Responsive: Mobile (≤576px) --- */
@media (max-width: 576px) {
  .form-card {
    max-width: 100%;
    padding: 1rem;
    border-radius: 0;
    box-shadow: none;
  }

  .form-title {
    font-size: 1.2rem;
  }

  .group {
    padding: 0.75rem 0.65rem 0.25rem;
    border-radius: 8px;
    margin-bottom: 1rem;
  }

  .group-fields {
    grid-template-columns: 1fr;
    gap: 0.5rem;
  }

  .field {
    margin-bottom: 0.5rem;
  }

  .actions {
    flex-direction: column;
  }

  .btn {
    width: 100%;
    text-align: center;
  }

  .preview-frame {
    height: 350px;
  }
}
</style>
