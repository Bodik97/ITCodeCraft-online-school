import { useEffect, useRef } from "react";
import IntlTelInput from "@intl-tel-input/react";
import type { IntlTelInputRef } from "@intl-tel-input/react";
import "intl-tel-input/styles";
import type { Control, FieldError } from "react-hook-form";
import { Controller } from "react-hook-form";
import type { LeadFormValues } from "./schema";

type Props = {
  control: Control<LeadFormValues>;
  error?: FieldError;
};

export default function PhoneField({ control, error }: Props) {
  const itiRef = useRef<IntlTelInputRef>(null);

  useEffect(() => {
    itiRef.current?.getInput()?.setAttribute("data-testid", "input-phone");
  }, []);

  return (
    <div>
      <label htmlFor="phone">Телефон</label>
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
              id: "phone",
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
