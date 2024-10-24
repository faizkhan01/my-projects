import { ComponentProps } from 'react';
import { FormInput } from '@/ui-kit/inputs';
import {
  FieldValues,
  useController,
  UseControllerProps,
} from 'react-hook-form';
import { Autocomplete } from '@mui/material';
import { CaretDown } from '@phosphor-icons/react';
import useRefundReasons from '@/hooks/queries/useRefundReasons';

interface Props<T extends FieldValues>
  extends UseControllerProps<T>,
    Omit<ComponentProps<typeof FormInput>, 'defaultValue'> {}

type ControlledReturnReasonSelectorType = <T extends FieldValues>(
  p: Props<T>,
) => React.ReactElement<Props<T>>;

const ControlledReturnReasonSelector: ControlledReturnReasonSelectorType = ({
  name,
  control,
  defaultValue,
  rules,
  shouldUnregister,
  ...props
}) => {
  const {
    field,
    fieldState: { error },
  } = useController({
    control,
    name,
    defaultValue,
    rules,
    shouldUnregister,
  });
  const { refundReasons = [] } = useRefundReasons();

  const value =
    refundReasons.find((reason) => reason.id === field.value) || null;

  return (
    <Autocomplete
      value={value}
      onChange={(_event, newValue) => {
        field?.onChange(newValue?.id);
      }}
      sx={{
        width: '100%',
        '& label': {
          size: '12px',
          fontWeight: '600',
          color: '#333E5C',
        },
      }}
      options={refundReasons}
      autoHighlight
      getOptionLabel={(option) => option.name}
      renderInput={(params) => {
        const hasValue =
          params.inputProps['aria-expanded'] === false &&
          params.inputProps['value'];
        return (
          <FormInput
            {...field}
            {...props}
            {...params}
            ref={params.InputProps.ref}
            errorMessage={error?.message}
            sx={{
              '& .MuiAutocomplete-input:hover': {
                cursor: hasValue ? 'pointer' : 'text',
              },
              borderColor: '#96A2C1',
            }}
            endAdornment={<CaretDown size={18} color="#333E5C" />}
          />
        );
      }}
    />
  );
};

export default ControlledReturnReasonSelector;
