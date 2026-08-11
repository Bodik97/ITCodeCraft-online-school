import type { LandingPrefix } from "@/lib/landing";

export type { LandingPrefix };

/** Shared visual tokens for themed landing sections. */
export type LandingTheme = {
  prefix: LandingPrefix;
  accent: string;
  accentDark: string;
  accentRgb: string;
  accentSoft: string;
  accentHover: string;
  star: string;
  checkBg: string;
  checkFg: string;
  muted: string;
  mutedSoft: string;
  heading: string;
  eyebrow: string;
  sectionBg: string;
  quizBg: string;
  faqBg: string;
  parentsBg: string;
  registerBg: string;
  registerText: string;
  registerSubtext: string;
  registerCheckBg: string;
  registerCheckFg: string;
  formBoxClass: string;
  formStyle: string;
  formId: string;
  successTextClass: string;
  /** Explicit heading color so inherit/`text-ink` can't wash out on light boxes */
  successHeadingClass: string;
  /** Muted line under the success heading */
  successMutedClass: string;
  /** Form error line under the box */
  formErrorClass: string;
  cardClass: string;
  iconWrapClass: string;
  btn: string;
  btnPrimary: string;
  btnGhost: string;
  stepNumActive: string;
  stepCardActive: string;
  stepLabelActive: string;
  stepPlus: string;
  stepOutcomeBox: string;
  stepOutcomeText: string;
  stepBorder: string;
  quizProgress: string;
  quizTrack: string;
  quizFill: string;
  quizOption: string;
  quizTagLi: string;
  quizTagCheck: string;
  quizRestart: string;
  barTrack: string;
  barFillGradient: string;
  levelColor: string;
  skillNameColor: string;
  avatarGradient: string;
  avatarColors?: string[];
  howNumIdle: string;
  headerClass: string;
  navLinkClass: string;
  backLinkClass: string;
  mobileToggleClass: string;
  mobilePanelClass: string;
  mobileLinkClass: string;
  mobileDot: string;
  mobileCtaClass: string;
  ctaBtnClass: string;
  guaranteeSection: string;
  guaranteeIconWrap: string;
  guaranteeBadge: string;
  resultsLine: string;
  resultsWhen: string;
  resultsText: string;
};

