/// <reference types="vite/client" />

// Vite treats .ttf files as static assets and returns their URL
// when imported. This declaration tells TypeScript that importing
// a .ttf file gives you a string (the asset URL).
declare module '*.ttf' {
  const src: string
  export default src
}

// bidi-js does not ship type declarations. This minimal declaration
// covers the subset of the API that we use (factory → getEmbeddingLevels
// + getReorderedString).
declare module 'bidi-js' {
  interface EmbeddingLevels {
    levels: Uint8Array
    paragraphs: Array<{ start: number; end: number; level: number }>
  }

  interface BidiAPI {
    getEmbeddingLevels(text: string, direction?: 'ltr' | 'rtl' | 'auto'): EmbeddingLevels
    getReorderedString(text: string, embeddingLevels: EmbeddingLevels): string
  }

  function bidiFactory(): BidiAPI
  export default bidiFactory
}
