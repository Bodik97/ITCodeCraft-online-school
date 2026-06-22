import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]): string {
    return twMerge(clsx(inputs));
}

export function uid(): string {
    return 'xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
        const r = (Math.random() * 16) | 0;
        const v = c === 'x' ? r : (r & 0x3) | 0x8;
        return v.toString(16);
    });
}

export function getNameRegex(locale: string | null): RegExp {
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
export function getEmailRegex(): RegExp {
    return /^(?=^.{3,63}$)(^[A-Za-z0-9_+]+(([_.+-](?=[A-Za-z0-9_+]))[a-zA-Z0-9_+]+([-+.](?=[A-Za-z0-9_+]))*?)*@(\w+([.-](?=(\w|\d))))+[a-zA-Z]{2,6})$/;
}

export async function pushGtmEvent(
    eventName: string,
    eventData?: Record<string, unknown>
): Promise<'success' | 'timeout' | 'no dataLayer'> {
    return new Promise(resolve => {
        if (typeof window !== 'undefined' && window.dataLayer) {
            window.dataLayer.push({
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
            resolve('no dataLayer');
        }
    });
}
