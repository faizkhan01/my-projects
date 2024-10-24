'use client';
import { forwardRef, ReactNode, useState, ComponentProps } from 'react';
import { styled, SxProps, Theme } from '@mui/material/styles';
import {
  FormControl,
  InputBase,
  InputBaseProps,
  InputBaseComponentProps,
  FormHelperText as MuiFormHelperText,
  IconButton,
  InputAdornment as MuiInputAdornment,
  InputAdornmentProps,
  FormLabel,
} from '@mui/material';
import { Eye, EyeSlash, WarningCircle } from '@phosphor-icons/react';
import { visuallyHidden } from '@mui/utils';
import { InputTypes } from '@/types/input';

export const Input = styled(InputBase)(({ theme, type }) => ({
  border: `1px solid ${theme.palette.text.secondary}`,
  borderRadius: '10px',
  transition: 'border-color 0.4s',
  minHeight: '48px',

  '&.MuiInputBase-adornedStart': {
    paddingLeft: '16px',

    '& .MuiInputBase-input': {
      paddingLeft: '0',
    },
  },

  '&.MuiInputBase-adornedEnd': {
    paddingRight: '16px',
  },

  '& .MuiInputBase-input::-webkit-outer-spin-button, & input::-webkit-inner-spin-button':
    {
      display: 'none',
    },

  '& .MuiInputBase-input[type=number]': {
    MozAppearance: 'textfield',
  },

  '&:hover': {
    borderColor: theme.palette.text.primary,
    transition: 'border-color 0.4s',
  },

  '&.Mui-disabled:hover': {
    borderColor: theme.palette.text.secondary,
  },

  '&.Mui-error': {
    borderColor: theme.palette.error.main,
  },

  '& .MuiInputBase-input': {
    boxSizing: 'border-box',
    padding: '13px 16px 13px 16px',
    /* paddingLeft: startAdornment ? '0' : '16px', */
    /* paddingRight: endAdornment ? '0' : '16px', */
    fontSize: 14,
    color: theme.palette.text.primary,
    background: 'transparent',
    letterSpacing: type === 'password' ? '10px' : 'normal',
    '&::placeholder': {
      color: theme.palette.text.secondary,
      opacity: 1,
      letterSpacing: 'normal',
    },
  },

  // Deletes the X icon on Chrome browsers
  '& ::-webkit-search-decoration, & ::-webkit-search-cancel-button, & ::-webkit-search-results-button, & ::-webkit-search-results-decoration':
    {
      WebkitAppearance: 'none',
    },
}));

const InputAdornment = styled(MuiInputAdornment)(({ theme }) => ({
  color: theme.palette.text.secondary,

  '& .MuiTypography-root': {
    lineHeight: 'initial',
  },
  /* '&.MuiInputAdornment-positionStart': { */
  /*   paddingLeft: '1rem', */
  /* }, */
  /* '&.MuiInputAdornment-positionEnd': { */
  /*   paddingRight: '1rem', */
  /* }, */
}));

export const InputLabel = styled(FormLabel)(({ theme }) => ({
  margin: '0 0 8px 0',
  fontSize: 12,
  lineHeight: 1.333,
  fontWeight: 500,
  color: theme.palette.text.primary,
}));

export const FormHelperText = styled(MuiFormHelperText)(() => ({
  fontSize: 14,
  margin: 0,
  lineHeight: 1.142,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'flex-start',
  gap: '4px',
  marginTop: '8px',
}));

const StyledIconButton = styled(IconButton)(({ theme }) => ({
  padding: 0,
  color: theme.palette.text.primary,
  '&:hover': {
    background: 'none',
    color: theme.palette.primary.main,
  },
}));

export type FormInputProps = {
  id?: string;
  placeholder?: string;
  type?: string;
  sx?: SxProps<Theme>;
  errorMessage?: string;
  startAdornment?: ReactNode;
  startAdornmentProps?: Omit<InputAdornmentProps, 'position'>;
  endAdornment?: ReactNode;
  endAdornmentProps?: Omit<InputAdornmentProps, 'position'>;
  label?: string | ReactNode;
  hideLabel?: boolean;
  disabled?: boolean;
  // InputProps and InputLabelProps are needed to use the
  // Autocomplete component and useAutocomplete
  inputProps?: InputBaseComponentProps;
  InputLabelProps?: ComponentProps<typeof InputLabel>;
  InputProps?: InputBaseProps;
  defaultValue?: string;
  helperText?: ReactNode;
} & Pick<
  InputBaseProps,
  'value' | 'onChange' | 'multiline' | 'rows' | 'minRows' | 'maxRows'
>;

export const FormInput = forwardRef<HTMLInputElement, FormInputProps>(
  (
    {
      id,
      placeholder,
      type = 'text',
      sx,
      errorMessage,
      onChange,
      value,
      defaultValue,
      label,
      startAdornment,
      startAdornmentProps,
      endAdornment,
      endAdornmentProps,
      hideLabel = false,
      inputProps,
      InputLabelProps,
      InputProps,
      multiline,
      rows,
      minRows,
      maxRows,
      disabled = false,
      helperText,
    },
    ref,
  ) => {
    const [inputType, setInputType] = useState<string>(type);
    const isPasswordInputType = type === InputTypes.PASSWORD;

    const handleInputTypeChange = () => {
      if (inputType === InputTypes.PASSWORD) {
        setInputType(InputTypes.TEXT);
      } else {
        setInputType(InputTypes.PASSWORD);
      }
    };

    const inputId = `form-input-${id}`;
    const helperId = `form-input-helper-${id}`;

    const isHelperOpen = Boolean(errorMessage || helperText);

    const inputStart = InputProps?.startAdornment ?? startAdornment;

    return (
      <FormControl
        sx={{
          width: '100%',
          ...sx,
        }}
        error={!!errorMessage}
        disabled={disabled}
      >
        <InputLabel
          htmlFor={inputId}
          sx={hideLabel ? visuallyHidden : {}}
          {...InputLabelProps}
        >
          {label}
        </InputLabel>
        <Input
          inputProps={inputProps}
          {...InputProps}
          id={inputId}
          aria-describedby={isHelperOpen ? helperId : undefined}
          placeholder={placeholder}
          type={inputType}
          inputRef={ref}
          onChange={onChange}
          startAdornment={
            inputStart ? (
              Array.isArray(inputStart) ? (
                inputStart
              ) : (
                <InputAdornment position="start" {...startAdornmentProps}>
                  {InputProps?.startAdornment ?? startAdornment}
                </InputAdornment>
              )
            ) : null
          }
          endAdornment={
            Boolean(endAdornment || isPasswordInputType) && (
              <InputAdornment position="end" {...endAdornmentProps}>
                {endAdornment ||
                  (isPasswordInputType && (
                    <StyledIconButton onClick={handleInputTypeChange}>
                      {inputType === InputTypes.TEXT ? (
                        <Eye size={18} />
                      ) : (
                        <EyeSlash size={18} />
                      )}
                    </StyledIconButton>
                  ))}
              </InputAdornment>
            )
          }
          value={value}
          defaultValue={defaultValue}
          rows={rows}
          multiline={multiline}
          minRows={minRows}
          maxRows={maxRows}
        />
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

FormInput.displayName = 'FormInput';
