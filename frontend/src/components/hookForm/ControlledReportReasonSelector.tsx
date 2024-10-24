import { ComponentProps } from 'react';
import { FormInput } from '@/ui-kit/inputs';
import {
  FieldValues,
  useController,
  UseControllerProps,
} from 'react-hook-form';
import { Autocomplete } from '@mui/material';
import { CaretDown } from '@phosphor-icons/react';
import { type ReportReason } from '@/types/productReports';

interface Props<T extends FieldValues>
  extends UseControllerProps<T>,
    Omit<ComponentProps<typeof FormInput>, 'defaultValue'> {
  reasons: ReportReason[];
}

type ControlledReportReasonSelectorType = <T extends FieldValues>(
  p: Props<T>,
) => React.ReactElement<Props<T>>;

const ControlledReportReasonSelector: ControlledReportReasonSelectorType = ({
  name,
  control,
  defaultValue,
  rules,
  shouldUnregister,
  reasons,
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

  const value = reasons.find((reason) => reason.id === field.value) || null;

  return (
    <Autocomplete
      value={value}
      sx={{
        width: '100%',
        '& label': {
          color: '#96A2C1',
          fontWeight: '600',
        },
      }}
      options={reasons}
      autoHighlight
      getOptionLabel={(option) => option.name}
      onChange={(_event, value) => field.onChange(value?.id)}
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

export default ControlledReportReasonSelector;
