import { onFormError, onFormSuccess } from "@/lib/formEvents";

export type FormFeedbackSelectors = {
  form: string;
  success: string;
  error: string;
  scrollToId?: string;
};

/** Wire lead-form success/error UI for a themed landing page. */
export function initFormFeedback(selectors: FormFeedbackSelectors): void {
  const scrollToId = selectors.scrollToId ?? "register";

  onFormSuccess(() => {
    document.querySelector(selectors.form)?.setAttribute("hidden", "");
    document.querySelector(selectors.error)?.setAttribute("hidden", "");
    document.querySelector(selectors.success)?.removeAttribute("hidden");
    document
      .getElementById(scrollToId)
      ?.scrollIntoView({ behavior: "smooth", block: "center" });
  });

  onFormError(() => {
    document.querySelector(selectors.error)?.removeAttribute("hidden");
  });
}
