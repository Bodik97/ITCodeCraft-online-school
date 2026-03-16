import React, { type ReactElement } from 'react';
import { Controller } from 'react-hook-form';
import { Check } from 'lucide-react';
import { cn } from '@/lib/utils';

type RadioButtonProps = {
  control: any;
  name: string;
  title?: string;
  options:
    | Array<{
        label: string | React.ReactNode | null;
        value: string | number;
      }>
    | [];
  errors: any;
  defaultValue?: any;
};

function RadioButtonGroup({
  name,
  title,
  options = [],
  errors,
  control,
  defaultValue,
}: RadioButtonProps): ReactElement<any> {
  if (!options.length) {
    return <div>No options provided</div>;
  }
  return (
    <Controller
      name={name}
      control={control}
      defaultValue={defaultValue}
      render={({ field }) => (
        <div className={cn('radio-wrapper')}>
          {title && <p className={cn('radio-title')}>{title}</p>}
          <div className="radio-group">
            {options.map((option, index) => (
              <label
                key={index}
                className={cn('radio-label', {
                  'radio-error': errors[name]?.message,
                })}
              >
                <input
                  {...field}
                  type="radio"
                  value={option.value}
                  className="visually-hidden"
                  checked={field.value === option.value}
                />
                <span className={cn('radio')}>
                  <Check className="check-icon" />
                </span>
                <span className="radio-text">{option.label}</span>
              </label>
            ))}
          </div>
          {errors[name] && <p className={cn('input-error-message')}>{errors[name]?.message}</p>}
        </div>
      )}
    />
  );
}

export default RadioButtonGroup;
