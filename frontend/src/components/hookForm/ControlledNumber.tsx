import { FormInput } from '@/ui-kit/inputs';
import { ComponentProps } from 'react';
import {
  Control,
  FieldValues,
  useController,
  UseControllerProps,
} from 'react-hook-form';
import {
  DefaultInputComponentProps,
  getCountryCallingCode,
  isSupportedCountry,
} from 'react-phone-number-input';
import { DefaultFormValues } from 'react-phone-number-input/react-hook-form';
import PhoneInput, {
  Props,
} from 'react-phone-number-input/react-hook-form-input';

type ControlledFormInputProps<T extends FieldValues> = ComponentProps<
  typeof FormInput
> &
  UseControllerProps<T> &
  Props<DefaultInputComponentProps, T>;

export const ControlledNumber = <T extends FieldValues>({
  name,
  control,
  placeholder,
  label,
  ...props
}: ControlledFormInputProps<T>) => {
  const {
    field,
    fieldState: { error },
  } = useController({
    control,
    name,
  });

  return (
    <>
      <PhoneInput
        {...props}
        control={control as Control<DefaultFormValues>}
        label={label || ''}
        placeholder={placeholder || ''}
        inputComponent={FormInput}
        errorMessage={error?.message}
        startAdornmentProps={{
          disablePointerEvents: true,
        }}
        startAdornment={
          props?.country && isSupportedCountry(props?.country)
            ? `+ ${getCountryCallingCode(props?.country)}`
            : undefined
        }
        {...field}
      />
    </>
  );
};
