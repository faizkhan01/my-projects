import MuiSwitch, { SwitchProps } from '@mui/material/Switch';
import { styled } from '@mui/material/styles';
import { forwardRef } from 'react';
import { FormControlLabel, FormControlLabelProps } from '@mui/material';
import { ReactNode } from 'react';
import { FormHelperText } from './FormInput';

const Switch = styled(MuiSwitch)(() => ({
  width: 30,
  height: 18,
  padding: 0,
}));

interface FormSwitchProps extends SwitchProps {
  label: ReactNode;
  helperText?: ReactNode;
  errorMessage?: string;
  labelPlacement?: FormControlLabelProps['labelPlacement'];
}

export const FormSwitch = forwardRef<HTMLButtonElement, FormSwitchProps>(
  function FormSwitch(
    {
      label,
      helperText,
      labelPlacement,
      errorMessage,
      ...props
    }: FormSwitchProps,
    ref,
  ) {
    return (
      <>
        <FormControlLabel
          label={label}
          control={<Switch {...props} ref={ref} />}
          labelPlacement={labelPlacement}
          sx={{
            margin: '0px',
            gap: '8px',
          }}
        />

        {(!!errorMessage || helperText) && (
          <FormHelperText error={!!errorMessage}>
            {errorMessage ? errorMessage : helperText}
          </FormHelperText>
        )}
      </>
    );
  },
);
