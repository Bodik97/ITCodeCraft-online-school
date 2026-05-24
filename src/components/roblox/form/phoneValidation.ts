import { intlTelInput } from "@intl-tel-input/react";
import type { ValidationError } from "intl-tel-input";

const { VALIDATION_ERROR } = intlTelInput;

const ERROR_MESSAGES: Record<ValidationError, string> = {
  [VALIDATION_ERROR.INVALID_COUNTRY_CODE]: "Невірний код країни",
  [VALIDATION_ERROR.TOO_SHORT]: "Номер занадто короткий",
  [VALIDATION_ERROR.TOO_LONG]: "Номер занадто довгий",
  [VALIDATION_ERROR.INVALID_LENGTH]: "Невірна довжина номера",
  [VALIDATION_ERROR.IS_POSSIBLE]: "Невірний номер для обраної країни",
  [VALIDATION_ERROR.IS_POSSIBLE_LOCAL_ONLY]: "Невірний номер для обраної країни",
};

export function getPhoneErrorMessage(
  value: string,
  errorCode: ValidationError | null | undefined,
): string {
  if (!value) return "Введіть номер телефону";
  if (!errorCode) return "Невірний номер для обраної країни";
  return ERROR_MESSAGES[errorCode] ?? "Невірний номер для обраної країни";
}

/** Validates E.164 value via intl-tel-input utils (used in Zod schema). */
export function validatePhoneE164(value: string): true | string {
  if (!value) return "Введіть номер телефону";
  if (!intlTelInput.utils) return true;

  if (intlTelInput.utils.isValidNumber(value, undefined)) {
    return true;
  }

  const errorCode = intlTelInput.utils.getValidationError(value, undefined);
  return getPhoneErrorMessage(value, errorCode);
}
