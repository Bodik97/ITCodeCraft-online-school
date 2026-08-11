/// <reference types="astro/client" />

interface ImportMetaEnv {
  readonly PUBLIC_GOOGLE_SCRIPT_URL?: string;
  readonly PUBLIC_ITCC_TRACK_ENDPOINT?: string;
  readonly PUBLIC_GTM_ID?: string;
  readonly PUBLIC_GTM_ID_ROBLOX?: string;
  readonly PUBLIC_GOOGLE_ADS_SEND_TO?: string;
  readonly PUBLIC_TELEGRAM_BOT_TOKEN?: string;
  readonly PUBLIC_TELEGRAM_CHAT_ID?: string;
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
  /** Google Ads conversion: "Заявка Roblox (форма)". */
  gtag_report_conversion?: (url?: string) => boolean;
}
