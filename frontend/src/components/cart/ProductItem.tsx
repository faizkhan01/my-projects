import NextLink from 'next/link';
import {
  Box,
  Typography,
  Checkbox,
  Select,
  MenuItem,
  FormControl,
  Button,
  Divider,
  BoxProps,
  SelectChangeEvent,
  Link,
  TypographyProps,
  Skeleton,
} from '@mui/material';
import Image from 'next/image';
import { FC, useId, useState, useMemo } from 'react';
import { styled } from '@mui/material/styles';
import type { CartDeliveryTime, CartItem } from '@/types/cart';
import type { Product } from '@/types/products';
import { useWishlistActions } from '@/hooks/wishlist/useWishlistActions';
import { useCartActions } from '@/hooks/cart/useCartActions';
import { SxProps, Theme } from '@mui/material/styles';
import dynamic from 'next/dynamic';
import { usePriceCalculator } from '@/hooks/usePriceCalculator';
import { getProductDeliveryText } from '@/utils/products';
import useProfile from '@/hooks/queries/useProfile';
import { USER_ROLES } from '@/constants/auth';
import routes from '@/constants/routes';
import { useCurrencyConverter } from '@/hooks/stores/useCurrencyConverterStore';
import { useActualCurrency } from '@/hooks/stores/useUserPreferencesStore';

const ReportProductModal = dynamic(
  () => import('../modals/ReportProductModal'),
);

const Product = styled(Box, {
  shouldForwardProp: (prop) => prop !== 'selectable',
})<
  BoxProps & {
    selectable: boolean;
  }
>(({ theme, selectable }) => ({
  display: 'grid',
  gridTemplateColumns: selectable ? 'auto 2fr 1fr 60px' : 'auto 2fr 1fr 60px',
  borderBottom: '1px solid #EAECF4',
  padding: '24px 0',
  paddingRight: '16px',

  '&:last-child': {
    borderBottom: '0px',
  },

  [theme.breakpoints.down('sm')]: {
    gridTemplateColumns: 'auto 1fr',
    paddingRight: '0px',
  },
}));

const ProductName = styled((props) => (
  <Typography component="h3" {...props} />
))<TypographyProps>(({ theme }) => ({
  fontStyle: 'normal',
  fontWeight: '500',
  fontSize: '18px',
  lineHeight: '21.6px',
  color: '#333E5C',
  marginBottom: '8px',

  [theme.breakpoints.down('sm')]: {
    lineHeight: '16.8px',
  },
}));

const OptionButton = styled(Button)(({ theme }) => ({
  fontWeight: '400',
  fontSize: '14px',
  padding: '0px 8px',

  height: '100%',

  [theme.breakpoints.down('sm')]: {
    fontSize: '12px',
  },
}));

/* const ProductDescription = styled(Typography)(({ theme }) => ({ */
/*   fontWeight: '400', */
/*   fontSize: '14px', */
/*   lineHeight: '16px', */
/*   color: '#333E5C', */
/*   marginBottom: '35px', */
/**/
/*   [theme.breakpoints.down('sm')]: { */
/*     marginBottom: '9.5px', */
/*   }, */
/* })); */

const Price = styled('span')(({ theme }) => ({
  fontSize: '18px',
  fontWeight: '600',
  color: '#333E5C',
  marginRight: '8px',

  [theme.breakpoints.down('sm')]: {
    fontSize: '16px',
  },
}));

const DeletedPrice = styled('span')(({ theme }) => ({
  fontSize: '18px',
  fontWeight: '600',
  lineHeight: '23.22px',
  color: '#96A2C1',
  marginRight: '8px',
  position: 'relative',

  '&:after': {
    content: '""',
    height: '1px',
    width: '100%',
    position: 'absolute',
    backgroundColor: '#96A2C1',
    top: '13px',
    left: '0px',
  },

  [theme.breakpoints.down('sm')]: {
    fontSize: '12px',
  },
}));

const Prices = styled(Box)(() => ({
  display: 'flex',
  alignItems: 'center',
}));

const ProductLinks = styled(Box)(() => ({
  fontWeight: '400',
  fontSize: '14px',
  lineHeight: '16px',
  display: 'flex',
  alignItems: 'center',
  marginBottom: '11px',
  marginTop: 'auto',
}));

