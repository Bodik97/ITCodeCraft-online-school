/** Accordion timeline: click a step to toggle `.is-active`. */
export function initTimelineSteps(stepSelector: string): void {
  const steps = Array.from(
    document.querySelectorAll<HTMLElement>(stepSelector),
  );
  steps.forEach((step, i) => {
    if (i === 0) step.classList.add("is-active");
    step.addEventListener("click", () => {
      const wasActive = step.classList.contains("is-active");
      steps.forEach((s) => s.classList.remove("is-active"));
      if (!wasActive) step.classList.add("is-active");
    });
  });
}
