import { ComponentProps } from 'react';
import { FormSwitch } from '@/ui-kit/inputs';
import {
  FieldValues,
  useController,
  UseControllerProps,
} from 'react-hook-form';

type ControlledSwitchProps<T extends FieldValues> = ComponentProps<
  typeof FormSwitch
> &
  UseControllerProps<T>;

export const ControlledSwitch = <T extends FieldValues>({
  control,
  name,
  label,
  helperText,
  labelPlacement = 'end',
}: ControlledSwitchProps<T>) => {
  const {
    field,
    fieldState: { error },
  } = useController({
    control,
    name,
  });

  return (
    <FormSwitch
      label={label}
      helperText={helperText}
      labelPlacement={labelPlacement}
      errorMessage={error?.message}
      checked={field.value}
      {...field}
    />
  );
};
