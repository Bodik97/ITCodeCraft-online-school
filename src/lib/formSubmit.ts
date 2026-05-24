const DEFAULT_GOOGLE_SCRIPT_URL =
  "https://script.google.com/macros/s/AKfycbyayfZuKHmihCF6048mwuuA-XC7_D802bM54W0ArXvPFuiK42ZxSvdNm39c-_OdeaE-0Q/exec";

export type GoogleSheetLeadPayload = {
  Course: string;
  FormID: string;
  SiteURL: string;
  childAge: number;
  email: string;
  name: string;
  phone: string;
};

export function buildGoogleSheetLeadPayload(input: {
  course: string;
  formId: string;
  name: string;
  phone: string;
  childAge: number;
  email?: string;
}): GoogleSheetLeadPayload {
  return {
    Course: input.course,
    FormID: input.formId,
    SiteURL: window.location.href,
    childAge: Number(input.childAge),
    email: input.email ?? "",
    name: input.name,
    phone: input.phone,
  };
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
