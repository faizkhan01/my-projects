import { Box, IconButton, ButtonProps } from '@mui/material';
import { SxProps, Theme } from '@mui/material/styles';
import { ReactNode, forwardRef } from 'react';
import { PLittle } from '../typography';

type ButtonWithIconType = {
  title?: string | number;
  sx?: SxProps<Theme>;
  icon?: ReactNode;
  iconColor?: string;
  iconHoverColor?: string;
} & ButtonProps;

export const ButtonWithIcon = forwardRef<HTMLButtonElement, ButtonWithIconType>(
  (
    {
      title,
      sx,
      icon,
      onClick,
      iconColor = 'primary.main',
      iconHoverColor = 'primary.dark',
      ...props
    },
    ref,
  ) => (
    <IconButton
      disableRipple
      onClick={onClick}
      sx={{
        padding: '4px',
        color: iconColor,
        transition: '0.4s',
        '&:hover': {
          color: iconHoverColor,
          backgroundColor: 'transparent',
        },
        ...sx,
      }}
      ref={ref}
      {...props}
    >
      <Box
        sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}
        component="span"
      >
        <>
          {icon && icon}
          {title && <PLittle component="span">{title}</PLittle>}
        </>
      </Box>
    </IconButton>
  ),
);

ButtonWithIcon.displayName = 'ButtonWithIcon';
