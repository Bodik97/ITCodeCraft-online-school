export type LandingPrefix = "fe" | "sc" | "mc";

export type LandingTheme = {
  prefix: LandingPrefix;
  accent: string;
  accentRgb: string;
  accentDark: string;
  btnPrimary: string;
  btnGhost?: string;
  reveal: string;
  card: string;
  mono?: string;
  navHover: string;
  mobileToggle: string;
  mobilePanel: string;
  mobileLink: string;
  stickyBar: string;
};

export const landingThemes: Record<LandingPrefix, LandingTheme> = {
  fe: {
    prefix: "fe",
    accent: "#6366f1",
    accentRgb: "99, 102, 241",
    accentDark: "#4f46e5",
    btnPrimary: "fe-btn fe-btn-primary",
    btnGhost: "fe-btn fe-btn-ghost",
    reveal: "fe-reveal",
    card: "fe-card",
    mono: "fe-mono",
    navHover: "hover:text-[#6366f1]",
    mobileToggle: "border-[#6366f1] text-[#6366f1] hover:bg-[#6366f1]/10",
    mobilePanel: "bg-white border-slate-200",
    mobileLink:
      "bg-[#f4f5fb] border-[#e2e5f3] text-[#475569] hover:bg-[#eef0fb] hover:border-[#6366f1]",
    stickyBar: "bg-white/92 border-t border-slate-200",
  },
  sc: {
    prefix: "sc",
    accent: "#ff8c1a",
    accentRgb: "255, 140, 26",
    accentDark: "#d96b00",
    btnPrimary: "sc-btn sc-btn-primary",
    reveal: "sc-reveal",
    card: "sc-card",
    navHover: "hover:text-[#d96b00]",
    mobileToggle: "border-[#ff8c1a] text-[#d96b00] hover:bg-[#ff8c1a]/10",
    mobilePanel: "bg-[#fffaf3] border-[#f0e6d6]",
    mobileLink:
      "bg-white border-[#f0e6d6] text-[#4b4560] hover:bg-[#fff3e6] hover:border-[#ff8c1a]",
    stickyBar: "bg-white/92 border-t border-[#f0e6d6]",
  },
  mc: {
    prefix: "mc",
    accent: "#5dae3f",
    accentRgb: "93, 174, 63",
    accentDark: "#3a7d20",
    btnPrimary: "mc-btn mc-btn-gold",
    reveal: "mc-reveal",
    card: "mc-card",
    navHover: "hover:text-[#3a7d20]",
    mobileToggle: "border-[#5dae3f] text-[#3a7d20] hover:bg-[#5dae3f]/10",
    mobilePanel: "bg-[#f4f7f0] border-[#1f2937]",
    mobileLink:
      "bg-white border-[#d1d5db] text-[#374151] hover:bg-[#e8f5e1] hover:border-[#5dae3f]",
    stickyBar: "bg-[#3a7d20]/95 border-t-2 border-[#1f2937]",
  },
};
