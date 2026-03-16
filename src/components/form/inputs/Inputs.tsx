import Checkbox from './Checkbox';
import { cn } from '@/lib/utils';
import IntlTelInput from './IntlTelInput';
import RadioButtonGroup from './RadioButtonGroup';
import { Textarea } from '@/components/ui/textarea';
import FormSelect from './select/Select';

interface FormInput {
  title: string;
  type: 'text' | 'tel' | 'email' | 'checkbox' | 'radio' | 'select' | 'textarea';
  name: string;
  placeholder?: string;
  required: boolean;
  options?: {
    value: string;
    label: string;
    selected: boolean;
  }[];
  register: any;
  errors: any;
  setValue: any;
  getValues: any;
  country: any;
  setCountry: any;
  control: any;
  defaultValue?: any;
}

function Input({
  name,
  type,
  placeholder,
  options,
  title,
  register,
  errors,
  setValue,
  getValues,
  country,
  setCountry,
  control,
  defaultValue = '',
}: FormInput) {
  const renderInputs = () => {
    switch (type) {
      case 'tel':
        return (
          <IntlTelInput
            control={control}
            errors={errors}
            setCountry={setCountry}
            name="phone"
            country={country}
            setValue={setValue}
            getValues={getValues}
          />
        );
      case 'select':
        return (
          <FormSelect
            name={name}
            label={title}
            placeholder={placeholder}
            defaultValue={defaultValue}
            options={options || []}
            control={control}
            errors={errors}
          />
        );
      case 'radio':
        return (
          <RadioButtonGroup
            name={name}
            title={title}
            defaultValue={defaultValue}
            options={options || []}
            control={control}
            errors={errors}
          />
        );
      case 'checkbox':
        return (
          <Checkbox
            name={name}
            label={title}
            errors={errors}
            control={control}
            defaultValue={defaultValue}
          />
        );
      case 'textarea':
        return (
          <>
            <label className="input-label">
              {title && (
                <span
                  className={cn('input-label-title', {
                    'input-label-title--error': errors[name]?.message,
                  })}
                >
                  {title}
                </span>
              )}
              <Textarea
                className={cn(errors[name] && 'border-[#e53935]')}
                {...register(name)}
                placeholder={placeholder}
                defaultValue={defaultValue}
              />
              {errors[name] && <p className={cn('input-error-message')}>{errors[name]?.message}</p>}
            </label>
          </>
        );
      default:
        return (
          <label className="input-label">
            {title && (
              <span
                className={cn('input-label-title', {
                  'input-label-title--error': errors[name]?.message,
                })}
              >
                {title}
              </span>
            )}
            <span className="input-wrapper">
              <input
                className={cn('input-field', { 'input-field--error': errors[name]?.message })}
                type={type}
                {...register(name)}
                placeholder={placeholder}
                suppressHydrationWarning={true}
              />
            </span>
            {errors[name] && <p className={cn('input-error-message')}>{errors[name]?.message}</p>}
          </label>
        );
    }
  };

  return renderInputs();
}

export default Input;
