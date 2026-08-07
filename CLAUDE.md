# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Hebrew legal document (lawsuit/claim) PDF generator. Vue 3 SPA that renders a dynamic form, collects 40+ fields, and generates a multi-page RTL PDF using pdf-lib with custom font embedding (NotoSansHebrew).

## Commands

```bash
npm run dev          # Vite dev server (localhost:5173)
npm run build        # Type-check (vue-tsc) + production bundle
npm run build-only   # Production bundle without type-check
npm run type-check   # vue-tsc --build (incremental)
npm run preview      # Serve production build locally
```

No test runner or linter is configured.

## Architecture

### PDF Generation Pipeline

1. User fills `DocumentForm.vue` → flat `Record<string, string>` form data
2. `pdf-v2.ts:generateDocument()` converts flat data to typed `DocumentFields`, creates a blank PDF, embeds Hebrew fonts, adds 5 US Letter pages, and calls each page renderer
3. Page renderers (`templates/page1-5.ts`) use `PageLayout` to add content
4. Result downloaded as PDF blob or previewed in an iframe

### PageLayout Engine (`templates/layout.ts`)

The core abstraction. Wraps pdf-lib's coordinate-based drawing into a flow-based system with automatic Y-position tracking.

Key design decisions:
- **Logical text order preserved** — text is split into same-direction segments (Hebrew vs LTR) but never reversed. The PDF viewer applies BiDi rendering per-segment. This prevents number/punctuation reversal in mixed Hebrew+number text.
- **Segment-based RTL rendering** — `drawTextLine()` splits text into segments, measures each, and positions them right-to-left for RTL flow.
- All page content uses `.add*()` methods (addRightText, addRow, addBorderedSection, addNumberedParagraph, etc.) — templates should never calculate coordinates manually.

### Data Flow

- `fields.ts` — Single source of truth for form field definitions (id, label, type, defaultValue, group). The form UI auto-generates from this array.
- `types.ts` — `DocumentFields` typed interface used by templates. Flat form data is mapped to this structured shape in `pdf-v2.ts`.
- Adding a new field requires: adding to `DOCUMENT_FIELDS` in fields.ts, adding to `DocumentFields` in types.ts, mapping in pdf-v2.ts, and using in the relevant page template.

### Auth

Hardcoded local auth (`admin`/`admin123`) with localStorage persistence. Not production-ready. Router guards in `router/index.ts` enforce protected/guest-only routes.

## Key Conventions

- All text content is Hebrew (RTL). HTML root is `dir="rtl" lang="he"`.
- Path alias: `@/` maps to `src/`.
- Fonts are fetched once and cached in memory across PDF generations.
- `pdf.ts` exists but is unused — `pdf-v2.ts` is the active PDF generator.
- `pdfmake` is an unused dependency; only `pdf-lib` is used.
- TypeScript strict mode with `noUncheckedIndexedAccess: true`.
