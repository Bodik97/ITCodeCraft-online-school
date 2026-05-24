import React, { type ReactElement } from 'react';
import { Controller } from 'react-hook-form';
import { cn } from '@/lib/utils';
import { Check } from 'lucide-react';
import DynamicTag from '@/lib/dynamicTag';

type CheckboxProps = {
  control: any;
  name: string;
  errors: any;
  label?: string;
  defaultValue?: any;
};

function AgreeCheckbox({
  name,
  errors,
  label,
  control,
  defaultValue,
}: CheckboxProps): ReactElement<any> {
  return (
    <Controller
      name={name}
      control={control}
      defaultValue={defaultValue}
      render={({ field: { value, onChange } }) => (
        <label className={cn('checkbox-label group')}>
          <span className="checkbox-wrapper">
            <input
              checked={value}
              onChange={onChange}
              type="checkbox"
              className="visually-hidden peer"
              defaultValue={defaultValue}
            />
            <span className={cn('checkbox', { 'is-invalid': errors[name]?.message })}>
              <Check className={cn('check-icon')} />
            </span>
            {label && <span></span>}
            <DynamicTag content={label as string} className="label-wrapper" tag={'span'} />
          </span>
          {errors[name] && <p className={cn('input-error-message')}>{errors[name]?.message}</p>}
        </label>
      )}
    />
  );
}

export default AgreeCheckbox;
