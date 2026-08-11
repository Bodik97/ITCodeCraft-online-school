import { initFormFeedback, type FormFeedbackSelectors } from "./formFeedback";
import { initTimelineSteps } from "./timeline";
import { initCounters } from "./counters";
import { initSkillBars } from "./skillBars";
import { initQuiz, type QuizOptions } from "./quiz";

export { initFormFeedback, type FormFeedbackSelectors };
export { initTimelineSteps };
export { initCounters };
export { initSkillBars };
export { initQuiz, type QuizOptions };

export type LandingPrefix = "fe" | "sc" | "mc";

/** Convenience bundle for a themed landing page's shared interactions. */
export function initLandingInteractions(opts: {
  prefix: LandingPrefix;
  quiz: QuizOptions;
}): void {
  const { prefix, quiz } = opts;
  initFormFeedback({
    form: `[data-${prefix}-form]`,
    success: `[data-${prefix}-success]`,
    error: `[data-${prefix}-error]`,
  });
  initTimelineSteps(`.${prefix}-step`);
  initCounters(`.${prefix}-counter[data-${prefix}-count]`, `${prefix}-count`);
  initSkillBars(
    `${prefix}-skills`,
    `.${prefix}-bar-fill[data-${prefix}-level]`,
    `${prefix}-level`,
  );
  initQuiz(quiz);
}
