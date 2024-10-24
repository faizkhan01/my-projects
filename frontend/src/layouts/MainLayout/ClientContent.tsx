'use client';
import { styled } from '@mui/material/styles';
import { AppBar as MuiAppBar, useMediaQuery } from '@mui/material';
import TopNavbar from '@/components/navbar/TopNavbar';
import MobileTopNavBar from '@/components/navbar/MobileTopNavbar';
import Navbar from '@/components/navbar/Navbar';
import SecondaryNavbar from '@/components/navbar/SecondaryNavbar';
import routes from '@/constants/routes';
import { usePathname } from 'next/navigation';
import { Theme } from '@mui/system';
import { ReactNode } from 'react';

const AppBar = styled(MuiAppBar)(() => ({
  backgroundColor: 'transparent',
}));

const MainContent = styled('main')(({ theme }) => ({
  flex: 1,
  background: theme.palette.background.default,
}));

const NavbarContainer = styled('div')(({ theme }) => ({
  display: 'none',

  [theme.breakpoints.up('md')]: {
    display: 'block',
  },
}));

const MobileNavbarContainer = styled('div')(({ theme }) => ({
  display: 'block',

  [theme.breakpoints.up('md')]: {
    display: 'none',
  },
}));

const noNavbar = [routes.SELL.INDEX];
const noPadding = [routes.INDEX];

const ClientContent = ({ children }: { children: ReactNode }) => {
  const pathname = usePathname();
  const isMobile = useMediaQuery((theme: Theme) =>
    theme.breakpoints.down('md'),
  );

  return (
    <>
      {!isMobile && (
        <AppBar
          position="static"
          elevation={0}
          sx={{
            display: {
              xs: 'none',
              md: noNavbar.includes(pathname) ? 'none' : 'block',
            },
          }}
        >
          <NavbarContainer>
            <TopNavbar />
            <Navbar />
            <SecondaryNavbar />
          </NavbarContainer>
        </AppBar>
      )}
      {isMobile && (
        <AppBar
          position="sticky"
          elevation={0}
          sx={{
            display: {
              xs: noNavbar.includes(pathname) ? 'none' : 'block',
              // xs: pathname === '/sell-with-digit-carts' ? 'none' : 'block',
              md: 'none',
            },
            zIndex: (theme) => theme.zIndex.drawer + 1,
          }}
        >
          <MobileNavbarContainer>
            <MobileTopNavBar />
          </MobileNavbarContainer>
        </AppBar>
      )}
      <MainContent
        sx={{
          padding:
            noNavbar.includes(pathname) || noPadding.includes(pathname)
              ? '0'
              : {
                  xs: '0 0 60px 0',
                  md: '20px 0 96px 0',
                },
        }}
      >
        {children}
      </MainContent>
    </>
  );
};

export default ClientContent;
