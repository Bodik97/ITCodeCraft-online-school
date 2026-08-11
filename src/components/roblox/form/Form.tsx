import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import AgeSelectField from "./AgeSelectField";
import PhoneField from "./PhoneField";
import { leadSchema, type LeadFormValues } from "./schema";
import { submitLead, type CrmParams } from "./submitLead";

export type { CrmParams };

type FormCopy = {
  submitLabel: string;
  submittingLabel: string;
  successTitle: string;
  successMessage: string;
};

type Props = {
  copy: FormCopy;
  crm: CrmParams;
};

const emptyValues: LeadFormValues = {
  parentName: "",
  phone: "",
  childAge: undefined,
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
    defaultValues: emptyValues,
  });

  const onSubmit = handleSubmit(async (values) => {
    if (typeof values.childAge !== "number") return;

    await submitLead({
      crm,
      trackEvent: "form_submit_lead",
      trackContext: "блок_на_сайті",
      name: values.parentName,
      phone: values.phone,
      childAge: values.childAge,
      fields: values,
      withRedirect: true,
    });
    reset(emptyValues);
  });

  return (
    <form
      id={crm.formId}
      onSubmit={onSubmit}
      className="lead-form"
      data-testid="lead-form"
      data-itcc-form="register-lead"
      data-form-id={crm.formId}
      noValidate
    >
      <div className="relative">
        <label htmlFor="parentName">Ваше ім'я</label>
        <input
          id="parentName"
          data-testid="input-parent-name"
          placeholder="Ваше ім'я"
          autoComplete="name"
          aria-invalid={errors.parentName ? true : undefined}
          className={errors.parentName ? "has-error" : undefined}
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
