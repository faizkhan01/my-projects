'use client';
import InputBase from '@mui/material/InputBase';
import ButtonBase from '@mui/material/ButtonBase';
import { styled } from '@mui/material/styles';

export const SubscribeInput = styled(InputBase)(({ theme }) => ({
  paddingLeft: '16px',
  borderRadius: '6px 0 0 6px',
  transition: 'all 0.3s ease',
  backgroundColor: '#403ADC',
  color: theme.palette.common.white,

  '& > input': {
    padding: '1px',
  },

  ':placeholder': {
    // TODO: Add your placeholder styles here
  },

  ':focus-within': {
    outline: `1px solid ${theme.palette.common.white}`,
  },
}));

export const SubscribeButton = styled(ButtonBase)(({ theme }) => ({
  padding: '13px 15px 13px 14px',
  backgroundColor: theme.palette.common.white,
  color: theme.palette.primary.main,
  height: '100%',
  borderRadius: '0 6px 6px 0',
  fontSize: '18px',
  fontWeight: 600,
  outline: `1px solid ${theme.palette.common.white}`,
  transition: 'all 0.3s ease',

  ':hover': {
    color: theme.palette.primary.dark,
  },
}));
