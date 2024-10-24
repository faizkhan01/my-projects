import React from 'react';
import { styled, SxProps, Theme } from '@mui/material/styles';
import { FormControlLabel, FormGroup, Radio, RadioProps } from '@mui/material';
import { EmptyRadioBtnIcon } from '../../assets/icons/EmptyRadioBtnIcon';
import { FilledRadioBtnIcon } from '../../assets/icons/FilledRadioBtnIcon';

const StyledFormControlLabel = styled(FormControlLabel)(() => ({
  margin: 0,
  padding: 0,
  '& .MuiTypography-root': {
    fontFamily: 'inherit',
    fontSize: 14,
    lineHeight: 1.6,
  },
}));

const StyledRadio = styled(Radio)(({ theme }) => ({
  padding: 0,
  marginRight: '16px',
  width: '24px',
  height: '24px',
  color: theme.palette.text.secondary,
  '&:hover': {
    transition: '0.4s',
    backgroundColor: 'transparent',
    color: theme.palette.primary.main,
  },
}));

type RadioInputProps = {
  value?: string | number;
  label?: string;
  sx?: SxProps<Theme>;
} & Pick<RadioProps, 'checked'>;

export const RadioInput: React.FC<RadioInputProps> = ({
  value,
  label,
  sx,
  checked,
}): JSX.Element => (
  <FormGroup>
    <StyledFormControlLabel
      sx={sx}
      control={
        <StyledRadio
          value={value}
          checked={checked}
          icon={<EmptyRadioBtnIcon />}
          checkedIcon={<FilledRadioBtnIcon />}
        />
      }
      label={label}
    />
  </FormGroup>
);
