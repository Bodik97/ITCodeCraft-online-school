/**
 * Reports an error to the server and sends it to a Telegram bot.
 * @param message - The error string.
 * @param formData - The form data containing user information.
 * @param formData.name - The name of the user.
 * @param formData.email - The email of the user.
 * @param formData.phone - The phone number of the user.
 */

const token = "8726418474:AAEKPI0SEAvMUH2TqMsCqA4ul_lHZLxEd9o";
const chatId = "-1003812877228";
export async function reportError(
    message: string,
    formData?: { name?: string; email?: string; phone?: string;[key: string]: any } | undefined
): Promise<void> {
    const errorData = {
        landingUrl: window.location.href,
        errorMessage: message || 'Unknown error',
        userData: formData || {},
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
    const readableUserData = Object.keys(errorData.userData).length
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
            // body: JSON.stringify(errorData),
            body: JSON.stringify({
                chat_id: chatId,
                text: safeTelegramText,
              }),
        });
    } catch (reportingError) {
        console.error('Failed to report error:', reportingError);
    }
}