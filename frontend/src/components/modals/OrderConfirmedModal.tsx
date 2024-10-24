import { ModalContainer, ModalCardContainer } from '@/ui-kit/containers';
import { ContainedButton } from '@/ui-kit/buttons';
import {
  Box,
  Divider,
  Grid,
  Stack,
  Typography,
  Link as MuiLink,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import Image from 'next/image';
import Link from 'next/link';
import { usePriceCalculator } from '@/hooks/usePriceCalculator';
import { Product, ProductWithQuantity } from '@/types/products';
import { ConfirmCheckoutResponse } from '@/services/API/checkout';
import routes from '@/constants/routes';
import { formatAddress, formatOrderDate } from '@/utils/formatters';
import { Fragment, useMemo } from 'react';
import { formatPrice } from '@/utils/currency';
import {
  useActualCurrency,
  useUserPreferencesStore,
} from '@/hooks/stores/useUserPreferencesStore';
import { useCurrencyConverter } from '@/hooks/stores/useCurrencyConverterStore';

type OrderInfo = Pick<
  ConfirmCheckoutResponse['data'],
  'orders' | 'shipping' | 'paymentMethod' | 'pricing'
> & {
  products: ProductWithQuantity[];
};

export interface OrderConfirmedModalProps {
  open: boolean;
  onClose: () => void;
  orderInfo: OrderInfo | null;
  isGuest: boolean;
}

interface OrderedProductProps {
  product: Product;
  quantity: number;
}

const ProductContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  gap: '16px',
  marginBottom: '24px',
  [theme.breakpoints.down('sm')]: {
    gap: '10px',
  },
}));

const ProductImageHolder = styled(Box)(({ theme }) => ({
  position: 'relative',
  height: '96px',
  width: '96px',
  borderRadius: '10px',
  overflow: 'hidden',
  [theme.breakpoints.down('sm')]: { height: '80px', width: '80px' },
}));

const ProductName = styled(Typography)(({ theme }) => ({
  fontSize: '18px',
  lineHeight: '22px',
  marginBottom: '4px',
  [theme.breakpoints.down('sm')]: { fontSize: '16px', lineHeight: '17px' },
}));

/* const ProductDescription = styled(Typography)(({ theme }) => ({ */
/*   fontSize: '14px', */
/*   lineHeight: '16px', */
/*   [theme.breakpoints.down('sm')]: { fontSize: '12px', lineHeight: '16px' }, */
/* })); */

const ProductInfo = styled(Stack)(({ theme }) => ({
  justifyContent: 'space-between',
  flexDirection: 'row',
  flex: 1,
  [theme.breakpoints.down('sm')]: {},
}));

const StyledFlexBox = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  [theme.breakpoints.down('sm')]: {},
}));

const Desktop = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'flex-start',
  [theme.breakpoints.down('sm')]: { display: 'none' },
}));

const Mobile = styled(Box)(({ theme }) => ({
  display: 'none',
  [theme.breakpoints.down('sm')]: { display: 'flex', alignItems: 'center' },
}));

