/** Shared form lifecycle events — always on `document` (not `window`). */

export const FORM_SUCCESS_EVENT = "itcc:form-success";
export const FORM_ERROR_EVENT = "itcc:form-error";

export function dispatchFormSuccess(): void {
  document.dispatchEvent(new CustomEvent(FORM_SUCCESS_EVENT));
}

export function dispatchFormError(): void {
  document.dispatchEvent(new CustomEvent(FORM_ERROR_EVENT));
}

export function onFormSuccess(handler: EventListener): void {
  document.addEventListener(FORM_SUCCESS_EVENT, handler);
}

export function onFormError(handler: EventListener): void {
  document.addEventListener(FORM_ERROR_EVENT, handler);
}
