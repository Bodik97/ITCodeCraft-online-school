import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import PhoneField from "./PhoneField";
import { questionSchema, type QuestionFormValues } from "./questionSchema";
import { submitLead, type CrmParams } from "./submitLead";

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
    try {
      await submitLead({
        crm,
        trackEvent: "form_submit_question",
        trackContext: "faq_питання",
        name: values.name,
        phone: values.phone,
        question: values.question,
        fields: values,
      });
    } finally {
      reset();
    }
  });

  return (
    <form
      id={crm.formId}
      onSubmit={onSubmit}
      className="lead-form space-y-5"
      data-testid="question-form"
      data-itcc-form="faq-question"
      data-form-id={crm.formId}
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