const THEMES: Record<LandingPrefix, LandingTheme> = {
  fe: {
    prefix: "fe",
    accent: "#6366f1",
    accentDark: "#4f46e5",
    accentRgb: "99, 102, 241",
    accentSoft: "#6366f1",
    accentHover: "#6366f1",
    star: "#fbbf24",
    checkBg: "#6366f1",
    checkFg: "#ffffff",
    muted: "text-slate-700",
    mutedSoft: "text-slate-500",
    heading: "text-[#0f172a]",
    eyebrow:
      "fe-mono inline-block bg-[#6366f1]/10 text-[#6366f1] text-xs font-bold px-3 py-1.5 rounded-md uppercase tracking-[0.15em] mb-4 border border-[#6366f1]/20",
    sectionBg: "",
    quizBg: "bg-[#eef2ff]",
    faqBg: "bg-[#f1f5f9]",
    parentsBg: "bg-white border-t border-slate-200",
    registerBg: "bg-linear-to-br from-[#4f46e5] to-[#7c3aed]",
    registerText: "text-white",
    registerSubtext: "text-white/90",
    registerCheckBg: "bg-white/20 text-white",
    registerCheckFg: "",
    formBoxClass: "rounded-2xl bg-surface p-6 md:p-8 shadow-2xl",
    formStyle:
      "--form-accent:#6366f1;--form-accent-rgb:99, 102, 241;--form-accent-fg:#ffffff;",
    formId: "frontend-landing",
    successTextClass: "text-center text-white py-6",
    successHeadingClass: "text-white",
    successMutedClass: "text-white/80",
    formErrorClass: "mt-4 text-center text-sm font-medium text-[#fca5a5]",
    cardClass: "fe-card",
    iconWrapClass:
      "inline-flex h-12 w-12 items-center justify-center rounded-xl bg-[#6366f1]/10 text-[#6366f1] mb-4",
    btn: "fe-btn",
    btnPrimary: "fe-btn fe-btn-primary",
    btnGhost: "fe-btn fe-btn-ghost",
    stepNumActive:
      "group-[.is-active]:bg-linear-to-br group-[.is-active]:from-[#6366f1] group-[.is-active]:to-[#8b5cf6] group-[.is-active]:border-transparent group-[.is-active]:text-white",
    stepCardActive:
      "group-[.is-active]:border-[#6366f1]/40 group-[.is-active]:shadow-[0_18px_40px_-16px_rgba(99,102,241,0.45)]",
    stepLabelActive: "group-[.is-active]:text-[#6366f1]",
    stepPlus: "text-[#6366f1]",
    stepOutcomeBox: "bg-[#6366f1]/5 border border-[#6366f1]/20 p-3 rounded-xl",
    stepOutcomeText: "text-[#6366f1]",
    stepBorder: "border-t border-slate-100",
    quizProgress:
      "fe-mono text-xs font-bold uppercase tracking-[0.15em] text-[#6366f1]",
    quizTrack: "h-2.5 w-full rounded-full bg-slate-200 overflow-hidden mb-6",
    quizFill: "h-full bg-linear-to-r from-[#6366f1] to-neon-cyan transition-[width] duration-300",
    quizOption:
      "quiz-option fe-btn rounded-xl border-2 border-slate-200 bg-white px-4 py-4 text-sm font-bold text-[#0f172a] hover:border-[#6366f1] hover:bg-[#6366f1]/5 transition-colors",
    quizTagLi: "flex items-start gap-3 text-slate-700",
    quizTagCheck:
      "inline-flex w-6 h-6 rounded-md bg-[#6366f1] items-center justify-center text-white text-sm shrink-0",
    quizRestart: "text-sm font-bold text-slate-500 underline hover:text-[#6366f1]",
    barTrack: "h-3 w-full rounded-full bg-slate-100 overflow-hidden",
    barFillGradient: "bg-linear-to-r from-[#6366f1] to-neon-cyan",
    levelColor: "fe-mono text-xs font-bold text-[#6366f1]",
    skillNameColor: "text-[#0f172a]",
    avatarGradient: "bg-linear-to-br from-[#6366f1] to-[#8b5cf6]",
    howNumIdle:
      "w-11 h-11 sm:w-14 sm:h-14 rounded-xl bg-white border border-slate-200 text-slate-300",
    headerClass: "sticky top-0 z-50 border-b border-slate-200 bg-white/90 backdrop-blur-sm",
    navLinkClass:
      "text-sm font-semibold text-slate-700 hover:text-[#6366f1] transition-colors",
    backLinkClass:
      "hidden lg:inline-flex text-sm font-semibold text-slate-700 hover:text-[#6366f1] transition-colors",
    mobileToggleClass: "border-[#6366f1] text-[#6366f1] hover:bg-[#6366f1]/10",
    mobilePanelClass: "bg-white border-slate-200",
    mobileLinkClass:
      "bg-[#f4f5fb] border-[#e2e5f3] text-[#475569] hover:bg-[#eef0fb] hover:border-[#6366f1]",
    mobileDot: "#6366f1",
    mobileCtaClass: "fe-btn fe-btn-primary",
    ctaBtnClass: "fe-btn fe-btn-primary hidden lg:inline-flex items-center rounded-lg px-4 py-2 text-sm font-bold",
    guaranteeSection: "py-10 bg-[#2b2440]",
    guaranteeIconWrap:
      "shrink-0 inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-[#4CBF56] text-white shadow-lg",
    guaranteeBadge:
      "inline-block bg-[#4CBF56]/20 text-[#9be88a] text-xs font-black px-3 py-1 rounded-full uppercase tracking-[0.15em] mb-2",
    resultsLine:
      "hidden md:block absolute top-9 left-[16%] right-[16%] h-1 bg-linear-to-r from-[#4C97FF] via-[#9966FF] to-[#FF8C1A] rounded-full",
    resultsWhen: "font-display font-bold text-lg text-[#ff8c1a] mb-2",
    resultsText: "text-[#6b6480] text-sm leading-relaxed max-w-xs mx-auto",
  },
  sc: {
    prefix: "sc",
    accent: "#ff8c1a",
    accentDark: "#d96b00",
    accentRgb: "255, 140, 26",
    accentSoft: "#d96b00",
    accentHover: "#ff8c1a",
    star: "#FFBF00",
    checkBg: "#ff8c1a",
    checkFg: "#ffffff",
    muted: "text-[#6b6480]",
    mutedSoft: "text-[#897f9e]",
    heading: "text-[#2b2440]",
    eyebrow:
      "inline-block bg-[#ff8c1a]/12 text-[#d96b00] text-xs font-black px-3 py-1.5 rounded-full uppercase tracking-[0.15em] mb-4 border-2 border-[#ff8c1a]/30",
    sectionBg: "bg-white border-b-2 border-[#f0e6d6]",
    quizBg: "bg-[#fff3df] border-y-2 border-[#f0e6d6]",
    faqBg: "bg-[#fff3df] border-y-2 border-[#f0e6d6]",
    parentsBg: "bg-white border-b-2 border-[#f0e6d6]",
    registerBg: "bg-linear-to-br from-[#ff8c1a] to-[#ffbf00]",
    registerText: "text-[#3d2200]",
    registerSubtext: "text-[#5a3a00]",
    registerCheckBg: "bg-[#3d2200] text-[#ffbf00]",
    registerCheckFg: "",
    formBoxClass: "rounded-3xl bg-[#0e172b] p-6 md:p-8 shadow-2xl",
    formStyle:
      "--form-accent:#ff8c1a;--form-accent-rgb:255, 140, 26;--form-accent-fg:#ffffff;",
    formId: "scratch-landing",
    successTextClass: "text-center text-white py-6",
    successHeadingClass: "text-white",
    successMutedClass: "text-white/80",
    formErrorClass: "mt-4 text-center text-sm font-medium text-[#fca5a5]",
    cardClass: "sc-card",
    iconWrapClass:
      "inline-flex h-12 w-12 items-center justify-center rounded-2xl text-white mb-4",
    btn: "sc-btn",
    btnPrimary: "sc-btn sc-btn-primary",
    btnGhost: "sc-btn sc-btn-soft",
    stepNumActive:
      "group-[.is-active]:bg-[#ff8c1a] group-[.is-active]:border-[#ff8c1a] group-[.is-active]:text-white",
    stepCardActive: "group-[.is-active]:border-[#ff8c1a]/40",
    stepLabelActive: "group-[.is-active]:text-[#d96b00]",
    stepPlus: "text-[#ff8c1a]",
    stepOutcomeBox:
      "bg-[#ff8c1a]/8 border-2 border-[#ff8c1a]/25 p-3 rounded-2xl",
    stepOutcomeText: "text-[#d96b00]",
    stepBorder: "border-t-2 border-dashed border-[#f0e6d6]",
    quizProgress:
      "text-xs font-black uppercase tracking-[0.15em] text-[#d96b00]",
    quizTrack: "h-3 w-full rounded-full bg-[#fde9d2] overflow-hidden mb-6",
    quizFill:
      "h-full bg-linear-to-r from-[#ff8c1a] to-[#ffbf00] transition-[width] duration-300",
    quizOption:
      "quiz-option sc-btn rounded-2xl border-2 border-[#ffd9b0] bg-white px-4 py-4 text-sm font-bold text-[#2b2440] hover:border-[#ff8c1a] hover:bg-[#fff6ea] transition-colors",
    quizTagLi: "flex items-start gap-3 text-[#4b4560]",
    quizTagCheck:
      "inline-flex w-6 h-6 rounded-lg bg-[#ff8c1a] items-center justify-center text-white text-sm shrink-0",
    quizRestart: "text-sm font-bold text-[#6b6480] underline hover:text-[#ff8c1a]",
    barTrack: "h-3.5 w-full rounded-full bg-[#fde9d2] overflow-hidden",
    barFillGradient: "bg-linear-to-r from-[#ff8c1a] to-[#ffbf00]",
    levelColor: "font-bold text-xs text-[#d96b00]",
    skillNameColor: "text-[#2b2440]",
    avatarGradient: "",
    avatarColors: ["#4C97FF", "#9966FF", "#CF63CF", "#FFBF00", "#4CBF56", "#FF8C1A"],
    howNumIdle:
      "w-11 h-11 sm:w-14 sm:h-14 rounded-2xl bg-white border-2 border-[#f0e6d6] text-[#c9bfd9]",
    headerClass:
      "sticky top-0 z-50 border-b-2 border-[#f0e6d6] bg-white/90 backdrop-blur-sm",
    navLinkClass:
      "text-sm font-semibold text-[#6b6480] hover:text-[#ff8c1a] transition-colors",
    backLinkClass:
      "hidden lg:inline-flex text-sm font-semibold text-[#6b6480] hover:text-[#ff8c1a] transition-colors",
    mobileToggleClass: "border-[#ff8c1a] text-[#ff8c1a] hover:bg-[#ff8c1a]/10",
    mobilePanelClass: "bg-white border-[#f0e6d6]",
    mobileLinkClass:
      "bg-[#fff7ec] border-[#ffe0bf] text-[#5b5470] hover:bg-[#fff0dd] hover:border-[#ff8c1a]",
    mobileDot: "#ff8c1a",
    mobileCtaClass: "sc-btn sc-btn-primary",
    ctaBtnClass:
      "sc-btn sc-btn-primary hidden lg:inline-flex items-center rounded-xl px-4 py-2 text-sm font-bold",
    guaranteeSection: "py-10 bg-[#2b2440]",
    guaranteeIconWrap:
      "shrink-0 inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-[#4CBF56] text-white shadow-lg",
    guaranteeBadge:
      "inline-block bg-[#4CBF56]/20 text-[#9be88a] text-xs font-black px-3 py-1 rounded-full uppercase tracking-[0.15em] mb-2",
    resultsLine:
      "hidden md:block absolute top-9 left-[16%] right-[16%] h-1 bg-linear-to-r from-[#4C97FF] via-[#9966FF] to-[#FF8C1A] rounded-full",
    resultsWhen: "font-display font-bold text-lg text-[#ff8c1a] mb-2",
    resultsText: "text-[#6b6480] text-sm leading-relaxed max-w-xs mx-auto",
  },
  mc: {
    prefix: "mc",
    accent: "#5dae3f",
    accentDark: "#3a7d20",
    accentRgb: "93, 174, 63",
    accentSoft: "#3a7d20",
    accentHover: "#3a7d20",
    star: "#fbbf24",
    checkBg: "#5dae3f",
    checkFg: "#ffffff",
    muted: "text-[#6b7280]",
    mutedSoft: "text-[#6b7280]",
    heading: "text-[#1f2937]",
    eyebrow:
      "inline-block bg-[#5dae3f]/10 text-[#3a7d20] text-xs font-black px-3 py-1.5 rounded-full uppercase tracking-[0.15em] mb-4 border-2 border-[#5dae3f]/30",
    sectionBg: "bg-white border-b-2 border-[#1f2937]",
    quizBg: "bg-[#eaf6e2] border-b-2 border-[#1f2937]",
    faqBg: "",
    parentsBg: "bg-[#f5fbef] border-b-2 border-[#1f2937]",
    registerBg: "bg-[#3a7d20] border-t-2 border-[#1f2937]",
    registerText: "text-white",
    registerSubtext: "text-white/90",
    registerCheckBg: "bg-[#fbbf24] text-[#1f2937] mc-block-sm",
    registerCheckFg: "",
    formBoxClass: "rounded-[12px] bg-white p-6 md:p-8 mc-block",
    formStyle:
      "--form-accent:#5dae3f;--form-accent-rgb:93, 174, 63;--form-accent-fg:#ffffff;",
    formId: "minecraft-landing",
    // Form box is white — success copy must be dark
    successTextClass: "text-center text-[#1f2937] py-6",
    successHeadingClass: "text-[#1f2937]",
    successMutedClass: "text-[#4b5563]",
    formErrorClass: "mt-4 text-center text-sm font-medium text-[#b91c1c]",
    cardClass: "rounded-[10px] bg-[#f5fbef] mc-block-sm",
    iconWrapClass:
      "inline-flex h-12 w-12 items-center justify-center rounded-[8px] bg-[#5dae3f] text-white mb-4 mc-block-sm",
    btn: "mc-btn",
    btnPrimary: "mc-btn mc-btn-grass",
    btnGhost: "mc-btn",
    stepNumActive: "group-[.is-active]:bg-[#5dae3f] group-[.is-active]:text-white",
    stepCardActive: "group-[.is-active]:shadow-[5px_5px_0_0_#5dae3f]",
    stepLabelActive: "group-[.is-active]:text-[#3a7d20]",
    stepPlus: "text-[#5dae3f]",
    stepOutcomeBox:
      "bg-[#5dae3f]/10 border-2 border-[#5dae3f]/30 p-3 rounded-[8px]",
    stepOutcomeText: "text-[#3a7d20]",
    stepBorder: "border-t-2 border-dashed border-[#e5e7eb]",
    quizProgress:
      "text-xs font-black uppercase tracking-[0.15em] text-[#3a7d20]",
    quizTrack:
      "h-3 w-full rounded-full bg-[#eaf6e2] border-2 border-[#1f2937] overflow-hidden mb-6",
    quizFill: "h-full bg-[#5dae3f] transition-[width] duration-300",
    quizOption:
      "quiz-option mc-btn rounded-[8px] bg-[#f5fbef] px-4 py-4 text-sm font-bold text-[#1f2937] hover:bg-[#fbbf24] transition-colors",
    quizTagLi: "flex items-start gap-3 text-[#374151]",
    quizTagCheck:
      "inline-flex w-6 h-6 rounded-[4px] bg-[#5dae3f] items-center justify-center text-white text-sm shrink-0",
    quizRestart: "text-sm font-bold text-[#6b7280] underline hover:text-[#3a7d20]",
    barTrack:
      "h-3.5 w-full rounded-full bg-[#eaf6e2] border-2 border-[#1f2937] overflow-hidden",
    barFillGradient: "bg-[#5dae3f]",
    levelColor: "font-bold text-xs text-[#3a7d20]",
    skillNameColor: "text-[#1f2937]",
    avatarGradient: "bg-[#5dae3f] mc-block-sm",
    howNumIdle:
      "w-11 h-11 sm:w-14 sm:h-14 rounded-[8px] bg-white border-2 border-[#1f2937] text-[#9ca3af] mc-block-sm",
    headerClass:
      "sticky top-0 z-50 border-b-2 border-[#1f2937] bg-[#3a7d20]/95 backdrop-blur-sm",
    navLinkClass:
      "text-sm font-semibold text-white/90 hover:text-[#fde047] transition-colors",
    backLinkClass:
      "hidden lg:inline-flex text-sm font-semibold text-white/90 hover:text-[#fde047] transition-colors",
    mobileToggleClass:
      "border-white/40 text-white hover:border-[#fde047] hover:text-[#fde047]",
    mobilePanelClass: "bg-[#3a7d20] border-[#1f2937]",
    mobileLinkClass:
      "bg-white/5 border-white/15 text-white hover:bg-white/10 hover:border-[#fde047]",
    mobileDot: "#fde047",
    mobileCtaClass: "mc-btn mc-btn-gold",
    ctaBtnClass:
      "mc-btn mc-btn-gold hidden lg:inline-flex items-center rounded-[6px] px-4 py-2 text-sm font-bold",
    guaranteeSection: "py-10 bg-[#1f2937]",
    guaranteeIconWrap:
      "shrink-0 inline-flex h-16 w-16 items-center justify-center rounded-[10px] bg-[#5dae3f] text-white mc-block-sm",
    guaranteeBadge:
      "inline-block bg-[#5dae3f]/20 text-[#a7e08a] text-xs font-black px-3 py-1 rounded-full uppercase tracking-[0.15em] mb-2",
    resultsLine:
      "hidden md:block absolute top-9 left-[16%] right-[16%] h-1 bg-gradient-to-r from-[#5dae3f] via-[#22a06b] to-[#3a7d20] rounded-full",
    resultsWhen: "font-display font-bold text-lg text-[#3a7d20] mb-2",
    resultsText: "text-[#6b7280] text-sm leading-relaxed max-w-xs mx-auto",
  },
};

export function getLandingTheme(prefix: LandingPrefix): LandingTheme {
  return THEMES[prefix];
}

export const SCRATCH_BLOCK_COLORS = [
  "#4C97FF",
  "#9966FF",
  "#CF63CF",
  "#FFBF00",
  "#4CBF56",
  "#FF8C1A",
] as const;
