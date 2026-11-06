#!/usr/bin/env node
// UI/UX-аудит сторінки на багатьох розширеннях екрана.
// node .claude/skills/ui-ux-audit/scripts/audit.mjs --url http://localhost:4321/ --out /tmp/audit [--viewports mobile|tablet|desktop|all] [--full]
// Результат: <out>/report.json + скріншоти <out>/<width>x<height>-top.png (і -full.png з --full).
import { mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { launch, settle, parseArgs } from "../../_shared/browser.mjs";

const args = parseArgs(process.argv.slice(2));
const url = args.url || "http://localhost:4321/";
const out = args.out || join(process.cwd(), ".ui-audit");
const full = Boolean(args.full);

const SETS = {
  mobile: [
    [320, 640],
    [360, 780],
    [375, 667],
    [390, 844],
    [414, 896],
  ],
  tablet: [
    [768, 1024],
    [834, 1194],
    [1024, 768],
  ],
  desktop: [
    [1280, 800],
    [1440, 900],
    [1920, 1080],
  ],
};
const pick = (args.viewports || "all").split(",");
const viewports = pick.includes("all") ? [...SETS.mobile, ...SETS.tablet, ...SETS.desktop] : pick.flatMap((k) => SETS[k] || []);

mkdirSync(out, { recursive: true });

// Перевірки всередині сторінки
function inPageChecks() {
  const vw = document.documentElement.clientWidth;
  const visible = (el) => {
    const r = el.getBoundingClientRect();
    const cs = getComputedStyle(el);
    return r.width > 0 && r.height > 0 && cs.visibility !== "hidden" && cs.display !== "none" && Number(cs.opacity) > 0.05;
  };
  const label = (el) => {
    const id = el.id ? `#${el.id}` : "";
    const cls = typeof el.className === "string" ? "." + el.className.trim().split(/\s+/).slice(0, 3).join(".") : "";
    const text = (el.innerText || el.getAttribute("aria-label") || el.getAttribute("alt") || "").trim().replace(/\s+/g, " ").slice(0, 50);
    return `${el.tagName.toLowerCase()}${id}${cls}${text ? ` «${text}»` : ""}`;
  };
  const inScroller = (el) => !!el.closest("[data-scroller]");
  const isFixed = (el) => {
    for (let n = el; n && n !== document.body; n = n.parentElement) {
      const p = getComputedStyle(n).position;
      if (p === "fixed") return true;
    }
    return false;
  };

  // 1. Горизонтальне переповнення
  const overflow = [];
  for (const el of document.body.querySelectorAll("*")) {
    if (!visible(el) || inScroller(el) || isFixed(el)) continue;
    const r = el.getBoundingClientRect();
    if (r.right > vw + 1 || r.left < -1) {
      // пропускаємо елементи, обрізані батьком з overflow:hidden
      let clipped = false;
      for (let n = el.parentElement; n && n !== document.body; n = n.parentElement) {
        const cs = getComputedStyle(n);
        if (/(hidden|clip)/.test(cs.overflowX) || /(hidden|clip)/.test(cs.overflow)) {
          const pr = n.getBoundingClientRect();
          if (pr.right <= vw + 1 && pr.left >= -1) clipped = true;
          break;
        }
      }
      if (!clipped) overflow.push({ el: label(el), left: Math.round(r.left), right: Math.round(r.right) });
    }
  }
  const docOverflow = document.documentElement.scrollWidth - vw;

  // 2. Картинки
  const brokenImages = [...document.images].filter((i) => i.complete && i.naturalWidth === 0).map((i) => i.currentSrc || i.src);
  const imagesNoAlt = [...document.images].filter((i) => !i.hasAttribute("alt")).map((i) => i.src);
  const stretched = [...document.images]
    .filter((i) => visible(i) && i.naturalWidth && getComputedStyle(i).objectFit === "fill")
    .filter((i) => {
      const r = i.getBoundingClientRect();
      return Math.abs(r.width / r.height - i.naturalWidth / i.naturalHeight) > 0.08;
    })
    .map((i) => i.src);

  // 3. Малі цілі для дотику (WCAG 2.5.8: 24px мінімум, рекомендовано 44px)
  const smallTargets = [];
  for (const el of document.querySelectorAll("a[href], button, [role=button], summary, input, select, textarea")) {
    if (!visible(el) || inScroller(el)) continue;
    const r = el.getBoundingClientRect();
    if (r.width < 44 || r.height < 44) {
      // текстові посилання в рядку тексту пропускаємо, якщо висота ≥ 24
      if (el.tagName === "A" && r.height >= 24 && getComputedStyle(el).display === "inline") continue;
      if (r.width < 24 || r.height < 24) smallTargets.push({ el: label(el), w: Math.round(r.width), h: Math.round(r.height), severity: "fail" });
      else if (vw < 1024) smallTargets.push({ el: label(el), w: Math.round(r.width), h: Math.round(r.height), severity: "warn" });
    }
  }

  // 4. Доступні імена
  const unnamed = [];
  for (const el of document.querySelectorAll("a[href], button")) {
    if (!visible(el)) continue;
    const name = (el.getAttribute("aria-label") || el.innerText || el.getAttribute("title") || "").trim();
    const imgAlt = [...el.querySelectorAll("img[alt]")].some((i) => i.alt.trim());
    if (!name && !imgAlt) unnamed.push(label(el) + ` (${el.outerHTML.slice(0, 80)})`);
  }

  // 5. Контраст тексту (лише там, де фон — суцільний колір)
  const parse = (c) => {
    const m = c.match(/rgba?\(([^)]+)\)/);
    if (!m) return null;
    const p = m[1].split(/[\s,/]+/).filter(Boolean).map(Number);
    return { r: p[0], g: p[1], b: p[2], a: p[3] ?? 1 };
  };
  const lum = ({ r, g, b }) => {
    const f = (v) => ((v /= 255) <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4);
    return 0.2126 * f(r) + 0.7152 * f(g) + 0.0722 * f(b);
  };
  const bgOf = (el) => {
    for (let n = el; n; n = n.parentElement) {
      const cs = getComputedStyle(n);
      if (cs.backgroundImage && cs.backgroundImage !== "none") return null; // градієнт/картинка — не оцінюємо
      const c = parse(cs.backgroundColor);
      if (c && c.a > 0.95) return c;
    }
    return { r: 255, g: 255, b: 255, a: 1 };
  };
  const lowContrast = [];
  const seen = new Set();
  const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
  while (walker.nextNode()) {
    const t = walker.currentNode;
    if (!t.textContent.trim()) continue;
    const el = t.parentElement;
    if (!el || seen.has(el) || !visible(el)) continue;
    seen.add(el);
    const cs = getComputedStyle(el);
    if (cs.color.includes("0, 0, 0, 0") || cs.webkitTextFillColor?.includes("rgba(0, 0, 0, 0)")) continue;
    const fg = parse(cs.color);
    const bg = bgOf(el);
    if (!fg || !bg) continue;
    const L1 = lum(fg), L2 = lum(bg);
    const ratio = (Math.max(L1, L2) + 0.05) / (Math.min(L1, L2) + 0.05);
    const size = parseFloat(cs.fontSize);
    const bold = Number(cs.fontWeight) >= 700;
    const need = size >= 24 || (size >= 18.66 && bold) ? 3 : 4.5;
    if (ratio < need) lowContrast.push({ el: label(el), ratio: Math.round(ratio * 100) / 100, need, color: cs.color, size });
  }

  // 6. Заголовки
  const headings = [...document.querySelectorAll("h1,h2,h3,h4,h5,h6")].filter(visible);
  const h1Count = headings.filter((h) => h.tagName === "H1").length;
  const skips = [];
  let prev = 0;
  for (const h of headings) {
    const lvl = Number(h.tagName[1]);
    if (prev && lvl > prev + 1) skips.push(`${h.tagName} після H${prev}: «${h.innerText.trim().slice(0, 40)}»`);
    prev = lvl;
  }

  // 7. Дублікати id
  const ids = {};
  document.querySelectorAll("[id]").forEach((e) => (ids[e.id] = (ids[e.id] || 0) + 1));
  const dupIds = Object.entries(ids).filter(([, n]) => n > 1).map(([id, n]) => `${id} ×${n}`);

  // 8. Текст, що обрізається (виходить за межі свого блоку без overflow-ellipsis)
  const clippedText = [];
  for (const el of document.querySelectorAll("h1,h2,h3,p,a,button,span,dd,dt,li")) {
    if (!visible(el) || inScroller(el)) continue;
    const cs = getComputedStyle(el);
    if (cs.textOverflow === "ellipsis" || cs.webkitLineClamp !== "none") continue;
    if (el.scrollWidth > el.clientWidth + 2 && /(hidden|clip)/.test(cs.overflowX) && el.clientWidth > 0) {
      clippedText.push(label(el));
    }
  }

  // 9. Шрифти
  const fonts = [...new Set([...document.querySelectorAll("h1,h2,p,button")].map((e) => getComputedStyle(e).fontFamily.split(",")[0]))];
  const fontsLoaded = document.fonts ? [...document.fonts].filter((f) => f.status === "loaded").map((f) => f.family) : [];

  return {
    docOverflow,
    overflow: overflow.slice(0, 25),
    brokenImages,
    imagesNoAlt,
    stretched,
    smallTargets: smallTargets.slice(0, 30),
    unnamed,
    lowContrast: lowContrast.slice(0, 30),
    headings: { h1Count, skips },
    dupIds,
    clippedText: clippedText.slice(0, 20),
    fonts,
    fontsLoaded: [...new Set(fontsLoaded)],
  };
}

