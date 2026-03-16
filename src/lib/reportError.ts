/**
 * Reports an error to the server and sends it to a Telegram bot.
 * @param message - The error string.
 * @param formData - The form data containing user information.
 * @param formData.name - The name of the user.
 * @param formData.email - The email of the user.
 * @param formData.phone - The phone number of the user.
 */

const token = "8726418474:AAEKPI0SEAvMUH2TqMsCqA4ul_lHZLxEd9o";
const chatId = "1009742427";
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

    try {
        await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            // body: JSON.stringify(errorData),
            body: JSON.stringify({
                chat_id: chatId,
                text: JSON.stringify(errorData),
              }),
        });
    } catch (reportingError) {
        console.error('Failed to report error:', reportingError);
    }
}