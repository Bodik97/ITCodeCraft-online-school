import { getNameRegex, getEmailRegex } from '@/lib/utils';
import { z } from 'zod';
import { isValidPhoneNumber, isPossiblePhoneNumber, type CountryCode } from 'libphonenumber-js';

export const nameValidation = z
    .string()
    .min(2, 'Мінімум 2 символи')
    .max(30, 'Максимум 30 символів')
    .trim()
    .regex(getNameRegex(null), "Ім'я невірне")
    .min(1, "Ім'я обов'язкове");

const phoneRequiredMessage = "Номер телефону обов'язковий";
const phoneInvalidMessage = 'Номер телефону невірний';

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
    .regex(getEmailRegex(), 'Email невірний!')
    .min(1, "Email обов'язковий");

export const defaultInputValidation = z
    .string()
    .min(2, 'Мінімум 2 символи')
    .max(30, 'Максимум 30 символів')
    .min(1, "Обов'язкове поле");

export const defaultInputValidationNotRequired = z.string().optional();

export const checkboxValidation = z
    .boolean()
    .refine(value => value === true, { message: "Обов'язкове поле" });

export const selectValidation = z.string().min(1, "Обов'язкове поле");
export const selectValidationNotRequired = z.string().optional();

export const radioValidation = z.string().min(1, 'Будь ласка, оберіть один із варіантів');