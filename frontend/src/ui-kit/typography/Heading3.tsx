import React from 'react';
import Typography from '@mui/material/Typography';
import { SxProps, Theme } from '@mui/material/styles';

interface Heading3Type {
  children: React.ReactNode;
  color?: string;
  sx?: SxProps<Theme>;
  title?: string;
}

export const Heading3 = ({
  children,
  color = 'text.primary',
  sx,
  title,
}: Heading3Type) => (
  <Typography
    variant="h3"
    title={title}
    sx={sx}
    color={color}
    fontSize={{ xs: 28, sm: 40 }}
  >
    {children}
  </Typography>
);
