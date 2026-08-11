import {
  buildGoogleSheetLeadPayload,
  submitLeadToGoogleSheet,
} from "@/lib/formSubmit";
import { pushGtmEvent, uid } from "@/lib/utils";
import { reportError, reportLeadSuccess } from "@/lib/reportError";

export type CrmParams = {
  productName: string;
  formId: string;
  googleScriptUrl?: string;
  redirectUrl?: string;
};

type SubmitLeadInput = {
  crm: CrmParams;
  /** Analytics event name, e.g. "form_submit_lead". */
  trackEvent: string;
  /** Analytics context label, e.g. "блок_на_сайті". */
  trackContext: string;
  name: string;
  phone: string;
  childAge?: number;
  question?: string;
  /** Raw form values, attached to error reports. */
  fields: Record<string, unknown>;
  /**
   * When true, append lead params to the URL and honour `crm.redirectUrl`
   * (used by the registration form, not by the FAQ question form).
   */
  withRedirect?: boolean;
};

/**
 * Shared lead-submission pipeline for the Roblox forms: tracking, Google Sheet
 * POST, GTM conversion, optional redirect, and success/error event dispatch.
 */
export async function submitLead(input: SubmitLeadInput): Promise<void> {
  const resolvedProductName =
    typeof window !== "undefined" && window.productName != null
      ? window.productName
      : input.crm.productName;

  const leadSummary = JSON.stringify({
    context: input.trackContext,
    course: resolvedProductName,
    ...input.fields,
  });
  window.itccTrack?.(input.trackEvent, leadSummary, { skipThrottle: true });

  const sendData = buildGoogleSheetLeadPayload({
    course: resolvedProductName,
    formId: input.crm.formId,
    name: input.name,
    phone: input.phone,
    childAge: input.childAge,
    question: input.question,
  });

  try {
    await submitLeadToGoogleSheet(sendData, input.crm.googleScriptUrl);

    void reportLeadSuccess({ formId: input.crm.formId, fields: input.fields });

    pushGtmEvent("lead", {
      phone: sendData.phone,
      email: sendData.email,
      conversionId: uid(),
    });

    if (input.withRedirect) {
      const params = new URLSearchParams(window.location.search);
      params.set("first_name", sendData.name);
      params.set("phone", sendData.phone || "");
      params.set("email", "");

      if (input.crm.redirectUrl) {
        const nextUrl = `${input.crm.redirectUrl}?${params.toString()}`;
        // Google Ads conversion — waits for the hit, then redirects.
        if (window.gtag_report_conversion) {
          window.gtag_report_conversion(nextUrl);
        } else {
          window.location.href = nextUrl;
        }
        return;
      }

      window.gtag_report_conversion?.();
      window.history.pushState(
        {},
        "",
        `${window.location.pathname}?${params.toString()}`,
      );
    } else {
      window.gtag_report_conversion?.();
    }

    window.dispatchEvent(new CustomEvent("itcc:form-success"));
  } catch (error) {
    reportError(error, { formId: input.crm.formId, fields: input.fields });
    window.dispatchEvent(new CustomEvent("itcc:form-error"));
  }
}