const browser = await launch();
const report = { url, generatedAt: new Date().toISOString(), viewports: [] };
try {
  for (const [w, h] of viewports) {
    const ctx = await browser.newContext({ viewport: { width: w, height: h }, deviceScaleFactor: 1, reducedMotion: "no-preference" });
    const page = await ctx.newPage();
    const consoleErrors = [];
    page.on("console", (m) => m.type() === "error" && consoleErrors.push(m.text().slice(0, 200)));
    page.on("pageerror", (e) => consoleErrors.push("pageerror: " + e.message.slice(0, 200)));
    const failed = [];
    page.on("requestfailed", (r) => failed.push(`${r.failure()?.errorText} ${r.url().slice(0, 120)}`));
    page.on("response", (r) => r.status() >= 400 && failed.push(`${r.status()} ${r.url().slice(0, 120)}`));

    await page.goto(url, { waitUntil: "networkidle", timeout: 45000 });
    await settle(page);
    const shotTop = join(out, `${w}x${h}-top.png`);
    await page.screenshot({ path: shotTop });
    let shotFull;
    if (full) {
      shotFull = join(out, `${w}x${h}-full.png`);
      await page.screenshot({ path: shotFull, fullPage: true });
    }
    const checks = await page.evaluate(inPageChecks);
    report.viewports.push({ width: w, height: h, screenshots: { top: shotTop, full: shotFull }, consoleErrors, failedRequests: failed, ...checks });
    await ctx.close();
    process.stdout.write(`✓ ${w}x${h}\n`);
  }
} finally {
  await browser.close();
}

