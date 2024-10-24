import { Store } from '@/types/stores';
import type { Product } from '@/types/products';
import {
  useActualCurrency,
  useUserPreferencesStore,
} from '@/hooks/stores/useUserPreferencesStore';
import { usePathname, useRouter } from 'next/navigation';
import { ChangeEvent, useMemo, useState } from 'react';
import { useWishlistActions } from '@/hooks/wishlist/useWishlistActions';
import { usePriceCalculator } from '@/hooks/usePriceCalculator';
import { isProductFreeShipping } from '@/utils/products';
import { FacebookIcon } from '@/assets/icons/FacebookIcon';
import { TwitterIcon } from '@/assets/icons/TwitterIcon';
import routes from '@/constants/routes';
import {
  Rating,
  Typography,
  ButtonGroup,
  InputBase,
  IconButton,
  TypographyProps,
} from '@mui/material';
import { Stack } from '@mui/system';
import {
  Star,
  ShareNetwork,
  Heart,
  Minus,
  Plus,
  Warning,
} from '@phosphor-icons/react';
import Link from 'next/link';
import { styled } from '@mui/material/styles';
import { useCartActions } from '@/hooks/cart/useCartActions';
import useCart from '@/hooks/queries/customer/useCart';
import { ContainedButton, OutlinedButton } from '@/ui-kit/buttons';
import { HeaderButton, RatingContainer, ReviewContainer } from './styled';
import { ProductInfoAccrodion } from './ProductInfoAccordion';
import { Menu, MenuItem } from '@/ui-kit/menu';
import useMenu from '@/hooks/useMenu';
import { ButtonType } from '@/ui-kit/buttons/Button';
import { useCurrencyConverter } from '@/hooks/stores/useCurrencyConverterStore';
import { getShareUrl } from '@/utils/share';

const AmountButtonIcon = styled(IconButton)(({ theme }) => ({
  border: '1px solid #EAECF4',
  height: '40px',
  width: '40px',
  padding: '0px',

  [theme.breakpoints.down('sm')]: {
    height: '100%',
  },
}));

const ProductsCardBadgeContainer = styled('span')({
  display: 'flex',
  flexDirection: 'row',
  gap: '11px',
});

const ProductsCardBadge = styled('span')(({ theme }) => ({
  borderRadius: '2px',
  backgroundColor: theme.palette.text.primary,
  color: theme.palette.common.white,
  padding: '3px 8px 3px 8px',
  fontSize: '18px',

  [theme.breakpoints.down('sm')]: {
    fontSize: '12px',
  },
}));

const Price = styled(Typography, {
  shouldForwardProp: (prop) => prop !== 'hasDiscount',
})<
  TypographyProps<'p'> & {
    hasDiscount?: boolean;
  }
>(({ theme, hasDiscount }) => ({
  fontSize: '32px',
  lineHeight: '38px',
  fontWeight: '600',
  color: hasDiscount ? theme.palette.error.main : theme.palette.text.primary,
  marginRight: '16px',
}));

const DeletedPrice = styled('s')(() => ({
  fontSize: '18px',
  fontWeight: '400',
  lineHeight: '24px',
  color: '#333E5C',
  marginRight: '8px',
  position: 'relative',
}));

const Prices = styled('div')(() => ({
  display: 'flex',
  alignItems: 'center',
}));

const SocialIconButton = styled(IconButton)(({ theme }) => ({
  padding: 0,
  alignItems: 'center',
  '& path': {
    transition: 'all .3s ease',
  },

  '& path:nth-of-type(2)': {
    fill: theme.palette.text.secondary,
  },

  '&:hover path:nth-of-type(1)': {
    fill: 'white',
    transition: 'all 0.3s',
  },

  '&:hover path': {
    fill: theme.palette.primary.main,
    transition: 'all 0.3s',
  },
}));

const getProductHasStock = (stock: number): boolean => {
  return (stock ?? 0) > 0;
};

const ProductBadges = ({
  isFreeShipping,
  hasDiscount,
  hasStock,
  discount,
  isMobile,
}: {
  hasDiscount: boolean;
  isFreeShipping: boolean;
  hasStock: boolean;
  discount: number;
  isMobile: boolean;
}) => {
  return (
    Boolean(hasDiscount || isFreeShipping) &&
    hasStock && (
      <ProductsCardBadgeContainer
        className={`${isMobile ? 'md:hidden' : 'hidden md:flex'}`}
      >
        {hasDiscount && (
          <ProductsCardBadge
            sx={{
              backgroundColor: 'error.main',
            }}
          >
            -{discount}%
          </ProductsCardBadge>
        )}
        {isFreeShipping && <ProductsCardBadge>Free Shipping</ProductsCardBadge>}
      </ProductsCardBadgeContainer>
    )
  );
};

