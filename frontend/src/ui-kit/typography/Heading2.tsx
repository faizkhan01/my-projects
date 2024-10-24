import React from 'react';
import Typography from '@mui/material/Typography';
import { SxProps, Theme } from '@mui/material/styles';

interface Heading2Type {
  children: React.ReactNode;
  color?: string;
  sx?: SxProps<Theme>;
  title?: string;
}

export const Heading2 = ({
  children,
  color = 'text.primary',
  sx,
  title,
}: Heading2Type) => (
  <Typography
    variant="h2"
    title={title}
    sx={sx}
    color={color}
    fontSize={{ xs: 34, sm: 48 }}
  >
    {children}
  </Typography>
);
