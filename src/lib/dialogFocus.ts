/**
 * Керування фокусом для модальних вікон (модалка запису, успіх/помилка, відео).
 * - при відкритті переносить фокус усередину вікна;
 * - Tab / Shift+Tab циклічно ходять лише по елементах вікна (фокус не тікає на сторінку під оверлеєм);
 * - при закритті повертає фокус на елемент, що відкрив вікно.
 */
const FOCUSABLE =
  'a[href], button:not([disabled]), input:not([disabled]):not([type="hidden"]), select:not([disabled]), textarea:not([disabled]), iframe, [tabindex]:not([tabindex="-1"])';

function focusables(container: HTMLElement): HTMLElement[] {
  return Array.from(container.querySelectorAll<HTMLElement>(FOCUSABLE)).filter((el) => {
    if (el.closest("[inert], [aria-hidden='true'][data-focus-guard]") || el.hasAttribute("data-focus-guard")) return false;
    if (el.tabIndex < 0 && el.tagName !== "IFRAME") return false;
    const r = el.getBoundingClientRect();
    // приховані поля-пастки для ботів винесені за межі екрана — їх пропускаємо
    if (r.right <= 0 || r.bottom <= 0 || r.width <= 1 || r.height <= 1) return false;
    return getComputedStyle(el).visibility !== "hidden";
  });
}

export type FocusTrap = { release: (restore?: boolean) => void };

// Стек відкритих вікон: Tab обробляє лише верхнє (напр. вікно помилки поверх модалки запису)
const stack: HTMLElement[] = [];

export function trapFocus(container: HTMLElement, initial?: HTMLElement | null): FocusTrap {
  const opener = document.activeElement instanceof HTMLElement ? document.activeElement : null;

  stack.push(container);

  // «Вартові» на краях вікна: якщо фокус виходить за межі (напр. з крос-доменного iframe YouTube,
  // де Tab не перехопити), він повертається всередину
  const makeGuard = (edge: "start" | "end") => {
    const g = document.createElement("span");
    g.tabIndex = 0;
    g.setAttribute("data-focus-guard", edge);
    g.setAttribute("aria-hidden", "true");
    g.style.cssText = "position:fixed;width:1px;height:1px;overflow:hidden;opacity:0;pointer-events:none;";
    g.addEventListener("focus", () => {
      const items = focusables(container);
      (edge === "start" ? items[items.length - 1] : items[0])?.focus({ preventScroll: true });
    });
    return g;
  };
  const guardStart = makeGuard("start");
  const guardEnd = makeGuard("end");
  container.prepend(guardStart);
  container.append(guardEnd);
  const onKeydown = (event: KeyboardEvent) => {
    if (event.key !== "Tab" || stack[stack.length - 1] !== container) return;
    const items = focusables(container);
    if (!items.length) {
      event.preventDefault();
      return;
    }
    const first = items[0];
    const last = items[items.length - 1];
    const active = document.activeElement;
    const outside = !active || !container.contains(active);
    if (event.shiftKey && (active === first || outside)) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && (active === last || outside)) {
      event.preventDefault();
      first.focus();
    }
  };
  document.addEventListener("keydown", onKeydown, true);

  // Фокус усередину після того, як вікно стало видимим
  requestAnimationFrame(() => {
    const target = initial ?? focusables(container)[0];
    target?.focus({ preventScroll: true });
  });

  return {
    release(restore = true) {
      document.removeEventListener("keydown", onKeydown, true);
      guardStart.remove();
      guardEnd.remove();
      const i = stack.lastIndexOf(container);
      if (i !== -1) stack.splice(i, 1);
      if (restore && opener && document.contains(opener)) opener.focus({ preventScroll: true });
    },
  };
}
