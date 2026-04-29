/// <reference types="astro/client" />

interface ImportMetaEnv {
  /** URL прийому подій (наприклад Google Apps Script). Без цього мета-тег не рендериться і трекінг вимкнено. */
  readonly PUBLIC_ITCC_TRACK_ENDPOINT?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