const OrderedProduct = ({ quantity, product }: OrderedProductProps) => {
  const currency = useActualCurrency();
  const converter = useCurrencyConverter();
  const { priceFormatted, totalFormatted } = usePriceCalculator([product], {
    currency: currency ?? undefined,
    exchangeRate: converter(1, {
      from: product.currency,
      to: currency,
    }),
  });

  const hasDiscount = !!product?.discount;

  return (
    <ProductContainer>
      <ProductImageHolder>
        <Image src={product.images?.[0]?.url} fill alt="Product Image" />
      </ProductImageHolder>
      <ProductInfo>
        <Stack sx={{ justifyContent: 'space-between' }}>
          <Box>
            <ProductName>{product.name}</ProductName>
            {/* <ProductDescription>{product.description}</ProductDescription> */}
          </Box>
          <Mobile mt={1}>
            <Typography
              fontSize={16}
              fontWeight={600}
              lineHeight="19px"
              component="span"
            >
              {totalFormatted}
            </Typography>
            {hasDiscount && (
              <Typography
                fontSize={12}
                lineHeight="18px"
                sx={{
                  marginLeft: '8px',
                  textDecoration: 'line-through',
                }}
              >
                {priceFormatted}
              </Typography>
            )}
          </Mobile>
          <Typography
            mt={1}
            fontSize={14}
            color="text.secondary"
            lineHeight="16px"
          >
            Qty: {quantity}
          </Typography>
        </Stack>
        <Desktop>
          <Typography fontSize={18} fontWeight={600} lineHeight="22px">
            {totalFormatted}
          </Typography>
          {hasDiscount && (
            <Typography
              fontSize={14}
              lineHeight="18px"
              sx={{
                marginLeft: '8px',
                textDecoration: 'line-through',
              }}
            >
              {priceFormatted}
            </Typography>
          )}
        </Desktop>
      </ProductInfo>
    </ProductContainer>
  );
};

