import React from 'react';
import { Container, ContainerProps } from '@mui/material';

type CustomContainerProps = ContainerProps & {
  disableMobilePadding?: boolean;
  disableMediumPadding?: boolean;
  disableLargePadding?: boolean;
};

export const CustomContainer: React.FC<CustomContainerProps> = ({
  disableMobilePadding,
  disableMediumPadding,
  disableLargePadding,
  sx,
  ...props
}): JSX.Element => (
  <Container
    maxWidth={'xl'}
    disableGutters
    sx={{
      padding: {
        xs: disableMobilePadding ? '0' : '0 16px',
        md: disableMediumPadding ? '0' : '0 40px',
        lg: disableLargePadding ? '0' : '0 80px',
      },
      ...sx,
    }}
    {...props}
  />
);
