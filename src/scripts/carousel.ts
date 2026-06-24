// Shared scroll-snap carousel: arrow buttons + mouse drag-to-scroll.
// Touch keeps native swipe. Used by every `[data-scroller]` on the page
// (Courses, Reviews, …) so the wiring lives in one place.

function initCarousel(scroller: HTMLElement): void {
  if (scroller.dataset.carouselReady === "true") return;
  scroller.dataset.carouselReady = "true";

  const wrap = scroller.parentElement;

  const step = (): number => {
    const card = scroller.querySelector<HTMLElement>(":scope > *");
    return card ? card.offsetWidth + 24 : scroller.clientWidth * 0.8;
  };

  wrap
    ?.querySelector("[data-scroll-next]")
    ?.addEventListener("click", () =>
      scroller.scrollBy({ left: step(), behavior: "smooth" }),
    );
  wrap
    ?.querySelector("[data-scroll-prev]")
    ?.addEventListener("click", () =>
      scroller.scrollBy({ left: -step(), behavior: "smooth" }),
    );

  // Mouse drag-to-scroll (touch devices keep the native swipe).
  let down = false;
  let startX = 0;
  let startLeft = 0;
  let moved = false;

  scroller.addEventListener("pointerdown", (e) => {
    if (e.pointerType !== "mouse") return;
    down = true;
    moved = false;
    startX = e.clientX;
    startLeft = scroller.scrollLeft;
    scroller.classList.add("is-grabbing");
  });
  scroller.addEventListener("pointermove", (e) => {
    if (!down) return;
    const dx = e.clientX - startX;
    if (Math.abs(dx) > 4) moved = true;
    scroller.scrollLeft = startLeft - dx;
  });
  const endDrag = () => {
    down = false;
    scroller.classList.remove("is-grabbing");
  };
  scroller.addEventListener("pointerup", endDrag);
  scroller.addEventListener("pointerleave", endDrag);
  // Swallow the click that ends a drag so cards aren't accidentally activated.
  scroller.addEventListener(
    "click",
    (e) => {
      if (moved) {
        e.preventDefault();
        e.stopPropagation();
      }
    },
    true,
  );
}

export function initCarousels(): void {
  document
    .querySelectorAll<HTMLElement>("[data-scroller]")
    .forEach(initCarousel);
}
