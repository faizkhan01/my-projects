import { Link } from '@mui/material';
import MuiMenuItem, {
  MenuItemProps as MuiMenuItemProps,
} from '@mui/material/MenuItem';
import { styled } from '@mui/material/styles';
import NextLink from 'next/link';

const StyledMenuItem = styled(MuiMenuItem)(({ theme }) => ({
  fontSize: '16px',
  padding: '1rem',
  '&:hover': {
    backgroundColor: 'transparent',
    color: theme.palette.primary.main,
  },

  [theme.breakpoints.down('sm')]: {
    fontSize: '14px',
  },
}));

export type MenuItemProps = MuiMenuItemProps & {
  href?: string | URL;
  target?: string;
};

export const MenuItem = (props: MenuItemProps) => {
  const { children, href, sx, target, ...rest } = props;

  if (href)
    return (
      <StyledMenuItem
        {...rest}
        sx={{
          padding: '0',
          ...sx,
        }}
      >
        <Link
          component={NextLink}
          href={href}
          target={target}
          underline="none"
          color="inherit"
          sx={{
            padding: '1rem',
            display: 'flex',
            width: '100%',
            height: '100%',
          }}
        >
          {children}
        </Link>
      </StyledMenuItem>
    );

  return <StyledMenuItem {...rest}>{children}</StyledMenuItem>;
};
