import Link from 'next/link';
import { ButtonWithIcon } from '@/ui-kit/buttons';
import { ICON_BUTTON_STYLES, StyledBadge } from './Navbar';
import { HandbagSimple } from '@phosphor-icons/react';
import useCart from '@/hooks/queries/customer/useCart';
import routes from '@/constants/routes';
import { usePathname } from 'next/navigation';

interface NavCartBtnProps {
  variant?: 'default' | 'mobile';
}

const NavCartBtn = ({ variant = 'default' }: NavCartBtnProps) => {
  const pathname = usePathname();
  const { cartArray } = useCart();

  const isInCart = pathname === routes.CART.INDEX;
  const isMobile = variant === 'mobile';

  return (
    <Link href={routes.CART.INDEX} legacyBehavior passHref>
      <ButtonWithIcon
        title={isMobile ? '' : 'Cart'}
        icon={
          <StyledBadge badgeContent={cartArray?.length ?? 0} color="secondary">
            <HandbagSimple
              size={isMobile ? 24 : 28}
              weight={isInCart ? 'fill' : 'regular'}
            />
          </StyledBadge>
        }
        sx={
          isInCart || isMobile
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

export default NavCartBtn;