writeFileSync(join(out, "report.json"), JSON.stringify(report, null, 2));

// Короткий підсумок у консоль
const sum = (k) => report.viewports.reduce((s, v) => s + (Array.isArray(v[k]) ? v[k].length : 0), 0);
console.log(`\nЗвіт: ${join(out, "report.json")}`);
for (const v of report.viewports) {
  const flags = [];
  if (v.docOverflow > 0) flags.push(`горизонтальна прокрутка +${v.docOverflow}px`);
  if (v.overflow.length) flags.push(`${v.overflow.length} елементів за межами екрана`);
  if (v.brokenImages.length) flags.push(`${v.brokenImages.length} битих картинок`);
  if (v.smallTargets.filter((t) => t.severity === "fail").length) flags.push(`${v.smallTargets.filter((t) => t.severity === "fail").length} цілей <24px`);
  if (v.lowContrast.length) flags.push(`${v.lowContrast.length} низький контраст`);
  if (v.unnamed.length) flags.push(`${v.unnamed.length} без доступного імені`);
  if (v.consoleErrors.length) flags.push(`${v.consoleErrors.length} помилок консолі`);
  if (v.failedRequests.length) flags.push(`${v.failedRequests.length} невдалих запитів`);
  console.log(`${String(v.width).padStart(4)}×${v.height}: ${flags.length ? flags.join(", ") : "OK"}`);
}
console.log(`Разом: overflow ${sum("overflow")}, низький контраст ${sum("lowContrast")}, малі цілі ${sum("smallTargets")}`);
