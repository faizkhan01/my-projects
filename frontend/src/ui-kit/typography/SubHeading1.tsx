import React from 'react';
import Typography from '@mui/material/Typography';
import { SxProps, Theme } from '@mui/material/styles';

interface SubHeading1Type {
  children: React.ReactNode;
  color?: string;
  sx?: SxProps<Theme>;
  title?: string;
}

export const SubHeading1 = ({
  children,
  color = 'text.primary',
  sx,
  title,
}: SubHeading1Type) => (
  <Typography
    variant="subtitle1"
    title={title}
    sx={sx}
    color={color}
    fontSize={{ xs: 14, sm: 16 }}
    lineHeight={{ xs: 1.428, sm: 1.1375 }}
  >
    {children}
  </Typography>
);
