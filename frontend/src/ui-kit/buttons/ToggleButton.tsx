import { styled } from '@mui/system';
import React, { useState } from 'react';
import { SxProps, Theme } from '@mui/material/styles';
import { Box, Typography } from '@mui/material';
import { SwitchButton } from './SwitchButton';

interface ToggleButtonProps {
  label: string;
  sx?: SxProps<Theme>;
  onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

const SecondarySwitch = styled(Typography)(({ theme }) => ({
  fontStyle: 'normal',
  fontWeight: '400',
  fontSize: '14px',
  lineHeight: '18px',
  color: theme.palette.text.secondary,

  [theme.breakpoints.down('sm')]: {
    fontSize: '12px',
  },
}));

const SwitchBox = styled(Box)(({ theme }) => ({
  width: '170px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  marginTop: '24px',

  [theme.breakpoints.down('sm')]: {
    marginTop: '16px',
  },
}));

export const ToggleButton = ({ label, sx }: ToggleButtonProps) => {
  const [checked, setChecked] = useState(false);

  const handleCheckBox = (event: React.ChangeEvent<HTMLInputElement>) => {
    setChecked(event.target.checked);
  };

  return (
    <Box component="label" sx={sx}>
      <SwitchBox>
        <SecondarySwitch
          style={{
            color: checked ? '#333E5C' : '#96A2C1',
            fontSize: '14px',
          }}
        >
          {label}
        </SecondarySwitch>
        <SwitchButton checked={checked} onChange={handleCheckBox} />
      </SwitchBox>
    </Box>
  );
};
