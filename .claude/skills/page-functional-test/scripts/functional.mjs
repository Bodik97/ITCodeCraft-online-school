#!/usr/bin/env node
// Функціональні тести головної ITCodeCraft (і подібних лендингів).
// node .claude/skills/page-functional-test/scripts/functional.mjs --url http://localhost:4321/ --out /tmp/func
// ВАЖЛИВО: усі POST-запити поза localhost блокуються — справжні заявки в CRM не відправляються.
import { mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { launch, settle, parseArgs } from "../../_shared/browser.mjs";

const args = parseArgs(process.argv.slice(2));
const url = args.url || "http://localhost:4321/";
const out = args.out || join(process.cwd(), ".func-test");
mkdirSync(out, { recursive: true });

const results = [];
const record = (viewport, name, ok, details = "") => {
  results.push({ viewport, name, ok, details });
  process.stdout.write(`${ok ? "✓" : "✗"} [${viewport}] ${name}${details ? ` — ${details}` : ""}\n`);
};

async function withPage(browser, vp, fn) {
  const ctx = await browser.newContext({ viewport: vp });
  const page = await ctx.newPage();
  page.setDefaultTimeout(8000);
  const consoleErrors = [];
  const blocked = [];
  page.on("console", (m) => m.type() === "error" && consoleErrors.push(m.text().slice(0, 200)));
  page.on("pageerror", (e) => consoleErrors.push("pageerror: " + e.message.slice(0, 200)));
  // Захист від справжніх заявок: блокуємо POST/PUT за межами localhost
  await page.route("**/*", (route) => {
    const req = route.request();
    const u = new URL(req.url());
    const local = ["localhost", "127.0.0.1"].includes(u.hostname);
    if (!local && ["POST", "PUT", "PATCH"].includes(req.method())) {
      blocked.push(`${req.method()} ${req.url().slice(0, 120)}`);
      return route.fulfill({ status: 200, contentType: "application/json", body: '{"ok":true,"blockedByTest":true}' });
    }
    return route.continue();
  });
  await page.goto(url, { waitUntil: "networkidle", timeout: 45000 });
  await settle(page);
  try {
    await fn(page, { consoleErrors, blocked });
  } catch (e) {
    // не обриваємо прогін — фіксуємо крок, на якому впало
    record(String(vp.width), "Сценарій перервано помилкою", false, e.message.split("\n")[0].slice(0, 200));
  } finally {
    await ctx.close();
  }
}

const isModalOpen = (page) =>
  page.evaluate(() => {
    const m = document.querySelector("[data-modal-root]");
    return !!m && !m.classList.contains("opacity-0") && m.getAttribute("aria-hidden") !== "true";
  });

const browser = await launch();
try {
  // ── Десктоп ─────────────────────────────────────────────
  const D = "1440";
  await withPage(browser, { width: 1440, height: 900 }, async (page, ctx) => {
    // Якорі навігації ведуть на існуючі секції
    const anchors = await page.evaluate(() =>
      [...document.querySelectorAll('a[href^="#"]')].map((a) => a.getAttribute("href")).filter((h) => h.length > 1),
    );
    const missing = await page.evaluate((list) => [...new Set(list)].filter((h) => !document.querySelector(h)), anchors);
    record(D, "Якорі навігації ведуть на існуючі секції", missing.length === 0, missing.join(", "));

    // Шапка липка й отримує is-scrolled
    await page.evaluate(() => window.scrollTo(0, 800));
    await page.waitForTimeout(300);
    const sticky = await page.evaluate(() => {
      const h = document.getElementById("site-header");
      return h ? { top: Math.round(h.getBoundingClientRect().top), scrolled: h.classList.contains("is-scrolled") } : null;
    });
    record(D, "Шапка лишається видимою при прокрутці", !!sticky && sticky.top >= -2 && sticky.top < 40, JSON.stringify(sticky));
    await page.evaluate(() => window.scrollTo(0, 0));

    // Модалка запису: відкриття, фокус, Escape
    const opener = page.locator("[data-modal-open]:visible").first();
    await opener.click();
    await page.waitForTimeout(450);
    record(D, "CTA відкриває модалку запису", await isModalOpen(page));
    await page.keyboard.press("Escape");
    await page.waitForTimeout(450);
    record(D, "Escape закриває модалку", !(await isModalOpen(page)));

    // Модалка з назвою курсу
    const courseBtn = page.locator("#courses [data-product-name]").first();
    if (await courseBtn.count()) {
      const name = await courseBtn.getAttribute("data-product-name");
      await courseBtn.scrollIntoViewIfNeeded();
      await courseBtn.click();
      await page.waitForTimeout(450);
      const title = await page.locator("[data-modal-title]").innerText();
      record(D, "Кнопка курсу підставляє назву в модалку", title.includes(name), `title="${title.trim()}"`);
      await page.locator("[data-modal-close]").click();
      await page.waitForTimeout(450);
      record(D, "Кнопка × закриває модалку", !(await isModalOpen(page)));
    }

    // Валідація форми запису (порожня відправка)
    const form = page.locator("#register form").first();
    if (await form.count()) {
      await form.scrollIntoViewIfNeeded();
      await form.locator('button[type="submit"], .form-btn').first().click();
      await page.waitForTimeout(500);
      const errors = await form.locator(".input-error-message").count();
      record(D, "Порожня форма показує помилки валідації", errors > 0, `помилок: ${errors}`);
      // Невалідний email
      const email = form.locator('input[name="email"]');
      if (await email.count()) {
        await form.locator('input[name="name"]').fill("Тест");
        await email.fill("not-an-email");
        await form.locator('button[type="submit"], .form-btn').first().click();
        await page.waitForTimeout(400);
        const emailErr = await form.locator(".input-error-message").allInnerTexts();
        record(D, "Невалідний email відхиляється", emailErr.length > 0, emailErr.join(" | ").slice(0, 120));
      }
    } else record(D, "Форма запису присутня в #register", false);

    // Каруселі: стрілки прокручують трек
    for (const id of ["courses", "reviews"]) {
      const sec = page.locator(`#${id}`);
      if (!(await sec.count())) continue;
      await sec.scrollIntoViewIfNeeded();
      const before = await sec.locator("[data-scroller]").evaluate((s) => s.scrollLeft);
      const next = sec.locator("[data-scroll-next]");
      if (await next.isVisible()) {
        await next.click();
        await page.waitForTimeout(700);
        const after = await sec.locator("[data-scroller]").evaluate((s) => s.scrollLeft);
        record(D, `Карусель #${id}: стрілка «далі» прокручує`, after > before, `${before} → ${after}`);
        const prevDisabled = await sec.locator("[data-scroll-prev]").isDisabled();
        record(D, `Карусель #${id}: «назад» активна після прокрутки`, !prevDisabled);
      }
      const dots = await sec.locator("[data-scroll-pagination] button").count();
      record(D, `Карусель #${id}: пагінація згенерована`, dots > 0, `${dots} крапок`);
    }

    // FAQ
    const faq = page.locator("#faq details").nth(1);
    if (await faq.count()) {
      await faq.scrollIntoViewIfNeeded();
      await faq.locator("summary").click();
      await page.waitForTimeout(200);
      record(D, "FAQ розгортається по кліку", await faq.evaluate((d) => d.open));
    }

    // Відеомодалка робіт
    const card = page.locator("#works [data-work-card][data-youtube-id]:not([data-youtube-id=''])").first();
    if (await card.count()) {
      await card.scrollIntoViewIfNeeded();
      await card.click();
      await page.waitForTimeout(400);
      const st = await page.evaluate(() => ({
        hidden: document.getElementById("work-video-modal")?.getAttribute("aria-hidden"),
        src: document.getElementById("work-video-iframe")?.getAttribute("src") || "",
      }));
      record(D, "Картка роботи відкриває YouTube-модалку", st.hidden === "false" && st.src.includes("youtube.com/embed/"), st.src.slice(0, 60));
      await page.keyboard.press("Escape");
      await page.waitForTimeout(300);
      const closed = await page.evaluate(() => ({
        hidden: document.getElementById("work-video-modal")?.getAttribute("aria-hidden"),
        src: document.getElementById("work-video-iframe")?.getAttribute("src") || "",
      }));
      record(D, "Escape закриває відео й зупиняє його", closed.hidden === "true" && !closed.src);
    }

    // Рядок напрямків змінюється
    const t1 = await page.locator(".hero-typing-item.is-active").innerText().catch(() => "");
    await page.waitForTimeout(3200);
    const t2 = await page.locator(".hero-typing-item.is-active").innerText().catch(() => "");
    record(D, "Рядок напрямків у hero змінюється", !!t1 && t1 !== t2, `«${t1.slice(0, 30)}» → «${t2.slice(0, 30)}»`);

    // Лічильники доходять до цільового значення
    const counters = await page.evaluate(() => [...document.querySelectorAll("[data-counter]")].map((e) => [e.getAttribute("data-counter"), e.textContent.trim()]));
    const bad = counters.filter(([t, v]) => t !== v);
    record(D, "Лічильники показують фінальні значення", bad.length === 0, bad.map((b) => b.join("→")).join(", "));

    // JSON-LD валідний
    const ld = await page.evaluate(() =>
      [...document.querySelectorAll('script[type="application/ld+json"]')].map((s) => {
        try {
          return JSON.parse(s.textContent)["@type"];
        } catch {
          return "INVALID";
        }
      }),
    );
    record(D, "JSON-LD розмітка парситься", !ld.includes("INVALID") && ld.length > 0, ld.join(", "));

    // Внутрішні посилання відповідають 200
    const links = await page.evaluate(() =>
      [...new Set([...document.querySelectorAll("a[href]")].map((a) => a.href).filter((h) => h.startsWith(location.origin) && !h.includes("#")))],
    );
    const broken = [];
    for (const l of links) {
      const r = await page.request.get(l).catch(() => null);
      if (!r || r.status() >= 400) broken.push(`${r?.status() ?? "ERR"} ${l}`);
    }
    record(D, "Внутрішні посилання відповідають 200", broken.length === 0, broken.join(", ") || `${links.length} перевірено`);

    // Зовнішні посилання відкриваються безпечно
    const unsafe = await page.evaluate(() =>
      [...document.querySelectorAll('a[target="_blank"]')].filter((a) => !/noopener/.test(a.rel)).map((a) => a.href),
    );
    record(D, 'target="_blank" має rel="noopener"', unsafe.length === 0, unsafe.join(", "));

    // Клавіатура: Tab доходить до CTA, фокус видимий
    await page.evaluate(() => window.scrollTo(0, 0));
    await page.keyboard.press("Tab");
    const focusOk = await page.evaluate(() => {
      const el = document.activeElement;
      if (!el || el === document.body) return false;
      const cs = getComputedStyle(el);
      return cs.outlineStyle !== "none" || cs.boxShadow !== "none";
    });
    record(D, "Перший Tab дає видимий фокус", focusOk);

    record(D, "Немає помилок у консолі", ctx.consoleErrors.length === 0, ctx.consoleErrors.join(" | ").slice(0, 300));
    if (ctx.blocked.length) record(D, "Заблоковані зовнішні POST (очікувано)", true, ctx.blocked.join(", "));
  });

  // ── Мобільний ───────────────────────────────────────────
  const M = "390";
  await withPage(browser, { width: 390, height: 844 }, async (page, ctx) => {
    const toggle = page.locator("#mobile-menu-toggle");
    record(M, "Кнопка мобільного меню видима", await toggle.isVisible());
    await toggle.click();
    await page.waitForTimeout(400);
    const opened = await page.evaluate(() => ({
      open: document.getElementById("mobile-menu")?.classList.contains("is-open"),
      expanded: document.getElementById("mobile-menu-toggle")?.getAttribute("aria-expanded"),
    }));
    record(M, "Меню відкривається, aria-expanded=true", opened.open && opened.expanded === "true", JSON.stringify(opened));
    const firstLink = page.locator("#mobile-menu a").first();
    await firstLink.click();
    await page.waitForTimeout(500);
    const closed = await page.evaluate(() => !document.getElementById("mobile-menu")?.classList.contains("is-open"));
    record(M, "Клік по пункту меню закриває меню", closed);

    const sticky = page.locator("[data-modal-open]").filter({ hasText: /урок/i }).last();
    const stickyVisible = await page.evaluate(() => {
      const els = [...document.querySelectorAll("[data-modal-open]")].filter((e) => {
        const r = e.getBoundingClientRect();
        return r.bottom > innerHeight - 120 && r.top < innerHeight && getComputedStyle(e.closest("div")).position !== "static";
      });
      return els.length > 0;
    });
    record(M, "Липка CTA-кнопка видима внизу екрана", stickyVisible);
    await sticky.click();
    await page.waitForTimeout(450);
    record(M, "Липка CTA відкриває модалку", await isModalOpen(page));
    await page.keyboard.press("Escape");
    await page.waitForTimeout(400);

    // Липка кнопка не перекриває футер
    await page.evaluate(() => window.scrollTo(0, document.documentElement.scrollHeight));
    await page.waitForTimeout(500);
    const overlap = await page.evaluate(() => {
      const f = document.querySelector("footer");
      // останній текстовий рядок футера (копірайт / юридичні посилання), а не перший абзац
      const last = f ? [...f.querySelectorAll("p, a")].filter((e) => e.getBoundingClientRect().height > 0).pop() : null;
      if (!last) return false;
      const r = last.getBoundingClientRect();
      const hit = document.elementFromPoint(r.left + 4, r.top + r.height / 2);
      return hit && !f.contains(hit);
    });
    record(M, "Кінець футера не перекритий липкими елементами", !overlap);

    const docOverflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
    record(M, "Немає горизонтальної прокрутки", docOverflow <= 0, `+${docOverflow}px`);
    record(M, "Немає помилок у консолі", ctx.consoleErrors.length === 0, ctx.consoleErrors.join(" | ").slice(0, 300));
  });
} finally {
  await browser.close();
}

writeFileSync(join(out, "functional.json"), JSON.stringify({ url, generatedAt: new Date().toISOString(), results }, null, 2));
const failed = results.filter((r) => !r.ok);
console.log(`\n${results.length - failed.length}/${results.length} пройдено. Звіт: ${join(out, "functional.json")}`);
process.exit(failed.length ? 1 : 0);
