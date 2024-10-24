import React from 'react';
import Typography from '@mui/material/Typography';
import { SxProps, Theme } from '@mui/material/styles';

interface Heading4Type {
  children: React.ReactNode;
  color?: string;
  sx?: SxProps<Theme>;
  title?: string;
}

export const Heading4 = ({
  children,
  color = 'tex.primary',
  sx,
  title,
}: Heading4Type) => (
  <Typography
    variant="h4"
    title={title}
    sx={sx}
    color={color}
    fontSize={{ xs: 28, sm: 32 }}
  >
    {children}
  </Typography>
);
