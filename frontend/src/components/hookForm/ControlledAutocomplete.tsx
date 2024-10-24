import { FormInput, FormInputProps } from '@/ui-kit/inputs';
import { Autocomplete, AutocompleteProps } from '@mui/material';
import { CaretDown } from '@phosphor-icons/react';
import {
  FieldValues,
  useController,
  UseControllerProps,
} from 'react-hook-form';

type ControlledAutocompleteProps<
  A,
  Multiple extends boolean | undefined,
  DisableClearable extends boolean | undefined,
  FreeSolo extends boolean | undefined,
  T extends FieldValues,
> = AutocompleteProps<A, Multiple, DisableClearable, FreeSolo> &
  UseControllerProps<T> &
  FormInputProps;

export const ControlledAutocomplete = <
  A,
  Multiple extends boolean | undefined,
  DisableClearable extends boolean | undefined,
  FreeSolo extends boolean | undefined,
  T extends FieldValues,
>({
  name,
  control,
  label,
  placeholder,
  helperText,
  ...props
}: Omit<
  ControlledAutocompleteProps<A, Multiple, DisableClearable, FreeSolo, T>,
  'renderInput'
>) => {
  const {
    field,
    fieldState: { error },
  } = useController({ name, control });

  return (
    <Autocomplete
      {...field}
      onChange={(_, value) => {
        field.onChange?.(value);
      }}
      {...props}
      renderInput={(params) => {
        const hasValue =
          params.inputProps['aria-expanded'] === false &&
          params.inputProps['value'];
        const disabled = params?.disabled;

        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { onChange, ...rest } = field;

        return (
          <FormInput
            {...params}
            {...rest}
            ref={params.InputProps.ref}
            errorMessage={error?.message}
            label={label}
            placeholder={placeholder}
            helperText={helperText}
            sx={{
              ...(!disabled && {
                '& .MuiAutocomplete-input:hover': {
                  cursor: hasValue && !props.freeSolo ? 'pointer' : 'text',
                },
              }),
            }}
            endAdornment={
              disabled || props?.freeSolo ? null : (
                <CaretDown size={18} color="#333E5C" />
              )
            }
          />
        );
      }}
    />
  );
};
