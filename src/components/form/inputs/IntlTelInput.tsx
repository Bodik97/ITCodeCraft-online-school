'use client';

import React, { useRef, useEffect, useCallback, useMemo } from 'react';
import {
  Controller,
  type FieldErrors,
  type UseFormGetValues,
  type UseFormSetValue,
} from 'react-hook-form';
import { cn } from '@/lib/utils';

import intlTelInput, { type Iti } from 'intl-tel-input';

type IntlTelInputProps = {
  control: any;
  setCountry: (country: string) => void;
  country: string;
  name: string;
  errors: FieldErrors;
  label?: string | null | React.ReactNode;
  classNameInputLabel?: string;
  classNameInputError?: string;
  classNameInput?: string;
  setValue: UseFormSetValue<any>;
  getValues: UseFormGetValues<any>;
};

type TelInputProps = {
  inputRef: React.RefObject<HTMLInputElement | null>;
  value: string;
  onChange: (value: string) => void;
  country: string;
  setCountry: (country: string) => void;
  errors: FieldErrors;
  name: string;
  classNameInput?: string;
};

const TelInput = ({
  inputRef,
  value,
  onChange,
  country,
  setCountry,
  errors,
  name,
  classNameInput,
}: TelInputProps) => {
  const itiInstanceRef = useRef<Iti | null>(null);
  const isProgrammaticNumberUpdateRef = useRef(false);

  const initOptions = useMemo(
    () => ({
      loadUtils: () => import('intl-tel-input/build/js/utils.js'),
      initialCountry: country || 'ua',
      excludeCountries: ['ru'],
      countryOrder: ['ua', 'pl', 'tr'],
      autoPlaceholder: 'aggressive',
      useFullscreenPopup: false,
    }),
    [country]
  );

  const handleInput = useCallback(() => {
    if (isProgrammaticNumberUpdateRef.current) return;
    if (itiInstanceRef.current) {
      const number = itiInstanceRef.current.getNumber();
      onChange(number);
    }
  }, [onChange]);

  const handleCountryChange = useCallback(() => {
    if (itiInstanceRef.current) {
      const countryData = itiInstanceRef.current.getSelectedCountryData();
      if (countryData.iso2) {
        setCountry(countryData.iso2);
      }
    }
  }, [setCountry]);

  useEffect(() => {
    if (typeof window === 'undefined' || !inputRef.current) return;

    const input = inputRef.current;
    itiInstanceRef.current = intlTelInput(input, initOptions);

    input.addEventListener('input', handleInput);
    input.addEventListener('countrychange', handleCountryChange);

    return () => {
      input.removeEventListener('input', handleInput);
      input.removeEventListener('countrychange', handleCountryChange);
      if (itiInstanceRef.current) {
        itiInstanceRef.current.destroy();
        itiInstanceRef.current = null;
      }
    };
  }, [initOptions, handleInput, handleCountryChange, inputRef]);

  useEffect(() => {
    if (!itiInstanceRef.current || !country) return;

    const currentCountry = itiInstanceRef.current.getSelectedCountryData().iso2;
    if (currentCountry !== country.toLowerCase()) {
      itiInstanceRef.current.setCountry(country);
    }
  }, [country]);

  useEffect(() => {
    if (!itiInstanceRef.current || !inputRef.current) return;

    if (inputRef.current.value !== value) {
      isProgrammaticNumberUpdateRef.current = true;
      itiInstanceRef.current.setNumber(value || '');
      queueMicrotask(() => {
        isProgrammaticNumberUpdateRef.current = false;
      });
    }
  }, [value, inputRef]);

  return (
    <input
      type="tel"
      ref={inputRef}
      className={cn('input-field', { 'input-field--error': errors[name]?.message }, classNameInput)}
      aria-invalid={!!errors[name]?.message}
      aria-label="Телефон"
      suppressHydrationWarning={true}
    />
  );
};

TelInput.displayName = 'TelInput';

const IntlTelInput = function IntlTelInput({
  control,
  setCountry,
  country,
  name,
  errors,
  label,
  classNameInputError,
  classNameInput,
  classNameInputLabel,
}: IntlTelInputProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  return (
    <Controller
      name={name}
      control={control}
      rules={{ required: true }}
      render={({ field }) => {
        const { onChange, value } = field;

        return (
          <label className="input-label">
            {label && (
              <span
                className={cn(
                  'input-label-title',
                  { 'input-label-title--error': errors[name]?.message },
                  classNameInputLabel
                )}
              >
                {label}
              </span>
            )}
            <span className="input-wrapper">
              <TelInput
                inputRef={inputRef}
                value={value}
                onChange={onChange}
                country={country}
                setCountry={setCountry}
                errors={errors}
                name={name}
                classNameInput={classNameInput}
              />
            </span>

            {errors[name]?.message && (
              <p className={cn('input-error-message', classNameInputError)}>
                {typeof errors[name]?.message === 'string' ? errors[name]?.message : ''}
              </p>
            )}
          </label>
        );
      }}
    />
  );
};

export default IntlTelInput;
