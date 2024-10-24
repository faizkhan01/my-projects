import React from 'react';
import Typography from '@mui/material/Typography';
import { SxProps, Theme } from '@mui/material/styles';

interface PRegularType {
  children: React.ReactNode;
  color?: string;
  sx?: SxProps<Theme>;
  title?: string;
}

export const PRegular = ({
  children,
  color = 'text.primary',
  sx,
  title,
}: PRegularType) => (
  <Typography
    variant="body1"
    title={title}
    sx={sx}
    color={color}
    fontSize={{ xs: 12, sm: 14 }}
    lineHeight={{ xs: 1.333, sm: 1.142 }}
  >
    {children}
  </Typography>
);
