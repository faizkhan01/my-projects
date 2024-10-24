import React from 'react';
import Typography from '@mui/material/Typography';
import { SxProps, Theme } from '@mui/material/styles';

interface PLittleType {
  children: React.ReactNode;
  color?: string;
  sx?: SxProps<Theme>;
  title?: string;
  component?: React.ElementType;
}

export const PLittle = ({
  children,
  color = 'text.primary',
  sx,
  title,
  component = 'p',
}: PLittleType) => (
  <Typography
    variant="body1"
    title={title}
    sx={sx}
    color={color}
    lineHeight={1}
    component={component}
  >
    {children}
  </Typography>
);
