import React from 'react';
import Typography from '@mui/material/Typography';
import { SxProps, Theme } from '@mui/material/styles';

interface PButtonFixedType {
  children: React.ReactNode;
  color?: string;
  sx?: SxProps<Theme>;
  title?: string;
}

export const PButtonFixed = ({
  children,
  color = 'primary',
  sx,
  title,
}: PButtonFixedType) => (
  <Typography variant="button" title={title} sx={sx} color={color}>
    {children}
  </Typography>
);
