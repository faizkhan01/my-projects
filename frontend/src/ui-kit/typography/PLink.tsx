import React from 'react';
import Typography from '@mui/material/Typography';
import { SxProps, Theme } from '@mui/material/styles';

interface PLinkType {
  children: React.ReactNode;
  color?: string;
  sx?: SxProps<Theme>;
  title?: string;
}

export const PLink = ({
  children,
  color = 'primary.main',
  sx,
  title,
}: PLinkType) => (
  <Typography
    variant="body1"
    title={title}
    sx={{
      cursor: 'pointer',
      textDecoration: 'underline',
      '&:hover': {
        transition: '0.4s',
        color: 'primary.dark',
      },
      ...sx,
    }}
    color={color}
  >
    {children}
  </Typography>
);
