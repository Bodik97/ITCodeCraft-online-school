/**
 * Приклад Google Apps Script: приймає POST (тіло JSON як text/plain, як з tracker.js),
 * шле повідомлення в Telegram. Токен і chat_id — у Project Settings → Script properties.
 *
 * Deploy → New deployment → Web app: Execute as Me, Who has access: Anyone
 * Скопіюй URL у PUBLIC_ITCC_TRACK_ENDPOINT у .env
 */

var RATE_MS = 2000;

function doPost(e) {
  var body = {};
  try {
    body = JSON.parse(e.postData && e.postData.contents ? e.postData.contents : "{}");
  } catch (err) {
    return jsonOut({ ok: true });
  }

  var event = String(body.event || "unknown").slice(0, 120);
  var label = String(body.label || "").slice(0, 3800);
  var url = String(body.url || "");
  var userAgent = String(body.userAgent || "");
  var ts = typeof body.timestamp === "number" ? body.timestamp : Date.now();

  var props = PropertiesService.getScriptProperties();
  var botToken = props.getProperty("TELEGRAM_BOT_TOKEN");
  var chatId = props.getProperty("TELEGRAM_CHAT_ID");
  if (!botToken || !chatId) {
    return jsonOut({ ok: true });
  }

  // У GAS немає надійного IP у doPost; обмежуємо дублікати однакових event+label за 2 с (глобально).
  var rateKey = event + "\0" + label.slice(0, 512);
  var cache = CacheService.getScriptCache();
  var now = Date.now();
  var prev = cache.get(rateKey);
  if (prev && now - parseInt(prev, 10) < RATE_MS) {
    return jsonOut({ ok: true });
  }
  cache.put(rateKey, String(now), 60);

  var text = buildMessage_(event, label, url, userAgent, ts);
  try {
    UrlFetchApp.fetch(
      "https://api.telegram.org/bot" + botToken + "/sendMessage",
      {
        method: "post",
        contentType: "application/json",
        muteHttpExceptions: true,
        payload: JSON.stringify({
          chat_id: chatId,
          text: text,
          parse_mode: "Markdown",
        }),
      },
    );
  } catch (err2) {}

  return jsonOut({ ok: true });
}

function jsonOut(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(
    ContentService.MimeType.JSON,
  );
}

function formatTime_(ts) {
  var d = new Date(ts);
  var pad = function (n) {
    return (n < 10 ? "0" : "") + n;
  };
  return (
    pad(d.getDate()) +
    "." +
    pad(d.getMonth() + 1) +
    "." +
    d.getFullYear() +
    " " +
    pad(d.getHours()) +
    ":" +
    pad(d.getMinutes()) +
    ":" +
    pad(d.getSeconds())
  );
}

function esc_(s) {
  return String(s).replace(/([_*\[\]()~`>#+\-=|{}.!\\])/g, "\\$1");
}

function mdCode_(s, max) {
  max = max || 3500;
  return "`" + String(s).replace(/`/g, "'").slice(0, max) + "`";
}

function buildMessage_(event, label, pageUrl, ua, timestamp) {
  var ua80 = ua.slice(0, 80);
  var labelChunk =
    label.length > 3500 ? label.slice(0, 3500) + "…" : label;
  return [
    "📊 New event on site",
    "🔹 Event: " + mdCode_(event, 200),
    "🔹 Label: " + mdCode_(labelChunk, 3500),
    "🔹 Page: " + esc_(pageUrl.slice(0, 500)),
    "🔹 Browser: " + esc_(ua80),
    "🕐 " + esc_(formatTime_(timestamp)),
  ].join("\n");
}
