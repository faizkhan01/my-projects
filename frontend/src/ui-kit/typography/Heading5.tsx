import React from 'react';
import Typography from '@mui/material/Typography';
import { SxProps, Theme } from '@mui/material/styles';

interface Heading5Type {
  children: React.ReactNode;
  color?: string;
  sx?: SxProps<Theme>;
  title?: string;
}

export const Heading5 = ({
  children,
  color = 'primary',
  sx,
  title,
}: Heading5Type) => (
  <Typography
    variant="h5"
    title={title}
    sx={sx}
    color={color}
    fontSize={{ xs: 16, sm: 24 }}
    lineHeight={{ xs: 1.625, sm: 1.333 }}
  >
    {children}
  </Typography>
);