const AddToCartBtn = ({
  product,
  amount,
  setAmount,
}: {
  product: Product;
  amount: number;
  setAmount: (n: number) => void;
}) => {
  const { push } = useRouter();
  const { cart, isLoading: isLoadingCart } = useCart();
  const { addToCart } = useCartActions();

  const isAddedToCart = Boolean(cart[product.id]);

  const handleAddToCart = async () => {
    if (isAddedToCart) {
      push(routes.CART.INDEX);
      return;
    }

    if (amount > product.stock) {
      return;
    }

    if (!isAddedToCart) {
      await addToCart(product, amount);
      setAmount(1);
    }
  };

  let title = 'Add to cart';
  let color: ButtonType['color'] = 'primary';
  const hasStock = getProductHasStock(product.stock);

  if (!hasStock) {
    title = 'Out Of Stock';
  } else if (isAddedToCart) {
    title = 'In cart';
    color = 'success';
  }

  const Component = hasStock ? ContainedButton : OutlinedButton;

  return (
    <Component
      disabled={amount === 0 || amount > product.stock || !hasStock}
      onClick={handleAddToCart}
      loading={isLoadingCart}
      color={color}
      className={`w-full md:w-[170px] ${
        !hasStock ? '!border-error-main !text-error-main' : ''
      }`}
    >
      {title}
    </Component>
  );
};

const ShareNetworkMenu = ({
  originUrl,
  product,
}: {
  product: Product;
  originUrl: string;
}) => {
  const { open, menuAria, buttonAria, handleClick, anchorEl, handleClose } =
    useMenu();
  const pathname = usePathname();
  const pageUrl = `${originUrl}${pathname}`;

  return (
    <>
      <Menu
        open={open}
        onClose={handleClose}
        anchorEl={anchorEl}
        {...menuAria}
        slotProps={{
          paper: {
            className: 'w-auto',
          },
        }}
      >
        <MenuItem
          href={getShareUrl('facebook', {
            pageUrl: pageUrl,
            title: product.name,
          })}
          target="_blank"
          className="[&>a]:flex [&>a]:items-center"
        >
          <SocialIconButton>
            <FacebookIcon width={24} height={24} />
          </SocialIconButton>
          Facebook
        </MenuItem>
        <MenuItem
          href={getShareUrl('twitter', {
            pageUrl: pageUrl,
            title: product.name,
          })}
          target="_blank"
          className="[&>a]:flex [&>a]:items-center"
        >
          <SocialIconButton>
            <TwitterIcon width={24} height={24} />
          </SocialIconButton>
          Twitter
        </MenuItem>
      </Menu>
      <HeaderButton
        size="small"
        aria-label="Share Product"
        onClick={handleClick}
        {...buttonAria}
      >
        <ShareNetwork size={24} />
      </HeaderButton>
    </>
  );
};

const ShareIconsRow = ({
  product,
  originUrl,
}: {
  product: Product;
  originUrl: string;
}) => {
  const pathname = usePathname();
  const pageUrl = `${originUrl}${pathname}`;

  return (
    <Stack
      direction="row"
      spacing="8px"
      sx={{
        display: {
          xs: 'none',
          sm: 'flex',
        },
      }}
    >
      <Link
        target="_blank"
        href={getShareUrl('facebook', {
          pageUrl: pageUrl,
          title: product.name,
        })}
        passHref
        legacyBehavior
      >
        <SocialIconButton aria-label="Share on Facebook">
          <FacebookIcon />
        </SocialIconButton>
      </Link>
      <Link
        target="_blank"
        href={getShareUrl('twitter', {
          pageUrl: pageUrl,
          title: product.name,
        })}
        passHref
        legacyBehavior
      >
        <SocialIconButton aria-label="Share on Twitter">
          <TwitterIcon width={36} height={36} />
        </SocialIconButton>
      </Link>
    </Stack>
  );
};

