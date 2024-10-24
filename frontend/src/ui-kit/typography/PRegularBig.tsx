import React from 'react';
import Typography from '@mui/material/Typography';
import { SxProps, Theme } from '@mui/material/styles';

interface PRegularBigType {
  children: React.ReactNode;
  color?: string;
  sx?: SxProps<Theme>;
  title?: string;
}

export const PRegularBig = ({
  children,
  color = 'text.primary',
  sx,
  title,
}: PRegularBigType) => (
  <Typography
    variant="body2"
    title={title}
    sx={sx}
    color={color}
    fontSize={{ xs: 14, sm: 18 }}
  >
    {children}
  </Typography>
);
