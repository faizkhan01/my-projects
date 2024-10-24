'use client';
import { styled } from '@mui/material/styles';
import Link from 'next/link';
import { Box, Button, LinkProps, Link as MuiLink } from '@mui/material';

export const HeaderButton = styled(Button)(({ theme }) => ({
  fontWeight: 400,

  [theme.breakpoints.down('sm')]: {
    fontSize: '16px',
    minWidth: 'auto',
  },
}));

export const ReviewContainer = styled(
  (props: LinkProps & { href: URL | string }) => (
    <MuiLink {...props} component={Link} underline="hover" />
  ),
)<LinkProps>(({ theme }) => ({
  color: theme.palette.primary.main,
  marginLeft: '4px',

  [theme.breakpoints.down('sm')]: {
    color: theme.palette.primary.main,
    marginLeft: '9.69px',
    display: 'flex',
    gap: '1px',
    fontSize: '12px',
  },
}));

export const RatingContainer = styled(Box)(({ theme }) => ({
  display: 'inline-flex',
  alignItems: 'center',

  [theme.breakpoints.down('sm')]: {
    display: 'inline-flex',
    alignItems: 'center',
  },
}));
