import { ComponentProps } from 'react';
import {
  useController,
  UseControllerProps,
  FieldValues,
} from 'react-hook-form';
import { FormCheckbox } from '@/ui-kit/inputs';

type ControlledFormCheckboxProps<T extends FieldValues> = ComponentProps<
  typeof FormCheckbox
> &
  UseControllerProps<T>;

const ControlledFormCheckbox = <T extends FieldValues>({
  control,
  name,
  ...props
}: ControlledFormCheckboxProps<T>) => {
  const {
    field,
    fieldState: { error },
  } = useController({ control, name });

  return <FormCheckbox error={Boolean(error)} {...field} {...props} />;
};

export default ControlledFormCheckbox;
