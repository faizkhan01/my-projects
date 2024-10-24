import React from 'react';
import Typography from '@mui/material/Typography';
import { SxProps, Theme } from '@mui/material/styles';

interface PButtonType {
  children: React.ReactNode;
  color?: string;
  sx?: SxProps<Theme>;
  title?: string;
}

export const PButton = ({
  children,
  color = 'primary',
  sx,
  title,
}: PButtonType) => (
  <Typography
    variant="button"
    title={title}
    sx={sx}
    color={color}
    fontSize={{ xs: 14, sm: 18 }}
    lineHeight={{ xs: 1.714, sm: 1.333 }}
  >
    {children}
  </Typography>
);
