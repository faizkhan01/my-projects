import { ComponentProps } from 'react';
import {
  useController,
  UseControllerProps,
  FieldValues,
} from 'react-hook-form';
import { CheckCircle } from '@/components/icons';
import { FormInput } from '@/ui-kit/inputs';
import { Loader } from '@/ui-kit/adornments';

type ControlledFormInputProps<T extends FieldValues> = {
  async?: 'loading' | 'success';
} & ComponentProps<typeof FormInput> &
  UseControllerProps<T>;

const ControlledFormInput = <T extends FieldValues>({
  name,
  control,
  async,
  ...props
}: ControlledFormInputProps<T>) => {
  const {
    field,
    fieldState: { error },
  } = useController({ control, name });

  const renderAdornment = () => {
    switch (async) {
      case 'loading':
        return <Loader size={18} />;
      case 'success':
        return <CheckCircle size={18} weight="fill" color="#00D000" />;
      default:
        return null;
    }
  };

  return (
    <FormInput
      endAdornment={renderAdornment()}
      errorMessage={error?.message}
      {...field}
      {...props}
    />
  );
};

export default ControlledFormInput;
