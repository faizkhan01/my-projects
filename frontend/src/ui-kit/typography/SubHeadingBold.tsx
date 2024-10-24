import React from 'react';
import Typography from '@mui/material/Typography';
import { SxProps, Theme } from '@mui/material/styles';

interface SubHeadingBoldType {
  children: React.ReactNode;
  color?: string;
  sx?: SxProps<Theme>;
  title?: string;
}

export const SubHeadingBold = ({
  children,
  color = 'text.primary',
  sx,
  title,
}: SubHeadingBoldType) => (
  <Typography
    variant="subtitle2"
    title={title}
    sx={sx}
    color={color}
    fontSize={{ xs: 14, sm: 16 }}
    lineHeight={{ xs: 1.214, sm: 1.187 }}
    fontWeight={500}
  >
    {children}
  </Typography>
);
