/**
 * Animate counters when they enter the viewport.
 * `countAttr` is the data attribute name without `data-` (e.g. `fe-count`).
 */
export function initCounters(
  counterSelector: string,
  countAttr: string,
): void {
  const prefersReduced = window.matchMedia(
    "(prefers-reduced-motion: reduce)",
  ).matches;
  if (prefersReduced) return;

  const counters = document.querySelectorAll<HTMLElement>(counterSelector);

  const runCounter = (el: HTMLElement) => {
    const raw = el.getAttribute(`data-${countAttr}`) || "";
    const suffix = raw.replace(/[\d.]/g, "");
    const target = parseFloat(raw);
    if (isNaN(target)) return;
    const isFloat = raw.includes(".");
    const decimals = isFloat ? 1 : 0;
    const duration = 1500;
    const start = performance.now();
    const ease = (t: number) => 1 - Math.pow(1 - t, 3);
    const tick = (now: number) => {
      const p = Math.min((now - start) / duration, 1);
      const val = target * ease(p);
      el.textContent =
        (isFloat ? val.toFixed(decimals) : Math.floor(val).toString()) +
        suffix;
      if (p < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  };

  const cio = new IntersectionObserver(
    (entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) {
          runCounter(e.target as HTMLElement);
          cio.unobserve(e.target);
        }
      });
    },
    { threshold: 0.4 },
  );
  counters.forEach((el) => cio.observe(el));
}
