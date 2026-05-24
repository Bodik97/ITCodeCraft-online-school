import { z } from 'zod';
import {
    nameValidation,
    phoneValidation,
    emailValidation,
    checkboxValidation,
    selectValidation,
    radioValidation,
    defaultInputValidation,
    defaultInputValidationNotRequired,
    selectValidationNotRequired,
} from '@/lib/zod-validations';

interface InputField {
    name: string;
    type: string;
    required?: boolean;
    [key: string]: any;
}

/**
 * Генерирует Zod-схему для массива полей формы
 * @param inputs - массив описаний полей формы
 * @param country - код страны для валидации телефона
 */
export function getFormSchema(inputs: InputField[], country: string) {
    const validationRules: { [key: string]: any } = {};
    inputs.forEach(input => {
        switch (input.type) {
            case 'text':
                validationRules[input.name] = input.required
                    ? nameValidation
                    : defaultInputValidationNotRequired;
                break;
            case 'tel':
                validationRules[input.name] = input.required
                    ? phoneValidation(country)
                    : defaultInputValidationNotRequired;
                break;
            case 'email':
                validationRules[input.name] = input.required
                    ? emailValidation
                    : defaultInputValidationNotRequired;
                break;
            case 'checkbox':
                validationRules[input.name] = input.required
                    ? checkboxValidation
                    : defaultInputValidationNotRequired;
                break;
            case 'select':
                validationRules[input.name] = input.required
                    ? selectValidation
                    : selectValidationNotRequired;
                break;
            case 'radio':
                validationRules[input.name] = input.required
                    ? radioValidation
                    : defaultInputValidationNotRequired;
                break;
            default:
                validationRules[input.name] = input.required
                    ? defaultInputValidation
                    : defaultInputValidationNotRequired;
        }
    });
    return z.object(validationRules);
}