/**
 * Reports form-submission events to a Telegram bot.
 *
 * NOTE: the bot token below is bundled into the client. This is a known
 * limitation — anything needed at runtime in the browser is public. To keep
 * the token secret it must be moved behind a server endpoint (e.g. an Astro
 * API route) that proxies the Telegram call.
 */

const token = "8529596170:AAFZJ18bCQ7ZUVh2nE8QnmBR5yTT2n2Vj5M";
const chatId = "1009742427";

type ReportContext = {
    formId?: string;
    fields?: Record<string, unknown>;
};

function toMessage(error: unknown): string {
    if (error instanceof Error) return error.message;
    if (typeof error === "string") return error;
    try {
        return JSON.stringify(error);
    } catch {
        return "Unknown error";
    }
}

function formatTimestamp(): string {
    return new Date().toLocaleString("uk-UA", {
        timeZone: "Europe/Kiev",
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
    });
}

function formatUserData(fields?: Record<string, unknown>, formId?: string): string {
    const userData = {
        formId,
        ...fields,
    };
    return Object.values(userData).some((value) => value != null)
        ? JSON.stringify(userData, null, 2)
        : "Немає даних";
}

async function sendTelegramMessage(text: string): Promise<void> {
    const safeText = text.length > 3900 ? `${text.slice(0, 3900)}\n...` : text;

    try {
        await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                chat_id: chatId,
                text: safeText,
            }),
        });
    } catch (reportingError) {
        console.error("Failed to report to Telegram:", reportingError);
    }
}

export async function reportError(
    error: unknown,
    context?: ReportContext,
): Promise<void> {
    const telegramText = [
        "⚠️ Помилка відправлення форми",
        `Повідомлення: ${toMessage(error) || "Unknown error"}`,
        `Сторінка: ${window.location.href}`,
        `Час: ${formatTimestamp()}`,
        "",
        "Дані користувача:",
        formatUserData(context?.fields, context?.formId),
    ].join("\n");

    await sendTelegramMessage(telegramText);
}

export async function reportLeadSuccess(context?: ReportContext): Promise<void> {
    const telegramText = [
        "✅ Нова заявка з форми",
        `Сторінка: ${window.location.href}`,
        `Час: ${formatTimestamp()}`,
        "",
        "Дані користувача:",
        formatUserData(context?.fields, context?.formId),
    ].join("\n");

    await sendTelegramMessage(telegramText);
}
