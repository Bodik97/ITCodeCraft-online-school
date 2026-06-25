/// <reference types="astro/client" />

interface ImportMetaEnv {
  readonly PUBLIC_GOOGLE_SCRIPT_URL?: string;
  readonly PUBLIC_ITCC_TRACK_ENDPOINT?: string;
  readonly PUBLIC_FB_PIXEL_ID?: string;
  readonly PUBLIC_GTM_ID?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

interface Window {
  dataLayer?: Record<string, unknown>[];
  LEELOO_INIT_CHECK?: boolean;
  LEELOO_LEADGENTOOLS?: string[];
  itccTrack?: (
    event: string,
    label?: string,
    opts?: { skipThrottle?: boolean },
  ) => void;
  __itccRegistrationClicks?: number;
  productName?: string;
  fbq?: (...args: unknown[]) => void;
  gtag?: (...args: unknown[]) => void;
}
