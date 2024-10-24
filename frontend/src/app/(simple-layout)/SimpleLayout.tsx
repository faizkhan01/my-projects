'use client';
import { CustomContainer } from '@/ui-kit/containers';
import Logo from '@/assets/icons/Logo';
import { styled } from '@mui/material/styles';
import Link from 'next/link';
import React, { ReactNode } from 'react';

const NavbarContainer = styled('nav')(() => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  paddingTop: '40px',
  paddingBlock: '40px',
}));

const SimpleLayout = ({ children }: { children: ReactNode }) => {
  return (
    <>
      <CustomContainer>
        <NavbarContainer>
          <Link href="/" aria-label="Go Home">
            <Logo variant="original" height={24} width={144} />
          </Link>
        </NavbarContainer>
      </CustomContainer>
      <main>{children}</main>
    </>
  );
};

export default SimpleLayout;
