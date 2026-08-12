import type { PlaygroundObjectId } from "./timeline";

interface Props {
  id: PlaygroundObjectId;
  size: number;
}

/** Original clay/SVG shapes — no copyrighted characters. */
export function PlaygroundShape({ id, size }: Props) {
  const s = size;
  switch (id) {
    case "rocket":
      return (
        <svg width={s} height={s} viewBox="0 0 48 48" fill="none" aria-hidden="true">
          <defs>
            <linearGradient id="rk" x1="12" y1="40" x2="36" y2="8" gradientUnits="userSpaceOnUse">
              <stop stopColor="#22d3ee" />
              <stop offset="1" stopColor="#67e8f9" />
            </linearGradient>
          </defs>
          <path
            d="M24 4c6 8 10 18 10 28l-6 2-4-8-4 8-6-2c0-10 4-20 10-28z"
            fill="url(#rk)"
          />
          <circle cx="24" cy="18" r="3.5" fill="#fff" fillOpacity="0.9" />
          <path d="M14 30l-4 8 6-2" fill="#f59e0b" />
          <path d="M34 30l4 8-6-2" fill="#f59e0b" />
          <path d="M21 38c1 4 2 6 3 6s2-2 3-6" fill="#f43f5e" opacity="0.85" />
        </svg>
      );
    case "star":
      return (
        <svg width={s} height={s} viewBox="0 0 40 40" fill="none" aria-hidden="true">
          <path
            d="M20 3l4.2 11.4H36l-9.4 7 3.6 11.6L20 26.8 9.8 33l3.6-11.6L4 14.4h11.8L20 3z"
            fill="#f59e0b"
          />
          <path
            d="M20 9l2.4 6.6H29l-5.4 4 2 6.6L20 22.4 14.4 26.2l2-6.6-5.4-4h6.6L20 9z"
            fill="#fde68a"
            opacity="0.85"
          />
        </svg>
      );
    case "block":
      return (
        <svg width={s} height={s} viewBox="0 0 44 44" fill="none" aria-hidden="true">
          <path d="M8 16l14-8 14 8v16l-14 8-14-8V16z" fill="#84cc16" />
          <path d="M8 16l14 8 14-8" fill="#65a30d" />
          <path d="M22 24v16l14-8V16L22 24z" fill="#4d7c0f" opacity="0.9" />
          <path d="M8 16v16l14 8V24L8 16z" fill="#a3e635" opacity="0.75" />
          <rect x="14" y="18" width="5" height="5" rx="0.5" fill="#166534" opacity="0.35" />
          <rect x="24" y="26" width="5" height="5" rx="0.5" fill="#166534" opacity="0.35" />
        </svg>
      );
    case "controller":
      return (
        <svg width={s} height={s} viewBox="0 0 52 36" fill="none" aria-hidden="true">
          <rect x="2" y="6" width="48" height="24" rx="12" fill="#0f172a" />
          <rect x="4" y="8" width="44" height="20" rx="10" fill="#1e293b" />
          <circle cx="16" cy="18" r="5" fill="#334155" />
          <path d="M16 15.5v5M13.5 18h5" stroke="#94a3b8" strokeWidth="1.5" strokeLinecap="round" />
          <circle cx="34" cy="15" r="2.2" fill="#f43f5e" />
          <circle cx="39" cy="18" r="2.2" fill="#22d3ee" />
          <circle cx="34" cy="21" r="2.2" fill="#84cc16" />
          <circle cx="29" cy="18" r="2.2" fill="#f59e0b" />
        </svg>
      );
    case "planet":
      return (
        <svg width={s} height={s} viewBox="0 0 32 32" fill="none" aria-hidden="true">
          <circle cx="16" cy="16" r="10" fill="#a78bfa" />
          <ellipse
            cx="16"
            cy="16"
            rx="14"
            ry="4"
            stroke="#c4b5fd"
            strokeWidth="2"
            fill="none"
            transform="rotate(-20 16 16)"
          />
          <circle cx="12" cy="13" r="2" fill="#7c3aed" opacity="0.5" />
        </svg>
      );
    case "brackets":
      return (
        <svg width={s} height={s * 0.7} viewBox="0 0 56 36" fill="none" aria-hidden="true">
          <text
            x="28"
            y="26"
            textAnchor="middle"
            fontFamily="ui-monospace, SFMono-Regular, Menlo, monospace"
            fontSize="18"
            fontWeight="600"
            fill="currentColor"
          >
            {"{ code }"}
          </text>
        </svg>
      );
    case "spark":
      return (
        <svg width={s} height={s} viewBox="0 0 20 20" fill="none" aria-hidden="true">
          <path
            d="M10 1l1.5 6L18 10l-6.5 1.5L10 19l-1.5-7.5L2 10l6.5-3L10 1z"
            fill="#22d3ee"
          />
        </svg>
      );
    case "orb":
      return (
        <svg width={s} height={s} viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <defs>
            <radialGradient id="orbg" cx="35%" cy="30%" r="65%">
              <stop stopColor="#fff" />
              <stop offset="0.45" stopColor="#67e8f9" />
              <stop offset="1" stopColor="#0891b2" />
            </radialGradient>
          </defs>
          <circle cx="12" cy="12" r="10" fill="url(#orbg)" />
        </svg>
      );
    default:
      return null;
  }
}
