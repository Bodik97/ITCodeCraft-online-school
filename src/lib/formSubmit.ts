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
    import.meta.env.PUBLIC_GOOGLE_SCRIPT_URL?.trim();

  if (!url) {
    throw new Error(
      "Google Script URL missing: set PUBLIC_GOOGLE_SCRIPT_URL or pass scriptUrl",
    );
  }

  // The Apps Script endpoint returns JSON with `access-control-allow-origin: *`,
  // so we read the real status instead of firing blind (no-cors). text/plain keeps
  // this a "simple" CORS request — Apps Script has no OPTIONS preflight handler.
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 12000);

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "text/plain;charset=utf-8" },
      body: JSON.stringify(sendData),
      keepalive: true,
      signal: controller.signal,
    });

    const text = await response.text();
    let data: { ok?: boolean } | null = null;
    try {
      data = JSON.parse(text);
    } catch {
      // Non-JSON body means the script returned an HTML error page, not a saved lead.
    }

    if (!response.ok || data === null || data.ok === false) {
      throw new Error(
        `Lead was not saved (HTTP ${response.status}): ${text.slice(0, 200)}`,
      );
    }
  } finally {
    clearTimeout(timeout);
  }
}
