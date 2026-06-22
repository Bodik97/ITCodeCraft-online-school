/**
 * Reports a form-submission error to a Telegram bot.
 *
 * NOTE: the bot token below is bundled into the client. This is a known
 * limitation — anything needed at runtime in the browser is public. To keep
 * the token secret it must be moved behind a server endpoint (e.g. an Astro
 * API route) that proxies the Telegram call.
 *
 * @param error - The caught error (any thrown value).
 * @param context - Optional metadata: the form id and the submitted fields.
 */

const token = "8726418474:AAEKPI0SEAvMUH2TqMsCqA4ul_lHZLxEd9o";
const chatId = "-1003812877228";

type ReportErrorContext = {
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

export async function reportError(
    error: unknown,
    context?: ReportErrorContext,
): Promise<void> {
    const userData = {
        formId: context?.formId,
        ...context?.fields,
    };

    const errorData = {
        landingUrl: window.location.href,
        errorMessage: toMessage(error) || 'Unknown error',
        userData,
        timestamp: new Date().toLocaleString('uk-UA', {
            timeZone: 'Europe/Kiev',
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
        }),
    };
    const readableUserData = Object.values(errorData.userData).some(value => value != null)
        ? JSON.stringify(errorData.userData, null, 2)
        : 'Немає даних';
    const telegramText = [
        '⚠️ Помилка відправлення форми',
        `Повідомлення: ${errorData.errorMessage}`,
        `Сторінка: ${errorData.landingUrl}`,
        `Час: ${errorData.timestamp}`,
        '',
        'Дані користувача:',
        readableUserData,
    ].join('\n');
    const safeTelegramText =
        telegramText.length > 3900
            ? `${telegramText.slice(0, 3900)}\n...`
            : telegramText;

    try {
        await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                chat_id: chatId,
                text: safeTelegramText,
            }),
        });
    } catch (reportingError) {
        console.error('Failed to report error:', reportingError);
    }
}
