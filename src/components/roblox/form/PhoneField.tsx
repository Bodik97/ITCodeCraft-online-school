import { useEffect, useRef } from "react";
import IntlTelInput from "@intl-tel-input/react";
import type { IntlTelInputRef } from "@intl-tel-input/react";
import "intl-tel-input/styles";
import type {
  Control,
  FieldError,
  FieldValues,
  FieldPath,
} from "react-hook-form";
import { Controller } from "react-hook-form";

type Props<TFieldValues extends FieldValues> = {
  control: Control<TFieldValues>;
  error?: FieldError;
  name?: FieldPath<TFieldValues>;
  inputId?: string;
  testId?: string;
};

export default function PhoneField<TFieldValues extends FieldValues>({
  control,
  error,
  name = "phone" as FieldPath<TFieldValues>,
  inputId = "phone",
  testId = "input-phone",
}: Props<TFieldValues>) {
  const itiRef = useRef<IntlTelInputRef>(null);

  useEffect(() => {
    itiRef.current?.getInput()?.setAttribute("data-testid", testId);
  }, [testId]);

  return (
    <div>
      <label htmlFor={inputId}>Телефон</label>
      <Controller
        name={name}
        control={control}
        render={({ field }) => (
          <IntlTelInput
            ref={itiRef}
            initialCountry="ua"
            countryNameLocale="uk"
            i18n={{
              searchPlaceholder: "Пошук",
              noCountrySelected: "Оберіть країну",
              countryListAriaLabel: "Список країн",
            }}
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
