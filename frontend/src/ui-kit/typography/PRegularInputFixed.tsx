import React from 'react';
import Typography from '@mui/material/Typography';
import { SxProps, Theme } from '@mui/material/styles';

interface PRegularInputFixedType {
  children: React.ReactNode;
  color?: string;
  sx?: SxProps<Theme>;
  title?: string;
}

export const PRegularInputFixed = ({
  children,
  color = 'text.primary',
  sx,
  title,
}: PRegularInputFixedType) => (
  <Typography
    variant="body1"
    title={title}
    sx={sx}
    color={color}
    lineHeight="1.571"
  >
    {children}
  </Typography>
);
