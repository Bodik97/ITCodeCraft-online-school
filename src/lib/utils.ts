import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

export function uid() {
    return 'xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
        var r = (Math.random() * 16) | 0,
            v = c == 'x' ? r : (r & 0x3) | 0x8;
        return v.toString(16);
    });
}

export function getNameRegex(locale: string | null) {
    switch (locale) {
        case 'pl':
            return /^.[a-zA-ZĄąĆćĘęŁłŃńÓóŚśŹźŻż 'ʼ`-]{1,}$/i;

        case 'en':
            return /^.[a-zA-Z 'ʼ`-]{1,}$/gm;

        case 'ro':
            return /^.[a-zA-ZĂăÂâÎîȘșȚț 'ʼ`-]{1,}$/gm;

        case 'es':
            return /^.[a-zA-ZáéíÑñóúü 'ʼ`-]{1,}$/gm;

        case 'tr':
            return /^.[a-zA-ZÇçĞğÖöŞşÜü 'ʼ`-]{1,}$/gm;

        default:
            return /^.[a-zA-Zа-яА-ЯёЁЇїІіЄєҐґ 'ʼ`-]{1,}$/gm;
    }
}

/**
 * It returns the Email regular expression
 */
export function getEmailRegex() {
    return /^(?=^.{3,63}$)(^[A-Za-z0-9_+]+(([_.+-](?=[A-Za-z0-9_+]))[a-zA-Z0-9_+]+([-+.](?=[A-Za-z0-9_+]))*?)*@(\w+([.-](?=(\w|\d))))+[a-zA-Z]{2,6})$/;
}

/**
 * Formats the value of the _qa cookie.
 * The _qa cookie value is expected to be a string with multiple parts separated by dots.
 * This function extracts and returns the third and fourth parts of the cookie value.
 *
 * @param value - The value of the _qa cookie.
 * @returns The formatted string containing the third and fourth parts of the cookie value, or null if the value is undefined.
 */
export function getGoogleIdFromGACookie(value: any | undefined) {
    if (!value) {
        return null;
    }
    const tmp = value.split('.');
    return tmp[2] + '.' + tmp[3];
}

// export function initializeLeeloo(leelooHash: string) {
//     window.LEELOO = function () {
//         window.LEELOO_INIT = { id: '5d0cb9cdaad9f4000e4b8e07' };
//         var js = document.createElement('script');
//         js.src = 'https://app.leeloo.ai/init.js';
//         js.async = true;
//         document.getElementsByTagName('head')[0].appendChild(js);
//     };
//     window.LEELOO();
//     window.LEELOO_LEADGENTOOLS = (window.LEELOO_LEADGENTOOLS || []).concat(leelooHash);
// }

export async function pushGtmEvent(
    eventName: string,
    eventData?: Record<string, any>
): Promise<'success' | 'timeout' | 'no dataLayer'> {
    return new Promise(resolve => {
        // Check if window and dataLayer are available
        if (typeof window !== 'undefined' && (window as any).dataLayer) {
            (window as any).dataLayer.push({
                event: eventName,
                ...eventData,
                eventCallback: () => {
                    resolve('success');
                },
                eventTimeout: 2000,
            });

            // Fallback timeout in case eventCallback is not called
            // This ensures the Promise always resolves even if GTM fails
            setTimeout(() => {
                resolve('timeout');
            }, 2500);
        } else {
            // No dataLayer available (GTM not initialized)
            resolve('no dataLayer');
        }
    });
}