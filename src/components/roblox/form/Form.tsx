import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import AgeSelectField from "./AgeSelectField";
import PhoneField from "./PhoneField";
import { leadSchema, type LeadFormValues } from "./schema";
import { reportError } from "@/lib/reportError";
import {
  buildGoogleSheetLeadPayload,
  submitLeadToGoogleSheet,
} from "@/lib/formSubmit";
import { pushGtmEvent, uid } from "@/lib/utils";

type FormCopy = {
  submitLabel: string;
  submittingLabel: string;
  successTitle: string;
  successMessage: string;
};

export type CrmParams = {
  productName: string;
  formId?: string;
  googleScriptUrl?: string;
  redirectUrl?: string;
};

type Props = {
  copy: FormCopy;
  crm: CrmParams;
};

export default function LeadForm({ copy, crm }: Props) {
  const {
    register,
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<LeadFormValues>({
    resolver: zodResolver(leadSchema),
    defaultValues: { childAge: 10, phone: "" },
  });

  const onSubmit = handleSubmit(async (values) => {
    const resolvedProductName =
      typeof window !== "undefined" && window.productName != null
        ? window.productName
        : crm.productName;

    const leadSummary = JSON.stringify({
      context: "блок_на_сайті",
      course: resolvedProductName,
      ...values,
    });
    window.itccTrack?.("form_submit_lead", leadSummary, { skipThrottle: true });

    const sendData = buildGoogleSheetLeadPayload({
      course: resolvedProductName,
      formId: crm.formId ?? "roblox-landing",
      name: values.parentName,
      phone: values.phone,
      childAge: values.childAge,
    });

    try {
      await submitLeadToGoogleSheet(sendData, crm.googleScriptUrl);

      pushGtmEvent("lead", {
        phone: sendData.phone,
        email: "",
        conversionId: uid(),
      });

      const params = new URLSearchParams(window.location.search);
      params.set("first_name", sendData.name as string);
      params.set("phone", (sendData.phone as string) || "");
      params.set("email", "");

      if (crm.redirectUrl) {
        reset();
        window.location.href = `${crm.redirectUrl}?${params.toString()}`;
        return;
      }

      window.history.pushState(
        {},
        "",
        `${window.location.pathname}?${params.toString()}`,
      );
      window.dispatchEvent(new CustomEvent("itcc:form-success"));
    } catch (error) {
      reportError(error, "lead-form");
      window.dispatchEvent(new CustomEvent("itcc:form-error"));
    } finally {
      reset();
    }
  });

  return (
    <form
      onSubmit={onSubmit}
      className="lead-form space-y-5"
      data-testid="lead-form"
      data-itcc-form="register-lead"
      noValidate
    >
      <div>
        <label htmlFor="parentName">Ім&apos;я батька або мами</label>
        <input
          id="parentName"
          data-testid="input-parent-name"
          placeholder="Ваше ім'я"
          autoComplete="name"
          {...register("parentName")}
        />
        {errors.parentName && (
          <p className="field-error">{errors.parentName.message}</p>
        )}
      </div>

      <PhoneField control={control} error={errors.phone} />

      <AgeSelectField control={control} error={errors.childAge} />

      <button
        type="submit"
        data-testid="button-submit-lead"
        disabled={isSubmitting}
        aria-busy={isSubmitting}
        className="w-full h-14 rounded-xl text-sm xl:text-base font-display font-bold btn-3d-amber border-0"
      >
        {isSubmitting ? copy.submittingLabel : copy.submitLabel}
      </button>
    </form>
  );
}