export const ProductInfo = ({
  product,
  isWish,
  onReportClick,
  originUrl,
  store,
}: {
  product: Product;
  store: Store;
  isWish: boolean;
  onReportClick: () => void;
  originUrl: string;
}) => {
  const shippingCountry = useUserPreferencesStore(
    (state) => state.shippingCountry,
  );
  const [amount, setAmount] = useState(1);
  const actualCurrency = useActualCurrency();
  const converter = useCurrencyConverter();

  const { addWishlist, removeWishlist } = useWishlistActions();
  const { totalFormatted, isFree, priceFormatted } = usePriceCalculator(
    [product],
    {
      currency: actualCurrency ?? undefined,
      exchangeRate: converter(1, {
        from: product.currency ?? null,
        to: actualCurrency,
      }),
    },
  );

  const isFreeShipping = useMemo(
    () => isProductFreeShipping(shippingCountry, product),
    [product, shippingCountry],
  );

  const handleChangeAmount = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const value = Number(e.currentTarget.value);

    if (Number.isNaN(value)) {
      return;
    }

    setAmount(value);
  };

  const canReduce = amount > 1;
  const canIncrease = amount < product.stock;

  const hasDiscount = !!product?.discount;
  const hasStock = getProductHasStock(product.stock);

  return (
    <div className="relative flex w-full flex-col gap-6">
      <div className="flex flex-col gap-[14px] sm:hidden">
        <Stack direction="row" justifyContent="space-between" flexWrap="wrap">
          <div className="flex items-center gap-2">
            <RatingContainer>
              <Rating
                readOnly
                value={product.rating}
                name="product-rating"
                icon={
                  <Star size={18} weight="fill" className="text-warning-main" />
                }
                emptyIcon={<Star size={18} className="text-warning-main" />}
              />
              <ReviewContainer
                href={routes.PRODUCTS.REVIEWS(product.slug, product.id)}
              >
                <Typography component="span">{`${product.totalReviews ?? 0} ${
                  product?.totalReviews === 1 ? 'Review' : 'Reviews'
                }`}</Typography>
              </ReviewContainer>
            </RatingContainer>
            <ProductBadges
              hasStock={hasStock}
              hasDiscount={hasDiscount}
              isFreeShipping={isFreeShipping}
              discount={product.discount}
              isMobile
            />
          </div>
          <div className="flex">
            <HeaderButton
              size="small"
              onClick={onReportClick}
              aria-label="Report Product"
            >
              <Warning size={24} />
            </HeaderButton>
            <ShareNetworkMenu product={product} originUrl={originUrl} />
          </div>
        </Stack>

        <Stack direction="row" justifyContent="space-between">
          <span className="flex items-center justify-center">
            Seller:{' '}
            <Link
              legacyBehavior
              passHref
              href={routes.STORES.INFO(product.store.slug)}
            >
              <HeaderButton
                size="small"
                sx={{
                  fontWeight: 400,
                }}
              >
                {product.store.name}
              </HeaderButton>
            </Link>
          </span>
        </Stack>
      </div>
      <ProductBadges
        hasStock={hasStock}
        isFreeShipping={isFreeShipping}
        hasDiscount={hasDiscount}
        discount={product.discount}
        isMobile={false}
      />
      <Typography
        variant="subtitle2"
        sx={{
          fontWeight: '600',
          lineHeight: '38.4px',
          fontSize: {
            xs: '28px',
            sm: '32px',
          },
        }}
        component="h3"
      >
        {product.name}
      </Typography>
      <Prices>
        <Price hasDiscount={hasDiscount}>
          {isFree ? 'Free' : totalFormatted}
        </Price>
        {hasDiscount && <DeletedPrice>{priceFormatted}</DeletedPrice>}
      </Prices>
      <ProductInfoAccrodion product={product} store={store} />
      <div className="fixed bottom-0 left-0 z-[1] flex w-full flex-row gap-6 bg-white p-4 sm:relative sm:flex-col sm:p-0 md:flex-row">
        <HeaderButton
          size="small"
          variant="outlined"
          onClick={() =>
            isWish ? removeWishlist(product) : addWishlist(product)
          }
          sx={{
            padding: '8px',
            border: '1px solid',
            borderColor: '#EAECF4',
            display: {
              sm: 'none',
            },
          }}
          aria-label={isWish ? 'Remove from wishlist' : 'Add to wishlist'}
        >
          <div className={`inline-flex ${isWish ? 'text-error-main' : ''}`}>
            <Heart weight={isWish ? 'fill' : 'regular'} size={24} />
          </div>
        </HeaderButton>
        <ButtonGroup
          variant="outlined"
          aria-label="text button group"
          sx={{
            display: {
              xs: 'none',
              sm: 'flex',
            },
          }}
        >
          <AmountButtonIcon
            sx={{
              borderRadius: '2px 0px 0px 2px',
              color: canReduce ? 'primary.main' : '#EAECF4',
            }}
            disabled={!canReduce}
            onClick={() => setAmount((amount) => amount - 1)}
            aria-label="Reduce amount to add"
          >
            <Minus size={12} weight="bold" />
          </AmountButtonIcon>
          <InputBase
            sx={{
              borderTop: '1px solid #EAECF4',
              borderBottom: '1px solid #EAECF4',
              borderRadius: '0',
              height: {
                xs: '100%',
                sm: '40px',
              },
              width: '40px',
              '& > input': {
                textAlign: 'center',
              },
            }}
            value={amount}
            onChange={handleChangeAmount}
          />
          <AmountButtonIcon
            sx={{
              color: canIncrease ? 'primary.main' : '#EAECF4',
              borderRadius: '0px 2px 2px 0px',
            }}
            disabled={!canIncrease}
            aria-label="Increase amount to add"
            onClick={() => setAmount((amount) => amount + 1)}
          >
            <Plus size={12} weight="bold" />
          </AmountButtonIcon>
        </ButtonGroup>
        <AddToCartBtn product={product} amount={amount} setAmount={setAmount} />
      </div>

      <ShareIconsRow product={product} originUrl={originUrl} />
    </div>
  );
};
