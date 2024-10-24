import { ComponentProps, useMemo } from 'react';
import { FormInput } from '@/ui-kit/inputs';
import {
  FieldValues,
  useController,
  UseControllerProps,
} from 'react-hook-form';
import { Autocomplete, Box } from '@mui/material';
import { CaretDown } from '@phosphor-icons/react';
import useCountryStates from '@/hooks/queries/useCountryStates';
import { omit } from 'lodash';

interface Props<T extends FieldValues>
  extends UseControllerProps<T>,
    Omit<ComponentProps<typeof FormInput>, 'defaultValue'> {
  countryId: number | null;
}

type ControlledStateSelectorType = <T extends FieldValues>(
  p: Props<T>,
) => React.ReactElement<Props<T>>;

const ControlledStateSelector: ControlledStateSelectorType = ({
  countryId,
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
  const { states = [], isLoading } = useCountryStates(
    countryId ? countryId : 0,
  );
  const value = useMemo(
    () => states.find((state) => state.id === field.value) || null,
    [states, field.value],
  );
  return (
    <Autocomplete
      value={value}
      options={states}
      loading={isLoading}
      getOptionLabel={(option) => option.name}
      // onChange is required to can update the form
      onChange={(_event, value) => {
        field.onChange(value?.id);
      }}
      renderInput={(params) => {
        const hasValue =
          params.inputProps['aria-expanded'] === false &&
          params.inputProps['value'];

        return (
          <FormInput
            {...omit(field, ['onChange'])}
            {...props}
            {...params}
            ref={params.InputProps.ref}
            errorMessage={error?.message}
            sx={{
              '& .MuiAutocomplete-input:hover': {
                cursor: hasValue ? 'pointer' : 'text',
              },
            }}
            endAdornment={<CaretDown size={18} color="#333E5C" />}
          />
        );
      }}
      blurOnSelect
      renderOption={(props, option) => {
        return (
          <Box component="li" {...props}>
            {option.name}
          </Box>
        );
      }}
    />
  );
};

export default ControlledStateSelector;
