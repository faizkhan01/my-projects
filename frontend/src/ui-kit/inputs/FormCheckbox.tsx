import { ReactNode, ComponentProps, forwardRef } from 'react';
import { styled, SxProps, Theme } from '@mui/material/styles';
import {
  FormControlLabel,
  FormGroup,
  Checkbox,
  CheckboxProps,
} from '@mui/material';
import { EmptyCheckboxIcon } from '../../assets/icons/EmptyCheckboxIcon';
import { FilledCheckboxIcon } from '../../assets/icons/FilledCheckboxIcon';

interface StyledCheckboxProps extends CheckboxProps {
  error?: boolean;
}

const StyledFormControlLabel = styled(FormControlLabel)(() => ({
  margin: 0,
  padding: 0,
  '& .MuiTypography-root': {
    fontFamily: 'inherit',
    fontSize: 14,
    lineHeight: 1.142,
  },
}));

const StyledCheckbox = styled(Checkbox, {
  shouldForwardProp: (prop) => prop !== 'error',
})<StyledCheckboxProps>(({ theme, error }) => ({
  padding: 0,
  marginRight: '8px',
  width: '18px',
  height: '18px',
  color: error ? theme.palette.secondary.main : theme.palette.text.secondary,
  '&:hover': {
    transition: '0.4s',
    backgroundColor: 'transparent',
    color: theme.palette.primary.main,
  },
}));

type FormCheckboxProps = {
  label?: ReactNode;
  sx?: SxProps<Theme>;
  error?: boolean;
} & Pick<
  ComponentProps<typeof StyledCheckbox>,
  'onChange' | 'value' | 'checked' | 'indeterminate' | 'disabled'
>;

export const FormCheckbox = forwardRef<HTMLInputElement, FormCheckboxProps>(
  (
    {
      label,
      sx,
      onChange,
      error = false,
      value,
      disabled,
      indeterminate,
      checked,
    },
    ref,
  ) => (
    <FormGroup>
      <StyledFormControlLabel
        sx={sx}
        control={
          <StyledCheckbox
            icon={<EmptyCheckboxIcon />}
            checkedIcon={<FilledCheckboxIcon />}
            onChange={onChange}
            error={error}
            inputRef={ref}
            value={value}
            disabled={disabled}
            indeterminate={indeterminate}
            checked={checked}
          />
        }
        label={label}
      />
    </FormGroup>
  ),
);

FormCheckbox.displayName = 'FormCheckbox';