const OrderConfirmedModal = ({
  open,
  onClose,
  orderInfo,
  isGuest,
}: OrderConfirmedModalProps): JSX.Element => {
  const prefCurrency = useUserPreferencesStore((s) => s.currency);
  const {
    priceFormatted,
    totalFormatted,
    discountFormatted,
    shippingFormatted,
  } = useMemo<{
    priceFormatted: string;
    totalFormatted: string;
    discountFormatted: string;
    shippingFormatted: string;
  }>(() => {
    return {
      priceFormatted: formatPrice(orderInfo?.pricing?.subtotal ?? 0, {
        currency: prefCurrency,
      }),
      totalFormatted: formatPrice(orderInfo?.pricing?.total ?? 0, {
        currency: prefCurrency,
      }),
      discountFormatted: formatPrice(orderInfo?.pricing?.discounted ?? 0, {
        currency: prefCurrency,
      }),
      shippingFormatted: formatPrice(orderInfo?.pricing?.shipping ?? 0, {
        currency: prefCurrency,
      }),
    };
  }, [orderInfo?.pricing, prefCurrency]);

  return (
    <ModalContainer open={open} onClose={onClose}>
      <ModalCardContainer
        sx={{ '& > div': { paddingInline: '24px' } }}
        title="Your Order Confirmed!"
      >
        <Divider sx={{ marginBlock: '24px' }} />
        <Grid container spacing={2}>
          <Grid item md={3} xs={4}>
            <Typography
              mb={1}
              fontSize={14}
              lineHeight="16px"
              color="text.secondary"
            >
              Order Date
            </Typography>
            <Typography fontSize={16} lineHeight="24px">
              {formatOrderDate()}
            </Typography>
          </Grid>
          <Grid item md={3} xs={4}>
            <Typography
              mb={1}
              fontSize={14}
              lineHeight="16px"
              color="text.secondary"
            >
              Order Number
            </Typography>
            <Typography fontSize={16} lineHeight="24px">
              {orderInfo?.orders.map((o) => (
                <Fragment key={o.id}>
                  <span>{o.orderNumber ?? o.id}</span>
                  <br />
                </Fragment>
              ))}
            </Typography>
          </Grid>
          <Grid item md={3} xs={4}>
            <Typography
              mb={1}
              fontSize={14}
              lineHeight="16px"
              color="text.secondary"
            >
              Payment
            </Typography>
            {orderInfo?.paymentMethod && (
              <Typography fontSize={16} lineHeight="24px">
                {orderInfo?.paymentMethod?.card?.brand} -{' '}
                {orderInfo?.paymentMethod?.card?.last4}
              </Typography>
            )}
          </Grid>
          <Grid item md={3} xs={12}>
            <Typography
              mb={1}
              fontSize={14}
              lineHeight="16px"
              color="text.secondary"
            >
              Address
            </Typography>
            <Typography fontSize={16} lineHeight="24px">
              {formatAddress({
                addressOne: orderInfo?.shipping?.addressOne || '',
                city: orderInfo?.shipping?.city || '',
                state: orderInfo?.shipping?.state.name || '',
                zipCode: orderInfo?.shipping?.zipCode || '',
              })}
            </Typography>
          </Grid>
        </Grid>
        <Divider sx={{ marginBlock: '24px' }} />
        {orderInfo?.products?.map((product) => {
          return (
            <OrderedProduct
              product={product}
              quantity={product.quantity}
              key={product.id}
            />
          );
        })}
        <Divider sx={{ marginBlock: '24px' }} />
        <Box>
          <StyledFlexBox>
            <Typography
              sx={{ fontSize: { xs: '16px', md: '18px' }, fontWeight: 500 }}
            >
              Subtotal
            </Typography>
            <Typography fontSize={18} fontWeight={600}>
              {priceFormatted}
            </Typography>
          </StyledFlexBox>
          <StyledFlexBox mt={2}>
            <Typography
              sx={{ fontSize: { xs: '16px', md: '18px' }, fontWeight: 500 }}
            >
              Discount
            </Typography>
            <Typography fontSize={18} fontWeight={600} color="error.main">
              -{discountFormatted}
            </Typography>
          </StyledFlexBox>
          <StyledFlexBox mt={2}>
            <Typography
              sx={{ fontSize: { xs: '16px', md: '18px' }, fontWeight: 500 }}
            >
              Shipping & Handling
            </Typography>
            <Typography fontSize={18} fontWeight={600}>
              {shippingFormatted}
            </Typography>
          </StyledFlexBox>
          {/* <StyledFlexBox mt={2}> */}
          {/*   <Typography sx={{ fontSize: { xs: '16px', md: '18px' } }}> */}
          {/*     Promotional Code ({ORDER.promotionalCode}) */}
          {/*   </Typography> */}
          {/*   <Typography fontSize={18} fontWeight={600} color="primary.main"> */}
          {/*     -${ORDER.promotionalCodeDiscount.split('.')[0]}. */}
          {/*     <Typography sx={{ fontWeight: '600' }} component="sup"> */}
          {/*       {ORDER.promotionalCodeDiscount.split('.')[1]} */}
          {/*     </Typography> */}
          {/*   </Typography> */}
          {/* </StyledFlexBox> */}
          <Divider sx={{ marginBlock: '24px' }} />
          <StyledFlexBox>
            <Typography
              sx={{ fontSize: { xs: '16px', md: '18px' }, fontWeight: 500 }}
            >
              Total
            </Typography>
            <Typography fontSize={24} fontWeight={600}>
              {totalFormatted}
            </Typography>
          </StyledFlexBox>
        </Box>
        <Divider sx={{ marginBlock: '24px' }} />
        <Typography
          mb={3}
          sx={{
            fontSize: { md: '18px', xs: '12px' },
            marginBottom: { md: '24px', xs: '40px' },
            lineHeight: { md: '28px', xs: '19px' },
          }}
        >
          If you have any questions, you can contact our{' '}
          <Link href="#" passHref legacyBehavior>
            <MuiLink underline="none">support service</MuiLink>
          </Link>
          . You will receive a duplicate of your order by email.
          {!isGuest && (
            <>
              You can track your order on the{' '}
              <Link href={routes.DASHBOARD.MY_ORDERS} passHref legacyBehavior>
                <MuiLink underline="none">order status page</MuiLink>
              </Link>
            </>
          )}
          . Thank you for choosing Only Latest.
        </Typography>
        <Box sx={{ display: 'flex', justifyContent: 'center' }}>
          <Link href={routes.INDEX} passHref legacyBehavior>
            <ContainedButton
              size="large"
              className="md:max-w-[322px]"
              fullWidth
            >
              Return to Shopping
            </ContainedButton>
          </Link>
        </Box>
      </ModalCardContainer>
    </ModalContainer>
  );
};

export default OrderConfirmedModal;
