import React from 'react';
import Typography from '@mui/material/Typography';
import { SxProps, Theme } from '@mui/material/styles';

interface PRegularFixedType {
  children: React.ReactNode;
  color?: string;
  sx?: SxProps<Theme>;
  title?: string;
}

export const PRegularFixed = ({
  children,
  color = 'text.primary',
  sx,
  title,
}: PRegularFixedType) => (
  <Typography variant="body1" title={title} sx={sx} color={color}>
    {children}
  </Typography>
);
