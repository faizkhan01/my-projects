import { FormSelect } from '@/ui-kit/inputs';
import { ComponentProps } from 'react';
import {
  FieldValues,
  useController,
  UseControllerProps,
} from 'react-hook-form';

type ControlledFormSelectProps<T extends FieldValues> = ComponentProps<
  typeof FormSelect
> &
  UseControllerProps<T>;

export const ControlledFormSelect = <T extends FieldValues>({
  name,
  control,
  ...props
}: ControlledFormSelectProps<T>) => {
  const {
    field,
    fieldState: { error },
  } = useController({
    control,
    name,
  });

  return <FormSelect {...field} {...props} errorMessage={error?.message} />;
};
