import { FC } from 'react';
import Link from 'next/link';
import { styled } from '@mui/material/styles';
import Badge, { BadgeProps } from '@mui/material/Badge';
import { CustomContainer } from '@/ui-kit/containers';
import NavUserBtn from './NavUserBtn';
import NavWishBtn from './NavWishBtn';
import NavbarSearch from './NavbarSearch';
import NavCatalogBtn from './NavCatalogBtn';
import NavCartBtn from './NavCartBtn';
import Logo from '@/assets/icons/Logo';

export const StyledBadge = styled(Badge)<BadgeProps>(({ theme }) => ({
  '& .MuiBadge-badge': {
    top: 5,
    left: 5,
    border: `2px solid ${theme.palette.background.paper}`,
    width: '16px',
    height: '16px',
    padding: '10px',
    borderRadius: '50%',
    [theme.breakpoints.down('sm')]: {
      padding: '8px',
    },
  },
}));

export const ICON_BUTTON_STYLES = {
  padding: 0,
  color: 'text.primary',
  '& p': {
    color: 'text.primary',
  },
  '&:hover': {
    transition: '0.4s',
    color: 'primary.main',
    backgroundColor: 'transparent',
    '& p': {
      transition: '0.4s',
      color: 'primary.main',
    },
  },
};

const Navbar: FC = () => {
  return (
    <div className="bg-white">
      <CustomContainer>
        <div className="mb-[34px] pt-9">
          <div className="flex items-center justify-between">
            <div className="flex w-full flex-row gap-6">
              <Link className="mt-[7px]" href="/" aria-label="Go Home">
                <Logo />
              </Link>
              <div className="hidden lg:block">
                <NavCatalogBtn />
              </div>
              <NavbarSearch />
            </div>
            <div className="ml-4 flex items-center justify-between gap-4 lg:ml-[37px] lg:gap-10">
              <NavUserBtn />
              <NavWishBtn />
              <NavCartBtn />
            </div>
          </div>
        </div>
      </CustomContainer>
    </div>
  );
};

export default Navbar;
