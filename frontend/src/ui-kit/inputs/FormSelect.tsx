import {
  FormControl,
  Select,
  SelectProps,
  SxProps,
  Theme,
} from '@mui/material';
import { CaretDown, WarningCircle } from '@phosphor-icons/react';
import { forwardRef, useState } from 'react';
import { FormHelperText, Input, InputLabel } from './FormInput';

interface FormSelectProps {
  id: string;
  errorMessage?: string;
  helperText?: string;
  disabled?: boolean;
  label?: React.ReactNode;
  children: React.ReactNode;
  sx?: SxProps<Theme>;
  SelectProps?: SelectProps;
  value?: SelectProps['value'];
  onChange?: SelectProps['onChange'];
  onBlur?: SelectProps['onBlur'];
}

export const FormSelect = forwardRef<HTMLSelectElement, FormSelectProps>(
  (
    {
      id,
      errorMessage,
      helperText,
      disabled,
      children,
      sx,
      SelectProps,
      label,
      value,
      onChange,
      onBlur,
    },
    ref,
  ) => {
    const [open, setOpen] = useState(false);
    const inputId = `form-select-${id}`;
    const helperId = `form-select-helper-${id}`;

    const isHelperOpen = Boolean(errorMessage || helperText);

    return (
      <FormControl
        sx={{
          width: '100%',
          ...sx,
        }}
        disabled={disabled}
        error={!!errorMessage}
      >
        <InputLabel>{label}</InputLabel>
        <Select
          {...SelectProps}
          id={inputId}
          inputRef={ref}
          input={<Input className="pr-0" />}
          IconComponent={CaretDown}
          classes={{ select: 'py-0' }}
          open={open}
          onOpen={() => setOpen(true)}
          onClose={() => setOpen(false)}
          sx={{
            ...(open && {
              borderRadius: '10px 10px 0 0 !important',
            }),
            ...SelectProps?.sx,
          }}
          value={value}
          onChange={onChange}
          onBlur={onBlur}
        >
          {children}
        </Select>

        {isHelperOpen && (
          <FormHelperText id={helperId} error={!!errorMessage}>
            {!!errorMessage && <WarningCircle weight="fill" />}
            {errorMessage || helperText}
          </FormHelperText>
        )}
      </FormControl>
    );
  },
);

FormSelect.displayName = 'FormSelect';
