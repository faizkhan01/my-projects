import React from 'react';
import Typography from '@mui/material/Typography';
import { SxProps, Theme } from '@mui/material/styles';

interface PBoldType {
  children: React.ReactNode;
  color?: string;
  sx?: SxProps<Theme>;
  title?: string;
}

export const PBold = ({
  children,
  color = 'text.primary',
  sx,
  title,
}: PBoldType) => (
  <Typography
    variant="body1"
    title={title}
    sx={sx}
    color={color}
    fontSize={{ xs: 12, sm: 14 }}
    lineHeight={1.2}
    fontWeight={500}
  >
    {children}
  </Typography>
);
