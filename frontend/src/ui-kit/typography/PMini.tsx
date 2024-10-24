import React from 'react';
import Typography from '@mui/material/Typography';
import { SxProps, Theme } from '@mui/material/styles';

interface PMiniType {
  children: React.ReactNode;
  color?: string;
  sx?: SxProps<Theme>;
  title?: string;
}

export const PMini = ({
  children,
  color = 'text.primary',
  sx,
  title,
}: PMiniType) => (
  <Typography
    variant="body1"
    title={title}
    sx={sx}
    color={color}
    fontSize={12}
    lineHeight={1.333}
  >
    {children}
  </Typography>
);
