import { getNameRegex, getEmailRegex } from '@/lib/utils';
import { z } from 'zod';
import { isValidPhoneNumber, isPossiblePhoneNumber, type CountryCode } from 'libphonenumber-js';

// Порядок важливий: спершу «порожньо», потім довжина й формат — щоб людина бачила доречну підказку
export const nameValidation = z
    .string()
    .trim()
    .min(1, 'Вкажіть, як до вас звертатися')
    .min(2, "Ім'я має містити щонайменше 2 літери")
    .max(30, "Ім'я має бути не довшим за 30 символів")
    .regex(getNameRegex(null), 'Використовуйте лише літери, пробіл, апостроф або дефіс');

const phoneRequiredMessage = 'Вкажіть номер, щоб ми могли передзвонити';
const phoneInvalidMessage = 'Перевірте номер: схоже, бракує цифр або є помилка';

export const phoneValidation = (country: string) =>
    z
        .string({
            error: () => phoneRequiredMessage,
        })
        .refine(value => value !== '', { message: phoneRequiredMessage })
        .refine(
            str => {
                const isValidPhone =
                    isPossiblePhoneNumber(str || '', country.toUpperCase() as CountryCode) &&
                    isValidPhoneNumber(str || '', country.toUpperCase() as CountryCode);

                return isValidPhone;
            },
            { message: phoneInvalidMessage }
        )

export const emailValidation = z
    .string()
    .trim()
    .min(1, 'Вкажіть email')
    .regex(getEmailRegex(), 'Перевірте email — він має виглядати як name@example.com');

export const defaultInputValidation = z
    .string()
    .min(1, 'Заповніть це поле')
    .min(2, 'Щонайменше 2 символи')
    .max(30, 'Не більше 30 символів');

export const defaultInputValidationNotRequired = z.string().optional();

export const checkboxValidation = z
    .boolean()
    .refine(value => value === true, { message: 'Заповніть це поле' });

export const selectValidation = z.string().min(1, 'Заповніть це поле');
export const selectValidationNotRequired = z.string().optional();

export const radioValidation = z.string().min(1, 'Будь ласка, оберіть один із варіантів');