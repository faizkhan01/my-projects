'use client';
import { ComponentProps } from 'react';
import { styled } from '@mui/material/styles';
import { CircleNotch } from '@/components/icons';

export const Loader = styled((props: ComponentProps<typeof CircleNotch>) => (
  <CircleNotch size={18} {...props} />
))(() => ({
  animation: 'rotation 1s linear infinite',

  '@keyframes rotation': {
    '0%': {
      transform: 'rotate(0deg)',
    },
    '100%': {
      transform: 'rotate(360deg)',
    },
  },
}));
