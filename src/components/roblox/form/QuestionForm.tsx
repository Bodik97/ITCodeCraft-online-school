import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import PhoneField from "./PhoneField";
import { questionSchema, type QuestionFormValues } from "./questionSchema";
import { reportError } from "@/lib/reportError";
import {
  buildGoogleSheetLeadPayload,
  submitLeadToGoogleSheet,
} from "@/lib/formSubmit";
import { pushGtmEvent, uid } from "@/lib/utils";
import type { CrmParams } from "./Form";

type FormCopy = {
  submitLabel: string;
  submittingLabel: string;
};

type Props = {
  copy: FormCopy;
  crm: CrmParams;
};

export default function QuestionForm({ copy, crm }: Props) {
  const {
    register,
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<QuestionFormValues>({
    resolver: zodResolver(questionSchema),
    defaultValues: { name: "", phone: "", question: "" },
  });

  const onSubmit = handleSubmit(async (values) => {
    const resolvedProductName =
      typeof window !== "undefined" && window.productName != null
        ? window.productName
        : crm.productName;

    const leadSummary = JSON.stringify({
      context: "faq_питання",
      course: resolvedProductName,
      ...values,
    });
    window.itccTrack?.("form_submit_question", leadSummary, { skipThrottle: true });

    const sendData = buildGoogleSheetLeadPayload({
      course: resolvedProductName,
      formId: crm.formId ?? "roblox-faq-question",
      name: values.name,
      phone: values.phone,
      question: values.question,
    });

    try {
      await submitLeadToGoogleSheet(sendData, crm.googleScriptUrl);

      pushGtmEvent("lead", {
        phone: sendData.phone,
        email: "",
        conversionId: uid(),
      });

      window.dispatchEvent(new CustomEvent("itcc:form-success"));
    } catch (error) {
      reportError(error, "question-form");
      window.dispatchEvent(new CustomEvent("itcc:form-error"));
    } finally {
      reset();
    }
  });

  return (
    <form
      onSubmit={onSubmit}
      className="lead-form space-y-5"
      data-testid="question-form"
      data-itcc-form="faq-question"
      noValidate
    >
      <div>
        <label htmlFor="questionName">Ім&apos;я</label>
        <input
          id="questionName"
          data-testid="input-question-name"
          placeholder="Ваше ім'я"
          autoComplete="name"
          {...register("name")}
        />
        {errors.name && <p className="field-error">{errors.name.message}</p>}
      </div>

      <PhoneField
        control={control}
        error={errors.phone}
        inputId="questionPhone"
        testId="input-question-phone"
      />

      <div>
        <label htmlFor="questionText">Ваше запитання</label>
        <textarea
          id="questionText"
          data-testid="input-question-text"
          rows={4}
          placeholder="Напишіть, що вас цікавить…"
          {...register("question")}
        />
        {errors.question && <p className="field-error">{errors.question.message}</p>}
      </div>

      <button
        type="submit"
        data-testid="button-submit-question"
        disabled={isSubmitting}
        aria-busy={isSubmitting}
        className="w-full h-14 rounded-xl text-sm xl:text-base font-display font-bold bg-[#6366F1] text-white hover:bg-[#4F46E5] transition-colors border-0"
      >
        {isSubmitting ? copy.submittingLabel : copy.submitLabel}
      </button>
    </form>
  );
}
