import React from 'react';
import Typography from '@mui/material/Typography';
import { SxProps, Theme } from '@mui/material/styles';

interface Heading1Type {
  children: React.ReactNode;
  color?: string;
  sx?: SxProps<Theme>;
  title?: string;
}

export const Heading1 = ({
  children,
  color = 'common.white',
  sx,
  title,
}: Heading1Type) => (
  <Typography
    variant="h1"
    title={title}
    sx={sx}
    color={color}
    fontSize={{ xs: 32, sm: 64 }}
    lineHeight={{ xs: 1.187, sm: 1.2 }}
  >
    {children}
  </Typography>
);
