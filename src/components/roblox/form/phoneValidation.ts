import { z } from "zod";
import { intlTelInput } from "@intl-tel-input/react";
import type { ValidationError } from "intl-tel-input";

const ERROR_MESSAGES: Record<ValidationError, string> = {
  IS_POSSIBLE: "Невірний номер для обраної країни",
  INVALID_COUNTRY_CODE: "Невірний код країни",
  TOO_SHORT: "Номер занадто короткий",
  TOO_LONG: "Номер занадто довгий",
  IS_POSSIBLE_LOCAL_ONLY: "Невірний номер для обраної країни",
  INVALID_LENGTH: "Невірна довжина номера",
};

export function getPhoneErrorMessage(
  value: string,
  errorCode: ValidationError | null | undefined,
): string {
  if (!value) return "Введіть номер телефону";
  if (errorCode == null) return "Невірний номер для обраної країни";
  return ERROR_MESSAGES[errorCode] ?? "Невірний номер для обраної країни";
}

/** Validates an E.164 value via intl-tel-input utils (used in Zod schemas). */
export function validatePhoneE164(value: string): true | string {
  if (!value) return "Введіть номер телефону";

  const utils = intlTelInput.utils;
  if (!utils) return true;

  if (utils.isValidNumber(value, undefined)) {
    return true;
  }

  const errorCode = utils.getValidationError(value, undefined);
  return getPhoneErrorMessage(value, errorCode);
}

/** Shared Zod field for E.164 phone inputs. */
export const phoneField = z.string().superRefine((value, ctx) => {
  const result = validatePhoneE164(value);
  if (result !== true) {
    ctx.addIssue({ code: "custom", message: result });
  }
});
