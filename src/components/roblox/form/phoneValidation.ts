import { z } from "zod";
import { intlTelInput } from "@intl-tel-input/react";

/**
 * intl-tel-input validation error codes (stable libphonenumber ValidationResult
 * indexes). Declared explicitly so we don't depend on the runtime enum, whose
 * type isn't reliably exported across intl-tel-input versions.
 */
const ERROR_MESSAGES: Record<number, string> = {
  1: "Невірний код країни", // INVALID_COUNTRY_CODE
  2: "Номер занадто короткий", // TOO_SHORT
  3: "Номер занадто довгий", // TOO_LONG
  4: "Невірний номер для обраної країни", // IS_POSSIBLE_LOCAL_ONLY
  5: "Невірна довжина номера", // INVALID_LENGTH
};

export function getPhoneErrorMessage(
  value: string,
  errorCode: number | null | undefined,
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
