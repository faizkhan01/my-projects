import Link from 'next/link';
import { ButtonWithIcon } from '@/ui-kit/buttons';
import useWishlist from '@/hooks/queries/customer/useWishlist';
import { ICON_BUTTON_STYLES, StyledBadge } from './Navbar';
import routes from '@/constants/routes';
import { Heart } from '@phosphor-icons/react';
import { usePathname } from 'next/navigation';

interface NavWishBtnProps {
  variant?: 'default' | 'mobile';
}

const NavWishBtn = ({ variant = 'default' }: NavWishBtnProps) => {
  const pathname = usePathname();
  const { wishlistArray } = useWishlist();
  const isInWishlist = pathname === routes.WISHLIST.INDEX;

  const isMobile = variant === 'mobile';

  return (
    <Link href={routes.WISHLIST.INDEX} legacyBehavior passHref>
      <ButtonWithIcon
        title={isMobile ? '' : 'Wishlist'}
        aria-label={isMobile ? 'Go To Wishlist' : undefined}
        icon={
          <StyledBadge
            badgeContent={wishlistArray?.length ?? 0}
            color="secondary"
          >
            <Heart
              size={isMobile ? 24 : 28}
              weight={isInWishlist ? 'fill' : 'regular'}
            />
          </StyledBadge>
        }
        sx={
          isInWishlist || isMobile
            ? {
                ...ICON_BUTTON_STYLES,
                color: 'primary.main',
                '& p': {
                  color: 'primary.main',
                },
              }
            : ICON_BUTTON_STYLES
        }
      />
    </Link>
  );
};

export default NavWishBtn;
