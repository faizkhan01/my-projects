'use client';
import { styled } from '@mui/material/styles';

interface MobileHeadingProps {
  title: string;
}

const MobileMainHeading = styled('h2')(({ theme }) => ({
  [theme.breakpoints.down('md')]: {
    fontWeight: '600',
    fontSize: '28px',
    lineHeight: '33px',
    margin: '22px 0px',
    color: theme.palette.text.primary,
  },

  [theme.breakpoints.up('md')]: {
    display: 'none',
  },
}));

export const MobileHeading = ({ title }: MobileHeadingProps) => {
  return <MobileMainHeading>{title}</MobileMainHeading>;
};
