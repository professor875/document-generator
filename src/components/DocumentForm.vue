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
  <!-- Card wrapper with RTL direction for Hebrew content -->
  <div class="form-card" dir="rtl">
    <h2 class="form-title">Generate Document</h2>

    <form @submit.prevent="handleGenerate">
      <!--
        Dynamically render one labeled input per field definition.
        The field's id is used as both the v-model key and the
        input's id attribute for accessibility.
      -->
      <div v-for="field in DOCUMENT_FIELDS" :key="field.id" class="field">
        <label :for="field.id">{{ field.label }}</label>
        <!-- Render textarea for multiline fields, input for everything else -->
        <textarea
          v-if="field.type === 'textarea'"
          :id="field.id"
          v-model="formData[field.id]"
          :placeholder="field.placeholder || ''"
          rows="4"
        ></textarea>
        <input
          v-else
          :id="field.id"
          v-model="formData[field.id]"
          :type="field.type"
          :placeholder="field.placeholder || ''"
        />
      </div>

      <!-- Action buttons -->
      <div class="actions">
        <!-- Generate and download immediately -->
        <button
          type="submit"
          class="btn btn-primary"
          :disabled="loading"
        >
          {{ loading ? 'Generating...' : 'Generate PDF' }}
        </button>

        <!-- Generate and show inline preview -->
        <button
          type="button"
          class="btn btn-secondary"
          :disabled="loading"
          @click="handlePreview"
        >
          Preview PDF
        </button>
      </div>
    </form>

    <!--
      PDF Preview section.
      Shown only when a previewUrl has been created from a generated blob.
    -->
    <div v-if="previewUrl" class="preview-section">
      <div class="preview-header">
        <h3>Preview</h3>
        <!-- Allow downloading directly from the preview -->
        <button class="btn btn-download" @click="downloadFromPreview">
          Download
        </button>
      </div>

      <!-- Embed the generated PDF in an iframe -->
      <iframe
        :src="previewUrl"
        class="preview-frame"
        title="PDF Preview"
      ></iframe>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onBeforeUnmount } from 'vue'
// Field definitions that describe each input in the form
import { DOCUMENT_FIELDS } from '@/services/fields'
// PDF generation service -- returns raw PDF bytes
import { generateDocument } from '@/services/pdf'

// -------------------------------------------------------------------
// Reactive state
// -------------------------------------------------------------------

// Build the initial formData object from each field's defaultValue.
// Using reactive() so Vue tracks changes to every property.
const formData: Record<string, string> = reactive(
  DOCUMENT_FIELDS.reduce((acc, field) => {
    acc[field.id] = field.defaultValue
    return acc
  }, {} as Record<string, string>)
)

// True while a PDF is being generated (disables buttons, shows text)
const loading = ref(false)

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
/* Card container with subtle shadow */
.form-card {
  width: 100%;
  max-width: 600px;
  padding: 2rem;
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
}

/* Form title */
.form-title {
  margin: 0 0 1.5rem;
  font-size: 1.35rem;
  font-weight: 600;
  color: #333;
}

/* Each label + input pair */
.field {
  display: flex;
  flex-direction: column;
  gap: 0.3rem;
  margin-bottom: 1rem;
}

.field label {
  font-size: 0.9rem;
  font-weight: 500;
  color: #444;
  /* Labels are right-aligned by the RTL direction on the parent */
}

.field input,
.field textarea {
  width: 100%;
  padding: 0.6rem 0.75rem;
  border: 1px solid #ccc;
  border-radius: 4px;
  font-size: 0.95rem;
  outline: none;
  transition: border-color 0.2s;
  direction: rtl;
  box-sizing: border-box;
  font-family: inherit;
}

.field textarea {
  resize: vertical;
  min-height: 80px;
  line-height: 1.5;
}

.field input:focus,
.field textarea:focus {
  border-color: #3b82f6;
}

/* Action button row */
.actions {
  display: flex;
  gap: 0.75rem;
  margin-top: 1.5rem;
}

/* Shared button base styles */
.btn {
  padding: 0.65rem 1.25rem;
  border: none;
  border-radius: 4px;
  font-size: 0.95rem;
  cursor: pointer;
  transition: background-color 0.2s;
}

.btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

/* Primary action -- generate / download */
.btn-primary {
  background-color: #1e3a5f;
  color: #fff;
}

.btn-primary:hover:not(:disabled) {
  background-color: #162d4a;
}

/* Secondary action -- preview */
.btn-secondary {
  background-color: #e5e7eb;
  color: #333;
}

.btn-secondary:hover:not(:disabled) {
  background-color: #d1d5db;
}

/* Download button beside the preview */
.btn-download {
  background-color: #0ea5e9;
  color: #fff;
}

.btn-download:hover {
  background-color: #0284c7;
}

/* Preview section below the form */
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

/* Iframe that displays the generated PDF */
.preview-frame {
  width: 100%;
  height: 500px;
  border: 1px solid #e5e7eb;
  border-radius: 4px;
}
</style>
