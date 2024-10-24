'use client';
import { useCallback, useMemo, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { styled } from '@mui/material/styles';
import { IconButton, Typography, Link as MuiLink } from '@mui/material';
import dynamic from 'next/dynamic';
import { Heart, DotsThree, Star } from '@phosphor-icons/react';
import useMenu from '@/hooks/useMenu';
import { ContainedButton, OutlinedButton } from '@/ui-kit/buttons';
import { type MenuProps, MenuItem } from '@/ui-kit/menu';
import type { Product } from '@/types/products';
import routes from '@/constants/routes';
import { useWishlistActions } from '@/hooks/wishlist/useWishlistActions';
import { useCartActions } from '@/hooks/cart/useCartActions';
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import { LoadingBackdrop } from '@/ui-kit/backdrops';
import { useRouter } from 'next/navigation';
import { cx } from 'cva';
import { calculatePrice, formatPrice } from '@/utils/currency';

export interface ProductCardProps {
  product: Product;
  isWish: boolean;
  isCart: boolean;
  isFreeShipping: boolean;
  size?: 'medium' | 'large';
  currency: string;
  exchangeRate: number;
}

const SimilarProductsModal = dynamic(
  () => import('../modals/products/SimilarProductsModal'),
  {
    ssr: false,
    loading: () => <LoadingBackdrop open={true} />,
  },
);

const ProductOptionsModal = dynamic(
  () => import('../modals/products/ProductOptionsModal'),
  {
    ssr: false,
    loading: () => <LoadingBackdrop open={true} />,
  },
);

const Menu = dynamic<MenuProps>(
  () => import('@/ui-kit/menu').then((mod) => mod.Menu),
  {
    ssr: false,
  },
);

const ProductsCardBadge = ({
  children,
  error,
}: {
  children: React.ReactNode;
  error?: boolean;
}) => {
  return (
    <span
      className={cx(
        'rounded-sm bg-text-primary px-2 py-[3px] text-xs text-white sm:text-sm',
        error && '!bg-error-main',
      )}
    >
      {children}
    </span>
  );
};

const ProductImageContainer = ({
  children,
  size,
}: {
  children: React.ReactNode;
  size: ProductCardProps['size'];
}) => {
  return (
    <div
      className={cx(
        'relative mb-4 h-[164px] w-full min-w-[auto] overflow-hidden rounded-[10px] bg-[#F6F9FF]',
        size === 'medium'
          ? 'sm:h-[218px] sm:min-w-[218px]'
          : 'sm:h-[270px] sm:min-w-[270px]',
      )}
    >
      {children}
    </div>
  );
};

const ProductOption = styled(IconButton)(({ theme }) => ({
  color: theme.palette.text.primary,
  padding: '0',
  transition: 'color 0.4s',
}));

const ProductCard = ({
  product,
  isWish,
  isCart,
  size = 'medium',
  isFreeShipping,
  currency = 'USD',
  exchangeRate = 1,
}: ProductCardProps): JSX.Element => {
  const {
    handleClick: handleClickMenu,
    handleClose: handleCloseMenu,
    open: openMenu,
    anchorEl: anchorElMenu,
    menuId,
    buttonId,
  } = useMenu();
  const [isOpenOptions, setIsOpenOptions] = useState({
    firstOpen: false,
    open: false,
  });
  const [isOpenSimilar, setIsOpenSimilar] = useState({
    firstOpen: false,
    open: false,
  });
  const { addWishlist, removeWishlist } = useWishlistActions();
  const { addToCart } = useCartActions();
  const { push } = useRouter();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const hasStock = Boolean(product.stock);
  const showBadge = Boolean(product.discount > 0 || isFreeShipping) && hasStock;

  const { price, originalPrice } = useMemo(() => {
    const prices = calculatePrice({
      price: product.price,
      discount: product.discount,
      exchangeRate,
    });

    const price = formatPrice(prices.total, { currency });

    const originalPrice = formatPrice(prices.subtotal, { currency });

    return {
      originalPrice,
      price,
    };
  }, [currency, exchangeRate, product.discount, product.price]);
  const roundedRating = Math.round(product.rating ?? 0);

  const addProductToCart = useCallback(async () => {
    if (!isCart) {
      await addToCart(product);
    }
  }, [addToCart, isCart, product]);

  const addToWishList = useCallback(
    async (product: Product) => {
      await addWishlist(product);
    },
    [addWishlist],
  );
  const removeFromWishList = useCallback(
    async (product: Product) => {
      await removeWishlist(product);
    },
    [removeWishlist],
  );

  const handleOpenOptionsModal = useCallback(
    () =>
      setIsOpenOptions({
        firstOpen: true,
        open: true,
      }),
    [],
  );
  const handleOpenSimilarModal = useCallback(() => {
    handleCloseMenu();
    setIsOpenSimilar({
      firstOpen: true,
      open: true,
    });
  }, [handleCloseMenu]);

  const isDesktop = !isMobile;

  return (
    <div className="flex h-full w-full flex-col">
      <ProductImageContainer size={size}>
        <Link
          href={routes.PRODUCTS.INFO(product.slug, product.id)}
          className="relative block h-full w-full overflow-hidden"
        >
          <Image
            src={product?.images?.[0]?.url ?? 'https://i.ibb.co/drQ6ZX5/9.png'}
            fill
            className="object-cover"
            alt={product.name}
          />
        </Link>
        <div className="absolute right-4 top-4 flex flex-col gap-4">
          <ProductOption
            aria-label="Add to favorites"
            onClick={() => {
              if (isWish) {
                removeFromWishList(product);
              } else {
                addToWishList(product);
              }
            }}
            className="transition-[color] duration-[400ms] hover:text-error-main"
          >
            {isWish ? (
              <Heart size={24} color="red" weight="fill" />
            ) : (
              <Heart size={24} />
            )}
          </ProductOption>

          {hasStock && (
            <ProductOption
              aria-haspopup={isDesktop && menuId ? 'true' : undefined}
              aria-expanded={isDesktop && openMenu ? 'true' : undefined}
              onClick={isDesktop ? handleClickMenu : handleOpenOptionsModal}
              aria-controls={isDesktop && openMenu ? menuId : undefined}
              id={buttonId}
              aria-label="Open product options"
              className="bg-white hover:bg-white"
            >
              <DotsThree size={24} weight="bold" />
            </ProductOption>
          )}
          {Boolean(isMobile && isOpenOptions?.firstOpen) && (
            <ProductOptionsModal
              handleSimilarProducts={() => {
                handleOpenSimilarModal();
              }}
              isOpen={isOpenOptions?.open}
              onClose={() =>
                setIsOpenOptions((old) => ({
                  ...old,
                  open: false,
                }))
              }
              handleAddWish={() => addToWishList(product)}
              handleRemoveWish={() => removeFromWishList(product)}
              isWish={isWish}
            />
          )}

          {isDesktop && hasStock && (
            <Menu
              anchorEl={anchorElMenu}
              open={openMenu}
              onClose={handleCloseMenu}
              id={menuId}
              MenuListProps={{
                'aria-labelledby': buttonId,
              }}
              transformOrigin={{
                vertical: -16,
                horizontal: 0,
              }}
            >
              {!isWish ? (
                <MenuItem divider onClick={() => addToWishList(product)}>
                  Add to Wishlist
                </MenuItem>
              ) : (
                <MenuItem divider onClick={() => removeFromWishList(product)}>
                  Remove from Wishlist
                </MenuItem>
              )}
              <MenuItem
                onClick={() => {
                  handleOpenSimilarModal();
                }}
              >
                Similar Product
              </MenuItem>
            </Menu>
          )}
        </div>
      </ProductImageContainer>
      <div className="flex flex-1 flex-col gap-2">
        {showBadge && (
          <div className="flex flex-row flex-wrap gap-x-[11px] gap-y-1">
            {!!product.discount && hasStock && (
              <ProductsCardBadge error>-{product.discount}%</ProductsCardBadge>
            )}
            {isFreeShipping && (
              <ProductsCardBadge>Free Shipping</ProductsCardBadge>
            )}
          </div>
        )}
        <div className="flex items-center gap-1">
          <span className="sr-only">
            {roundedRating}
            out of 5
          </span>
          {new Array(5).fill(undefined).map((_, index) => {
            const isFilled = index < roundedRating;
            return (
              <Star
                className="text-warning-main"
                key={`${product?.id}-rating-${index}`}
                weight={isFilled ? 'fill' : 'regular'}
                size={18}
              />
            );
          })}
          <MuiLink
            component={Link}
            href={routes.PRODUCTS.REVIEWS(product.slug, product.id)}
            className="ml-1 text-xs text-primary-main sm:text-sm"
            underline="hover"
          >
            {`${product.totalReviews ?? 0} ${
              product?.totalReviews === 1 ? 'Review' : 'Reviews'
            }`}
          </MuiLink>
        </div>
        <Typography
          variant="subtitle2"
          className="font-xs sm:font-base font-semibold leading-[140%]"
        >
          {product.name}
        </Typography>
        <div className="flex items-center gap-2">
          <Typography
            sx={{
              fontSize: {
                xs: '18px',
                sm: '20px',
              },
              fontWeight: '600',
              color: product.discount ? 'error.main' : 'text.primary',
            }}
            component="span"
          >
            {price}
          </Typography>
          {!!product.discount && (
            <Typography
              component="span"
              className="font-[12px] line-through sm:font-[14px]"
            >
              {originalPrice}
            </Typography>
          )}
        </div>
        <Typography component="span" className="text-[12px] sm:text-[14px]">
          Seller:{' '}
          <Link
            href={routes.STORES.INFO(product.store.slug)}
            className="font-semibold text-primary-main underline hover:text-primary-dark"
          >
            {product.store.name}
          </Link>
        </Typography>
        {isCart && hasStock && (
          <ContainedButton
            onClick={() => push(routes.CART.INDEX)}
            className="mt-auto w-full"
            color="primary"
          >
            In Cart
          </ContainedButton>
        )}
        {!isCart && hasStock && (
          <OutlinedButton
            onClick={() => addProductToCart()}
            className="mt-auto w-full"
          >
            Buy
          </OutlinedButton>
        )}
        {Boolean(!hasStock || product?.deletedAt) && (
          <OutlinedButton
            disabled
            className="mt-auto w-full !border-error-main !text-error-main"
          >
            Out Of Stock
          </OutlinedButton>
        )}
      </div>
      {isOpenSimilar?.firstOpen && (
        <SimilarProductsModal
          productId={product.id}
          open={isOpenSimilar?.open}
          onClose={() =>
            setIsOpenSimilar((old) => ({
              ...old,
              open: false,
            }))
          }
        />
      )}
    </div>
  );
};

export default ProductCard;
