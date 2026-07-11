// Shared scroll-snap carousel: arrow buttons + mouse drag-to-scroll.
// Touch keeps native swipe. Used by every `[data-scroller]` on the page
// (Courses, Reviews, …) so the wiring lives in one place.

function initCarousel(scroller: HTMLElement): void {
  if (scroller.dataset.carouselReady === "true") return;
  scroller.dataset.carouselReady = "true";

  // Find the closest section/container to look for controls
  const wrap = scroller.closest('section') || scroller.parentElement;

  const step = (): number => {
    const card = scroller.querySelector<HTMLElement>(":scope > *");
    if (!card) return scroller.clientWidth * 0.8;
    const gap = Number.parseFloat(getComputedStyle(scroller).columnGap) || 0;
    return card.offsetWidth + gap;
  };

  const pagination = wrap?.querySelector("[data-scroll-pagination]");
  let bullets: HTMLElement[] = [];

  if (pagination) {
    const cards = scroller.querySelectorAll(":scope > *");
    
    // Read border colors from cards to match bullet colors
    const getCardColorClass = (card: Element) => {
      if (card.classList.contains('border-neon-lime')) return 'color-lime';
      if (card.classList.contains('border-neon-magenta')) return 'color-magenta';
      if (card.classList.contains('border-neon-cyan')) return 'color-cyan';
      return 'color-cyan'; // fallback
    };

    // Create bullet for each card
    cards.forEach((card, i) => {
      const btn = document.createElement("button");
      btn.type = "button";
      btn.className = `scroll-bullet ${getCardColorClass(card)}`;
      btn.setAttribute("aria-label", `Go to slide ${i + 1}`);
      btn.addEventListener("click", () => {
        scroller.scrollTo({
          left: (cards[i] as HTMLElement).offsetLeft - scroller.offsetLeft,
          behavior: "smooth",
        });
      });
      pagination.appendChild(btn);
      bullets.push(btn);
    });

    const updateBullets = () => {
      if (!bullets.length) return;
      const scrollerCenter = scroller.scrollLeft + scroller.clientWidth / 2;
      let activeIndex = 0;
      let minDistance = Infinity;

      cards.forEach((card, i) => {
        const cardCenter = (card as HTMLElement).offsetLeft - scroller.offsetLeft + card.clientWidth / 2;
        const distance = Math.abs(cardCenter - scrollerCenter);
        if (distance < minDistance) {
          minDistance = distance;
          activeIndex = i;
        }
      });

      bullets.forEach((btn, i) => {
        btn.classList.toggle("is-active", i === activeIndex);
      });
    };

    scroller.addEventListener("scroll", updateBullets, { passive: true });
    window.addEventListener("resize", updateBullets, { passive: true });
    updateBullets();
  }

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