const DesktopRow = styled(Box)(({ theme }) => ({
  display: 'block',

  [theme.breakpoints.down('sm')]: {
    display: 'none',
  },
}));

const MobileRow = styled(Box)(({ theme }) => ({
  display: 'none',

  [theme.breakpoints.down('sm')]: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '10.5px',
  },
}));

type ProductItemProps = {
  item: CartItem;
  isInWish: boolean;
  sx?: SxProps<Theme>;
  deliveryTime: CartDeliveryTime | null;
  isLoadingDeliveryTime: boolean;
} & (
  | {
      selectable?: true;
      handleSelectedItem: (cartItem: CartItem) => void;
      removeSelectedItem: (cartIten: CartItem) => void;
      isSelected: boolean;
    }
  | {
      selectable: false;
      handleSelectedItem?: never;
      removeSelectedItem?: never;
      isSelected?: never;
    }
);

const ProductItem: FC<ProductItemProps> = ({
  item,
  removeSelectedItem,
  handleSelectedItem,
  isSelected,
  isInWish,
  selectable = true,
  deliveryTime,
  isLoadingDeliveryTime,
}) => {
  const [openReport, setOpenReport] = useState(false);
  const { profile } = useProfile();
  const id = useId();
  const actualCurrency = useActualCurrency();
  const converter = useCurrencyConverter();

  const exchangeRate = useMemo(() => {
    return converter(1, {
      from: item.product.currency,
      to: actualCurrency,
    });
  }, [actualCurrency, converter, item.product.currency]);

  const { priceFormatted, totalFormatted } = usePriceCalculator(
    [item.product],
    {
      exchangeRate: exchangeRate,
      currency: actualCurrency ?? undefined,
    },
  );
  const { addWishlist, removeWishlist } = useWishlistActions();
  const { removeFromCart, updateItems } = useCartActions();
  const hasDiscount = !!item?.product?.discount;

  const addToWishList = async (product: Product) => {
    await addWishlist(product);
  };

  const removeFromWishlist = async (product: Product) => {
    await removeWishlist(product);
  };

  const onRemove = async (productId: number) => {
    await removeFromCart(productId);
  };

  const onChangeQuanity = async (e: SelectChangeEvent) => {
    const quantity = Number(e.target.value);
    await updateItems([
      {
        productId: item.product.id,
        data: {
          quantity,
        },
      },
    ]);
  };

  const { product } = item;

  const maxQuantity = useMemo(() => product.stock, [product.stock]);

  const deliveryText = useMemo(
    () => getProductDeliveryText(deliveryTime),
    [deliveryTime],
  );

  const allowReport = profile?.role === USER_ROLES.USER;
  return (
    <Product selectable={selectable}>
      <Box
        sx={{
          display: 'flex',
          gap: {
            xs: '12px',
            sm: '24px',
          },
          height: 'fit-content',
          pl: selectable
            ? {
                sm: '24px',
              }
            : 'none',
          alignItems: 'center',
        }}
      >
        {selectable && (
          <Checkbox
            sx={{
              padding: '0px',
            }}
            checked={isSelected}
            onChange={() => {
              if (isSelected) {
                removeSelectedItem(item);
              } else {
                handleSelectedItem && handleSelectedItem(item);
              }
            }}
          />
        )}
        <NextLink
          href={routes.PRODUCTS.INFO(product.slug, product.id)}
          passHref
          legacyBehavior
        >
          <Link
            sx={{
              display: 'flex',
              position: 'relative',
              width: {
                xs: '80px',
                sm: '96px',
              },
              height: {
                xs: '80px',
                sm: '96px',
              },
              borderRadius: '10px',
              overflow: 'hidden',
            }}
          >
            <Image
              src={product.images?.[0]?.url}
              fill
              style={{ objectFit: 'cover' }}
              alt={`${product.name} ${product.description.substring(0, 20)}`}
            />
          </Link>
        </NextLink>
      </Box>

      <Box
        sx={{
          paddingLeft: '16px',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        <ProductName>{product.name}</ProductName>

        {/* <ProductDescription>{product.description}</ProductDescription> */}

        <MobileRow>
          <Prices>
            <Price>{totalFormatted}</Price>
            {hasDiscount && (
              <DeletedPrice
                sx={{ color: '#96A2C1', fontSize: '14px', fontWeight: '400' }}
              >
                {priceFormatted}
              </DeletedPrice>
            )}
          </Prices>

          <FormControl
            sx={{
              display: 'flex',
              alignItems: 'center',
              placeItems: 'start',
            }}
          >
            <Select
              id={id}
              label="Quantity"
              sx={{
                borderRadius: '6px',
                height: '28px',
                width: '60px',
                outline: '0',
              }}
              value={String(item.quantity)}
              inputProps={{
                'aria-label': 'Select Quantity',
              }}
              onChange={onChangeQuanity}
            >
              {new Array(maxQuantity).fill(0).map((_, i) => (
                <MenuItem value={i + 1} key={`${id}-${i}-mobile`}>
                  {i + 1}
                </MenuItem>
              ))}
              {item.quantity > maxQuantity && (
                <MenuItem
                  value={item.quantity}
                  key={`${id}-${item.quantity}-mobile`}
                >
                  {item.quantity}
                </MenuItem>
              )}
            </Select>
          </FormControl>
        </MobileRow>

        <ProductLinks>
          <OptionButton
            onClick={() =>
              isInWish ? removeFromWishlist(product) : addToWishList(product)
            }
            sx={{
              pl: '0',
            }}
          >
            {isInWish ? 'Remove from wishlist' : 'Add to wishlist'}
          </OptionButton>
          <Divider orientation="vertical" flexItem />
          {allowReport && (
            <OptionButton onClick={() => setOpenReport(true)}>
              Report
            </OptionButton>
          )}
          <Divider orientation="vertical" flexItem />
          <OptionButton onClick={() => onRemove(product.id)} color="error">
            Delete
          </OptionButton>
        </ProductLinks>

        <Typography
          sx={{
            fontWeight: '400',
            fontSize: '14px',
            lineHeight: '16px',

            ...(Boolean(
              deliveryTime?.deleted ||
                !deliveryTime?.canDeliver ||
                deliveryTime.outOfStock,
            ) && {
              color: 'error.main',
              fontWeight: '600',
            }),
          }}
        >
          {isLoadingDeliveryTime && <Skeleton />}
          {!isLoadingDeliveryTime && (
            <>
              {deliveryText.canDeliver ? (
                <>
                  Approximate delivery time{' '}
                  <Typography
                    sx={{
                      fontWeight: '600',
                    }}
                    component="b"
                  >
                    {deliveryText.text}
                  </Typography>
                </>
              ) : (
                deliveryText.text
              )}
            </>
          )}
        </Typography>
      </Box>

      <DesktopRow>
        <Prices>
          <Price>{totalFormatted}</Price>
          {hasDiscount && (
            <DeletedPrice
              sx={{ color: '#96A2C1', fontSize: '14px', fontWeight: '400' }}
            >
              {priceFormatted}
            </DeletedPrice>
          )}
        </Prices>
      </DesktopRow>
      <DesktopRow>
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            placeItems: 'start',
          }}
        >
          <Select
            sx={{
              borderRadius: '6px',
              height: '30px',
              outline: '0',
              width: '60px',
            }}
            value={String(item.quantity)}
            inputProps={{
              'aria-label': 'Select Quantity',
            }}
            onChange={onChangeQuanity}
          >
            {new Array(maxQuantity).fill(0).map((_, i) => (
              <MenuItem value={i + 1} key={`${id}-${i}-desktop`}>
                {i + 1}
              </MenuItem>
            ))}
            {item.quantity > maxQuantity && (
              <MenuItem
                value={item.quantity}
                key={`${id}-${item.quantity}-desktop`}
              >
                {item.quantity}
              </MenuItem>
            )}
          </Select>
        </Box>
      </DesktopRow>
      {allowReport && (
        <ReportProductModal
          productId={product.id}
          open={openReport}
          onClose={() => setOpenReport(false)}
        />
      )}
    </Product>
  );
};

export default ProductItem;
