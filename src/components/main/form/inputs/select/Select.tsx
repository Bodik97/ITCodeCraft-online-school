'use client';

import React, { useState } from 'react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectIcon,
  SelectTrigger,
  SelectValue,
} from './SelectPartials';
import { Controller } from 'react-hook-form';
import { ChevronDown } from 'lucide-react';

import { cn } from '@/lib/utils';

type FormSelectProps = {
  control: any;
  name: string;
  title?: string;
  placeholder?: string;
  label?: string | React.ReactNode | null;
  options:
    | Array<{
        label: string | React.ReactNode | null;
        value: string | number;
        selected?: boolean;
      }>
    | [];
  errors: any;
  classNameInput?: string;
  classNameInputLabel?: string;
  classNameInputError?: string;
  defaultValue?: string;
};

function FormSelect({
  name,
  label,
  placeholder,
  options = [],
  errors,
  classNameInput,
  classNameInputLabel,
  classNameInputError,
  control,
  defaultValue,
}: FormSelectProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Controller
      name={name}
      control={control}
      defaultValue={defaultValue}
      render={({ field: { onChange, value } }) => (
        <div className="input-label relative">
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
          <Select
            onValueChange={selectValue => {
              onChange(selectValue);
            }}
            value={value}
            defaultValue={defaultValue}
            onOpenChange={isOpen => setIsOpen(isOpen)}
          >
            <SelectTrigger
              data-selected={!!value}
              className={cn(
                'input-field select !pr-[10px] md:!pr-[14px]',
                { 'input-field--error': errors[name]?.message },
                classNameInput,
                ''
              )}
            >
              <SelectValue placeholder={placeholder} />
              <SelectIcon>
                <ChevronDown
                  className={cn(
                    'chevron-icon',
                    {
                      'rotate-180': isOpen,
                    },
                    {
                      'chevron-icon--error': errors[name]?.message,
                    }
                  )}
                />
              </SelectIcon>
            </SelectTrigger>
            <SelectContent className="select-options max-h-[180px] py-1 md:max-h-[250px]">
              {options.map(option => (
                <SelectItem
                  key={option.value}
                  value={option.value as string}
                  onPointerUp={event => event.stopPropagation()}
                  onClick={event => event.stopPropagation()}
                >
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors[name] && (
            <p className={cn('input-error-message', classNameInputError)}>
              {errors[name]?.message}
            </p>
          )}
        </div>
      )}
    />
  );
}

export default FormSelect;
