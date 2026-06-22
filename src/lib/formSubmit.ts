/** Production Google Apps Script endpoint shared by every lead form. */
const DEFAULT_GOOGLE_SCRIPT_URL =
  "https://script.google.com/macros/s/AKfycbwLFKEM6U9mmi-WH7-yE61G99VVRHlIpFWWa6TtivbgLmdwjuji-swmE7Rkz7TO0ZLUMA/exec";

/** Поля таблиці лідів (порядок колонок у Google Sheet). */
export type GoogleSheetLeadPayload = {
  /** Обраний курс */
  Course: string;
  /** Ім'я */
  name: string;
  /** Номер телефону */
  phone: string;
  /** Вік дитини — порожній рядок, якщо поля немає у формі */
  childAge: string;
  /** Пошта */
  email: string;
  /** ID форми */
  FormID: string;
  /** URL сторінки, з якої надіслано заявку */
  SiteURL: string;
  /** Запитання з FAQ-форми (опціонально) */
  question?: string;
};

export function buildGoogleSheetLeadPayload(input: {
  course: string;
  formId: string;
  name: string;
  phone: string;
  childAge?: number | string | null;
  email?: string;
  question?: string;
  siteUrl?: string;
}): GoogleSheetLeadPayload {
  const hasChildAge =
    input.childAge !== undefined &&
    input.childAge !== null &&
    input.childAge !== "";

  const payload: GoogleSheetLeadPayload = {
    Course: input.course,
    name: input.name,
    phone: input.phone,
    childAge: hasChildAge ? String(input.childAge) : "",
    email: input.email ?? "",
    FormID: input.formId,
    SiteURL: input.siteUrl ?? (typeof window !== "undefined" ? window.location.href : ""),
  };

  const question = input.question?.trim();
  if (question) {
    payload.question = question;
  }

  return payload;
}

export async function submitLeadToGoogleSheet(
  sendData: GoogleSheetLeadPayload,
  scriptUrl?: string,
): Promise<void> {
  const url =
    scriptUrl?.trim() ||
    import.meta.env.PUBLIC_GOOGLE_SCRIPT_URL?.trim() ||
    DEFAULT_GOOGLE_SCRIPT_URL;

  await fetch(url, {
    method: "POST",
    mode: "no-cors",
    headers: { "Content-Type": "text/plain;charset=utf-8" },
    body: JSON.stringify(sendData),
    keepalive: true,
  });
}
