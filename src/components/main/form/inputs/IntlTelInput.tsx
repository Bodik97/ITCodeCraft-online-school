import { useEffect, useRef } from 'react';
import IntlTelInputComponent from '@intl-tel-input/react';
import type { IntlTelInputRef } from '@intl-tel-input/react';
import type { Iso2 } from 'intl-tel-input/data';
import { Controller, type FieldErrors } from 'react-hook-form';
import { cn } from '@/lib/utils';

type IntlTelInputProps = {
  control: any;
  setCountry: (country: string) => void;
  country: string;
  name: string;
  errors: FieldErrors;
  label?: string | null | React.ReactNode;
  classNameInputLabel?: string;
  classNameInputError?: string;
};

export default function IntlTelInput({
  control,
  setCountry,
  country,
  name,
  errors,
  label,
  classNameInputError,
  classNameInputLabel,
}: IntlTelInputProps) {
  const itiRef = useRef<IntlTelInputRef>(null);

  useEffect(() => {
    const iso2 = country?.toLowerCase() as Iso2 | undefined;
    if (!iso2) return;

    const instance = itiRef.current?.getInstance();
    if (!instance) return;

    void instance.promise.then(() => {
      const selected = instance.getSelectedCountry();
      if (selected?.iso2 !== iso2) {
        instance.setSelectedCountry(iso2);
      }
    });
  }, [country]);

  return (
    <Controller
      name={name}
      control={control}
      rules={{ required: true }}
      render={({ field }) => (
        <label className="input-label">
          {label && (
            <span
              className={cn(
                'input-label-title',
                { 'input-label-title--error': errors[name]?.message },
                classNameInputLabel,
              )}
            >
              {label}
            </span>
          )}
          <span className="input-wrapper">
            <IntlTelInputComponent
              ref={itiRef}
              initialCountry={(country?.toLowerCase() || 'ua') as Iso2}
              countryNameLocale="uk"
              excludeCountries={['ru']}
              countryOrder={['ua', 'pl', 'tr']}
              uiTranslations={{
                searchPlaceholder: 'Пошук',
                noCountrySelected: 'Оберіть країну',
                countryListAriaLabel: 'Список країн',
              }}
              containerClass="iti--lead-form"
              countrySelectorMode="DROPDOWN"
              separateDialCode={false}
              numberDisplayFormat="NATIONAL"
              matchDropdownWidth
              loadUtils={() => import('intl-tel-input/utils')}
              value={field.value}
              onChangeNumber={field.onChange}
              onChangeCountry={(iso2) => setCountry(iso2.toUpperCase())}
              inputProps={{
                name: field.name,
                onBlur: field.onBlur,
                placeholder: '050 123 45 67',
                className: cn(errors[name]?.message && 'input-field--error'),
                'aria-invalid': errors[name] ? true : undefined,
                'aria-label': 'Телефон',
              }}
            />
          </span>

          {errors[name]?.message && (
            <p className={cn('input-error-message', classNameInputError)}>
              {typeof errors[name]?.message === 'string' ? errors[name]?.message : ''}
            </p>
          )}
        </label>
      )}
    />
  );
}
