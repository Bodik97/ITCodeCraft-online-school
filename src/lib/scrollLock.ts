let lockCount = 0;
let scrollY = 0;

export function lockBodyScroll(): void {
  if (typeof document === "undefined") return;
  if (lockCount === 0) {
    scrollY = window.scrollY;
    document.documentElement.classList.add("scroll-locked");
    document.body.classList.add("scroll-locked");
    document.body.style.top = `-${scrollY}px`;
  }
  lockCount += 1;
}

export function unlockBodyScroll(): void {
  if (typeof document === "undefined" || lockCount === 0) return;
  lockCount -= 1;
  if (lockCount > 0) return;

  document.documentElement.classList.remove("scroll-locked");
  document.body.classList.remove("scroll-locked");
  document.body.style.top = "";
  window.scrollTo(0, scrollY);
}
