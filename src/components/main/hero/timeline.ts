/** Centralized timing for the IDEA → CODE → PLAYGROUND → CODE loop (~7s). */
export const HERO_TIMELINE = {
  total: 7,
  idea: { start: 0, duration: 1 },
  code: { start: 1, duration: 1.5 },
  run: { start: 2.5, duration: 0.5 },
  playground: { start: 3, duration: 2 },
  collapse: { start: 5, duration: 2 },
} as const;

export const CODE_LINES = [
  { html: '<span class="tok-kw">const</span> idea = <span class="tok-str">"GAME"</span>;' },
  { html: '<span class="tok-fn">create</span>(idea);' },
] as const;

export const CODE_PLAIN = ['const idea = "GAME";', "create(idea);"] as const;

/** Spring-like ease used across the scene */
export const SPRING = "power3.out";
export const SOFT = "power2.inOut";

export type PlaygroundObjectId =
  | "rocket"
  | "star"
  | "block"
  | "controller"
  | "planet"
  | "brackets"
  | "spark"
  | "orb";

export interface PlaygroundObjectConfig {
  id: PlaygroundObjectId;
  x: string;
  y: string;
  size: number;
  floatDuration: number;
  /** Hide on tablet and below when true */
  desktopOnly?: boolean;
  /** Hide on mobile when true */
  tabletPlus?: boolean;
}

export const PLAYGROUND_OBJECTS: PlaygroundObjectConfig[] = [
  { id: "spark", x: "52%", y: "8%", size: 18, floatDuration: 4.2 },
  { id: "rocket", x: "18%", y: "18%", size: 52, floatDuration: 5.1 },
  { id: "star", x: "78%", y: "22%", size: 36, floatDuration: 3.7 },
  { id: "block", x: "12%", y: "68%", size: 44, floatDuration: 6.2, tabletPlus: true },
  { id: "controller", x: "82%", y: "70%", size: 48, floatDuration: 4.8, tabletPlus: true },
  { id: "planet", x: "70%", y: "48%", size: 28, floatDuration: 5.6, desktopOnly: true },
  { id: "brackets", x: "42%", y: "82%", size: 40, floatDuration: 4.4 },
  { id: "orb", x: "28%", y: "42%", size: 22, floatDuration: 3.9, desktopOnly: true },
];
