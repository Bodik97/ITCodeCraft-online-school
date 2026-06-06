import { useEffect, useRef } from "react";
import IntlTelInput from "@intl-tel-input/react";
import type { IntlTelInputRef } from "@intl-tel-input/react";
import "intl-tel-input/styles";
import type { Control, FieldError } from "react-hook-form";
import { Controller } from "react-hook-form";

type PhoneFormValues = { phone: string };

type Props = {
  control: Control<PhoneFormValues>;
  error?: FieldError;
  inputId?: string;
  testId?: string;
};

export default function PhoneField({
  control,
  error,
  inputId = "phone",
  testId = "input-phone",
}: Props) {
  const itiRef = useRef<IntlTelInputRef>(null);

  useEffect(() => {
    itiRef.current?.getInput()?.setAttribute("data-testid", testId);
  }, [testId]);

  return (
    <div>
      <label htmlFor={inputId}>Телефон</label>
      <Controller
        name="phone"
        control={control}
        render={({ field }) => (
          <IntlTelInput
            ref={itiRef}
            initialCountry="ua"
            countryNameLocale="uk"
            containerClass="iti--lead-form"
            separateDialCode={false}
            nationalMode
            fixDropdownWidth
            useFullscreenPopup={false}
            loadUtils={() => import("intl-tel-input/utils")}
            value={field.value}
            onChangeNumber={field.onChange}
            inputProps={{
              id: inputId,
              name: field.name,
              onBlur: field.onBlur,
              placeholder: "050 123 45 67",
              "aria-invalid": error ? true : undefined,
            }}
          />
        )}
      />
      {error && <p className="field-error">{error.message}</p>}
    </div>
  );
}
