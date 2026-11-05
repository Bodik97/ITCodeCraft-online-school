// Спільний запуск Chromium для скілів ui-ux-audit і page-functional-test.
// Кожен запуск — власний ізольований браузер (не конфліктує з Playwright MCP чи іншими агентами).
//
// Пошук бібліотеки playwright: $PW_PATH → локальний node_modules → кеш npx (~/.npm/_npx/*/node_modules/playwright).
// Пошук Chromium: $PW_CHROME → кеш ms-playwright (будь-яка chromium-*) → вбудований у playwright.
import { createRequire } from "node:module";
import { existsSync, readdirSync } from "node:fs";
import { homedir } from "node:os";
import { join } from "node:path";

const require = createRequire(import.meta.url);

function resolvePlaywright() {
  const candidates = [];
  if (process.env.PW_PATH) candidates.push(process.env.PW_PATH);
  candidates.push(join(process.cwd(), "node_modules", "playwright"));
  const npx = join(homedir(), ".npm", "_npx");
  if (existsSync(npx)) {
    for (const d of readdirSync(npx)) candidates.push(join(npx, d, "node_modules", "playwright"));
  }
  for (const c of candidates) {
    if (existsSync(join(c, "package.json"))) return require(c);
  }
  throw new Error(
    "Не знайдено пакет playwright. Встановіть: npm i -D playwright (або задайте PW_PATH=/шлях/до/node_modules/playwright).",
  );
}

function resolveChrome() {
  if (process.env.PW_CHROME) return process.env.PW_CHROME;
  const cache = join(homedir(), "Library", "Caches", "ms-playwright");
  const linuxCache = join(homedir(), ".cache", "ms-playwright");
  for (const root of [cache, linuxCache]) {
    if (!existsSync(root)) continue;
    const dirs = readdirSync(root).filter((d) => /^chromium-\d+$/.test(d)).sort().reverse();
    for (const d of dirs) {
      const mac = join(root, d, "chrome-mac-arm64", "Google Chrome for Testing.app", "Contents", "MacOS", "Google Chrome for Testing");
      const macX = join(root, d, "chrome-mac", "Google Chrome for Testing.app", "Contents", "MacOS", "Google Chrome for Testing");
      const linux = join(root, d, "chrome-linux", "chrome");
      for (const p of [mac, macX, linux]) if (existsSync(p)) return p;
    }
  }
  return undefined; // хай playwright спробує свій
}

export async function launch() {
  const { chromium } = resolvePlaywright();
  return chromium.launch({ executablePath: resolveChrome() });
}

/** Готує сторінку до огляду: ховає тост-сповіщення, підвантажує lazy-картинки, показує reveal-блоки. */
export async function settle(page) {
  await page.waitForTimeout(800);
  await page.evaluate(async () => {
    document.getElementById("signup-notification")?.remove();
    document.querySelector("astro-dev-toolbar")?.remove(); // dev-тулбар Astro перехоплює кліки
    const h = document.documentElement.scrollHeight;
    for (let y = 0; y < h; y += Math.max(300, innerHeight * 0.7)) {
      window.scrollTo(0, y);
      await new Promise((r) => setTimeout(r, 90));
    }
    document.querySelectorAll(".is-pending").forEach((e) => e.classList.remove("is-pending"));
    window.scrollTo(0, 0);
    await Promise.all(
      [...document.images].filter((i) => !i.complete).map((i) => new Promise((r) => { i.onload = i.onerror = r; setTimeout(r, 3000); })),
    );
  });
  await page.waitForTimeout(400);
}

export function parseArgs(argv) {
  const out = {};
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (a.startsWith("--")) {
      const [k, v] = a.slice(2).split("=");
      out[k] = v ?? (argv[i + 1] && !argv[i + 1].startsWith("--") ? argv[++i] : true);
    }
  }
  return out;
}
