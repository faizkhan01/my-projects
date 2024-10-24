import React from 'react';
import Typography from '@mui/material/Typography';
import { SxProps, Theme } from '@mui/material/styles';

interface Heading6Type {
  children: React.ReactNode;
  color?: string;
  sx?: SxProps<Theme>;
  title?: string;
}

export const Heading6 = ({
  children,
  color = 'text.primary',
  sx,
  title,
}: Heading6Type) => (
  <Typography variant="h6" title={title} sx={sx} color={color}>
    {children}
  </Typography>
);
