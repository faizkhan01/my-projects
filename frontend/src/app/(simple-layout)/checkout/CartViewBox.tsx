'use client';
import CartBox from '@/components/cart/CartBox';
import useCart from '@/hooks/queries/customer/useCart';
import { useCartPrice } from '@/hooks/queries/customer/useCartPrice';
import { ContainedButton } from '@/ui-kit/buttons';
import { calculatePrice, formatPrice } from '@/utils/currency';
import { Badge, Divider, OutlinedInput, Typography } from '@mui/material';
import { styled } from '@mui/system';
import { Box } from '@mui/system';
import Image from 'next/image';
import { useMemo } from 'react';
import { useCartDeliveryTime } from '@/hooks/queries/customer/useCartDeliveryTime';
import { getProductDeliveryText } from '@/utils/products';
import { useExchangeRates } from '@/hooks/queries/useExchangeRates';
import { Cart } from '@/types/cart';
import { useCurrencyConverterStore } from '@/hooks/stores/useCurrencyConverterStore';
import { useActualCurrency } from '@/hooks/stores/useUserPreferencesStore';

const LightText = styled(Typography)(({ theme }) => ({
  fontSize: '14px',
  lineHeight: '16px',
  color: '#96A2C1',

  [theme.breakpoints.down('md')]: {},
}));

const ProductImageHolder = styled(Box)(({ theme }) => ({
  position: 'relative',
  height: '64px',
  width: '64px',
  borderRadius: '10px',
  overflow: 'hidden',
  [theme.breakpoints.down('sm')]: {
    height: '54px',
    width: '54px',
  },
}));

interface CartViewBoxProps {
  activeStep?: number;
  shippingCountryIso2?: string;
}

const CartItems = ({
  shippingCountryIso2,
  cartArray,
}: Pick<CartViewBoxProps, 'shippingCountryIso2'> & {
  cartArray: Cart;
}) => {
  const { data: deliveryTimes } = useCartDeliveryTime(
    cartArray,
    shippingCountryIso2,
  );
  const currency = useActualCurrency();
  const converter = useCurrencyConverterStore((state) => state.converter);

  return cartArray?.map((item, index) => {
    const deliveryTime =
      deliveryTimes?.find((time) => time.id === item.product_id) ?? null;
    const rate = converter(1, {
      from: item?.product?.currency,
      to: currency,
    });

    const prices = calculatePrice({
      price: item?.product.price,
      discount: item?.product.discount,
      quantity: item?.quantity,
      exchangeRate: rate,
    });

    const deliveryText = getProductDeliveryText(deliveryTime);

    return (
      <div
        key={index}
        className={`grid grid-cols-[54px_1fr] gap-4 md:grid-cols-[64px_1fr] ${
          index !== 0 ? 'mt-6' : 'mt-0'
        }`}
      >
        <Badge
          badgeContent={item?.quantity}
          color="secondary"
          sx={{
            '& .MuiBadge-badge': {
              backgroundColor: '#96A2C1',
            },
          }}
        >
          <ProductImageHolder>
            <Image
              src={item?.product.images?.[0]?.url}
              fill
              alt="Product Image"
            />
          </ProductImageHolder>
        </Badge>

        <div className="flex flex-col justify-between">
          <Typography
            sx={{
              fontWeight: '500',
              lineHeight: {
                xs: '16.8px',
                md: '120%',
              },
              fontSize: {
                md: '18px',
              },
            }}
          >
            {item?.product?.name}
          </Typography>
          {Boolean(
            deliveryTime?.deleted ||
              !deliveryTime?.canDeliver ||
              deliveryTime.outOfStock,
          ) && (
            <Typography
              sx={{
                fontWeight: '600',
                fontSize: '14px',
                lineHeight: '16px',
                color: 'error.main',
              }}
            >
              {deliveryText.text}
            </Typography>
          )}

          <div className="flex items-center gap-2">
            <div className="flex items-end gap-2">
              <Typography className="text-xs/none md:text-sm/none">
                {/* {isLoadingRate && <Skeleton width={70} />} */}
                {/* {!isLoadingRate && formatPrice(prices.total, { currency })} */}

                {formatPrice(prices.total, { currency })}
              </Typography>
              {!!item.product.discount && (
                <Typography className="text-xs/none text-text-secondary line-through md:text-sm/none">
                  {/* {isLoadingRate && <Skeleton width={50} />} */}
                  {/* {!isLoadingRate && formatPrice(prices.subtotal)} */}
                  {formatPrice(prices.subtotal, { currency })}
                </Typography>
              )}
            </div>
            <Divider orientation="vertical" />
            {!!item.quantity && item.quantity > 1 && (
              <Typography className="text-xs/none text-text-secondary">
                Each {/* {isLoadingRate && ( */}
                {/*   <Skeleton width={40} className="inline-block" /> */}
                {/* )} */}
                {/* {!isLoadingRate && formatPrice(prices.unitPrice)} */}
                {formatPrice(prices.unitPrice, { currency })}
              </Typography>
            )}
          </div>
        </div>
      </div>
    );
  });
};

