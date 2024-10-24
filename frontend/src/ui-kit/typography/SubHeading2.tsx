import React from 'react';
import Typography from '@mui/material/Typography';
import { SxProps, Theme } from '@mui/material/styles';

interface SubHeading2Type {
  children: React.ReactNode;
  color?: string;
  sx?: SxProps<Theme>;
  title?: string;
  component?: React.ElementType;
}

export const SubHeading2 = ({
  children,
  color = 'text.primary',
  sx,
  title,
  component = 'h6',
}: SubHeading2Type) => (
  <Typography
    variant="subtitle2"
    title={title}
    sx={sx}
    color={color}
    fontSize={{ xs: 14, sm: 16 }}
    lineHeight={{ xs: 1.125, sm: 1.125 }}
    component={component}
  >
    {children}
  </Typography>
);
