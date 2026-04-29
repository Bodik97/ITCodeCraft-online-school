import type { APIRoute } from "astro";

export const prerender = false;

const RATE_MS = 2000;
const rateLimit = new Map<string, number>();
let lastCleanup = Date.now();

function cleanupRateLimit(now: number) {
  if (now - lastCleanup < 60_000) return;
  lastCleanup = now;
  for (const [k, t] of rateLimit) {
    if (now - t > RATE_MS * 20) rateLimit.delete(k);
  }
}

function checkRateLimit(
  ip: string,
  event: string,
  label: string,
  now: number,
): boolean {
  cleanupRateLimit(now);
  const key = `${ip}\0${event}\0${label}`;
  const prev = rateLimit.get(key) ?? 0;
  if (now - prev < RATE_MS) return false;
  rateLimit.set(key, now);
  return true;
}

function getClientIp(request: Request): string {
  const forwarded = request.headers.get("x-forwarded-for");
  if (forwarded) return forwarded.split(",")[0]?.trim() || "unknown";
  const real = request.headers.get("x-real-ip");
  if (real) return real.trim();
  return "unknown";
}

function formatServerTime(ts: number): string {
  const d = Number.isFinite(ts) ? new Date(ts) : new Date();
  const dd = String(d.getDate()).padStart(2, "0");
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const yyyy = d.getFullYear();
  const hh = String(d.getHours()).padStart(2, "0");
  const min = String(d.getMinutes()).padStart(2, "0");
  const ss = String(d.getSeconds()).padStart(2, "0");
  return `${dd}.${mm}.${yyyy} ${hh}:${min}:${ss}`;
}

/** Escape for Telegram legacy Markdown (outside code spans). */
function escapeMdPlain(s: string): string {
  return s.replace(/([_*\[\]()~`>#+\-=|{}.!\\])/g, "\\$1");
}

function mdCode(s: string, maxLen = 3500): string {
  return "`" + String(s).replace(/`/g, "'").slice(0, maxLen) + "`";
}

function buildTelegramText(input: {
  event: string;
  label: string;
  url: string;
  userAgent: string;
  timestamp: number;
}): string {
  const ua = input.userAgent.slice(0, 80);
  const timeStr = formatServerTime(input.timestamp);
  const labelRaw = String(input.label);
  const labelChunk = labelRaw.length > 3500 ? labelRaw.slice(0, 3500) + "…" : labelRaw;
  return [
    "📊 New event on site",
    "🔹 Event: " + mdCode(input.event, 200),
    "🔹 Label: " + mdCode(labelChunk, 3500),
    "🔹 Page: " + escapeMdPlain(String(input.url).slice(0, 500)),
    "🔹 Browser: " + escapeMdPlain(ua),
    "🕐 " + escapeMdPlain(timeStr),
  ].join("\n");
}

async function sendTelegram(text: string): Promise<boolean | null> {
  const token = import.meta.env.TELEGRAM_BOT_TOKEN;
  const chatId = import.meta.env.TELEGRAM_CHAT_ID;
  if (!token || !chatId) {
    console.warn(
      "[track] Missing TELEGRAM_BOT_TOKEN or TELEGRAM_CHAT_ID — skipping Telegram",
    );
    return null;
  }
  const res = await fetch(
    `https://api.telegram.org/bot${token}/sendMessage`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        chat_id: chatId,
        text,
        parse_mode: "Markdown",
      }),
    },
  );
  if (!res.ok) {
    const errText = await res.text().catch(() => "");
    console.error("[track] Telegram API error:", res.status, errText);
    return false;
  }
  return true;
}

function jsonResponse(body: object): Response {
  return new Response(JSON.stringify(body), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
}

export const POST: APIRoute = async ({ request }) => {
  let body: {
    event?: string;
    label?: string;
    url?: string;
    userAgent?: string;
    timestamp?: number;
  } = {};

  try {
    const ctype = request.headers.get("content-type") || "";
    if (ctype.includes("application/json")) {
      body = await request.json();
    } else {
      const raw = await request.text();
      body = raw ? JSON.parse(raw) : {};
    }
  } catch (e) {
    console.error("[track] Invalid JSON body", e);
    return jsonResponse({ ok: true });
  }

  const event = String(body.event ?? "").slice(0, 120) || "unknown";
  const label = String(body.label ?? "").slice(0, 3800);
  const url = String(body.url ?? "").slice(0, 2000);
  const userAgent = String(body.userAgent ?? "");
  const timestamp =
    typeof body.timestamp === "number" && Number.isFinite(body.timestamp)
      ? body.timestamp
      : Date.now();

  const ip = getClientIp(request) || "unknown";

  if (!checkRateLimit(ip, event, label, Date.now())) {
    return jsonResponse({ ok: true });
  }

  const text = buildTelegramText({
    event,
    label,
    url,
    userAgent,
    timestamp,
  });

  try {
    const result = await sendTelegram(text);
    if (result === null) {
      return jsonResponse({ ok: true });
    }
    return jsonResponse({ ok: result });
  } catch (e) {
    console.error("[track] Telegram send failed", e);
    return jsonResponse({ ok: false });
  }
};