const CartViewBox = ({ activeStep, shippingCountryIso2 }: CartViewBoxProps) => {
  const { cartArray, isLoading: isLoadingCart } = useCart(true);
  const { actualCurrency } = useExchangeRates();

  const { data: cartPrice, isLoading: isLoadingPrice } = useCartPrice(
    cartArray ?? null,
    {
      country: shippingCountryIso2,
      currency: actualCurrency,
    },
  );
  const { price, discount, shipping, total } = useMemo(() => {
    const price = formatPrice(cartPrice?.prices.subtotal ?? 0, {
      currency: actualCurrency,
    });
    const discount = formatPrice(cartPrice?.prices.discounted ?? 0, {
      currency: actualCurrency,
    });
    const shipping = formatPrice(cartPrice?.prices.shipping ?? 0, {
      currency: actualCurrency,
    });

    const total = formatPrice(cartPrice?.prices.total ?? 0, {
      currency: actualCurrency,
    });

    return {
      price,
      discount,
      total,
      shipping,
    };
  }, [
    actualCurrency,
    cartPrice?.prices.discounted,
    cartPrice?.prices.shipping,
    cartPrice?.prices.subtotal,
    cartPrice?.prices.total,
  ]);

  const loadingPrice = isLoadingCart || isLoadingPrice;

  return (
    <div>
      <CartItems
        cartArray={cartArray ?? []}
        shippingCountryIso2={shippingCountryIso2}
      />
      <Divider light sx={{ marginBlock: '25px' }} />
      <div className="mb-6">
        <LightText mb="16px">Promotional Code</LightText>
        <div className="flex flex-col gap-4 sm:flex-row">
          <OutlinedInput
            id="promotional-code"
            sx={{
              width: '100%',
              height: {
                xs: '34px',
                md: '40px',
              },
              borderColor: '#96A2C1',
            }}
          />
          <ContainedButton
            type="button"
            disabled={activeStep == 0}
            className="min-h-[34px] w-full min-w-[auto] text-[14px] font-normal md:min-w-[130px] lg:w-[119px]"
          >
            Apply
          </ContainedButton>
        </div>
      </div>
      <div className="space-y-6">
        <CartBox.TextRow title="Subtotal" loading={loadingPrice} text={price} />
        <CartBox.TextRow
          title="Discount"
          loading={loadingPrice}
          text={discount}
          textColor="error.main"
        />
        <CartBox.TextRow
          title="Shipping & Handling"
          loading={loadingPrice}
          text={shipping}
        />
        <CartBox.TextRowBold
          title="Total Price"
          loading={loadingPrice}
          text={total}
        />
      </div>
    </div>
  );
};

export default CartViewBox;
