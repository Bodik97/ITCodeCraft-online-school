/**
 * Fill skill bars when the skills section scrolls into view.
 * `levelAttr` is the data attribute name without `data-` (e.g. `fe-level`).
 */
export function initSkillBars(
  skillsWrapId: string,
  barSelector: string,
  levelAttr: string,
): void {
  const skillsWrap = document.getElementById(skillsWrapId);
  if (!skillsWrap) return;

  const prefersReduced = window.matchMedia(
    "(prefers-reduced-motion: reduce)",
  ).matches;
  const bars = skillsWrap.querySelectorAll<HTMLElement>(barSelector);
  const fill = () =>
    bars.forEach((b) => {
      b.style.width = `${b.getAttribute(`data-${levelAttr}`)}%`;
    });

  if (prefersReduced) {
    fill();
    return;
  }

  const sio = new IntersectionObserver(
    (entries) => {
      if (entries.some((e) => e.isIntersecting)) {
        fill();
        sio.disconnect();
      }
    },
    { threshold: 0.3 },
  );
  sio.observe(skillsWrap);
}
