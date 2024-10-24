'use client';
import { useState, useMemo, useEffect, memo, useRef, useCallback } from 'react';
import { styled } from '@mui/material/styles';
import { Box, Typography, Checkbox, Button, Skeleton } from '@mui/material';
import ProductItem from '@/components/cart/ProductItem';
import { Cart, CartItem } from '@/types/cart';
import ProductsCardView from '@/components/productCard/ProductsCardView';
import useCart from '@/hooks/queries/customer/useCart';
import useWishlist from '@/hooks/queries/customer/useWishlist';
import useProfile from '@/hooks/queries/useProfile';
import routes from '@/constants/routes';
import { ContinueShoppingModal } from '@/components/modals/cart/ContinueShoppingModal';
import { useCartActions } from '@/hooks/cart/useCartActions';
import { CustomContainer, ModalContainer } from '@/ui-kit/containers';
import { BackLinkButton } from '@/ui-kit/buttons';
import { MobileHeading } from '@/ui-kit/typography';
import CartBox from '@/components/cart/CartBox';
import { useCartPrice } from '@/hooks/queries/customer/useCartPrice';
import { formatPrice } from '@/utils/currency';
import { useCartDeliveryTime } from '@/hooks/queries/customer/useCartDeliveryTime';
import { getUserPreferencies } from '@/lib/cookies';
import { useNavigationEvent } from '@/hooks/useNavigationEvent';
import { SWRProvider } from '@/components/Providers';
import { CUSTOMER } from '@/constants/api';
import { unstable_serialize } from 'swr';
import { Wishlist } from '@/types/wishlist';
import { useExchangeRates } from '@/hooks/queries/useExchangeRates';

type CartItemId = CartItem['product_id'];

interface ProceedToCheckoutProps {
  loading: boolean;
  cart: CartItem[];
  selectedIds: CartItemId[];
}

const MainHeading = styled(Typography)(({ theme }) => ({
  fontWeight: '600',
  fontSize: '40px',
  color: theme.palette.text.primary,
  lineHeight: '48px',
  fontStyle: 'normal',

  [theme.breakpoints.down('sm')]: {
    fontSize: '28px',
  },
}));

const GridLayout = styled(Box)(({ theme }) => ({
  marginBlock: '2rem',
  display: 'grid',
  gridTemplateColumns: '1fr 370px',
  gap: '1rem',

  [theme.breakpoints.down('sm')]: {
    gridTemplateColumns: '1fr',
  },

  [theme.breakpoints.down('md')]: {
    gridTemplateColumns: '1fr',
  },
}));

const TableHeader = styled(Box)(({ theme }) => ({
  height: '50px',
  borderBottom: `1px solid ${theme.palette.grey[400]}`,
  display: 'flex',
  alignItems: 'center',
  paddingInline: '1.5rem',

  [theme.breakpoints.down('sm')]: {
    justifyContent: 'space-between',
    paddingInline: '0',
    borderBottom: '0px',
  },
}));

const TableHeaderText = styled(Typography)(({ theme }) => ({
  fontSize: '16px',
  fontWeight: '600',
  lineHeight: '18px',
  color: theme.palette.text.primary,
  marginRight: '2rem',
  display: 'flex',
  alignItems: 'center',
}));

const CartItems = styled(Box)(({ theme }) => ({
  background: theme.palette.common.white,
  boxShadow:
    '0px 4px 53px rgba(0, 0, 0, 0.04), 0px 0.500862px 6.63642px rgba(0, 0, 0, 0.02)',
  borderRadius: '10px',
  height: 'fit-content',

  [theme.breakpoints.down('sm')]: {
    boxShadow:
      '0px 4px 53px rgba(0, 0, 0, 0), 0px 0.500862px 6.63642px rgba(0, 0, 0, 0)',
  },
}));

const InYourWishlist = memo(() => {
  const { wishlistArray = [], isLoading: isLoadingWish } = useWishlist();
  const wishProducts = useMemo(
    () => wishlistArray?.map((w) => w.product),
    [wishlistArray],
  );

  return (
    <Box sx={{ marginY: '96px' }}>
      {(!!wishlistArray?.length || isLoadingWish) && (
        <>
          {isLoadingWish ? (
            <Skeleton>
              <MainHeading
                sx={{
                  mb: {
                    xs: '22px',
                    md: '32px',
                  },
                }}
              >
                In Your Wishlist
              </MainHeading>
            </Skeleton>
          ) : (
            <MainHeading
              sx={{
                mb: {
                  xs: '22px',
                  md: '32px',
                },
              }}
            >
              In Your Wishlist
            </MainHeading>
          )}
          <ProductsCardView
            products={wishProducts}
            loading={isLoadingWish}
            carouselOnMobile
          />
        </>
      )}
    </Box>
  );
});

const ProceedToCheckout = ({
  cart,
  selectedIds,
  loading,
}: ProceedToCheckoutProps) => {
  const [isOpenModal, setIsOpenModal] = useState(false);
  const { profile } = useProfile();
  const { actualCurrency } = useExchangeRates();

  const selectedProducts = useMemo(() => {
    const selectedCart = cart?.filter((item) =>
      selectedIds.some((id) => id === item.product_id),
    );

    return selectedCart || [];
  }, [cart, selectedIds]);

  const { data, isLoading: isLoadingPrice } = useCartPrice(selectedProducts, {
    currency: actualCurrency,
  });
  const { data: deliveryTimes, isLoading: isLoadingDeliveryTime } =
    useCartDeliveryTime(selectedProducts.length ? selectedProducts : null);

  const isLoading = loading || isLoadingPrice || isLoadingDeliveryTime;

  const isDisabledProceed = useMemo(() => {
    if (selectedProducts.length === 0) return true;
    if (
      selectedProducts.some(
        (p) => p.product?.stock <= 0 || p.product?.published == false,
      )
    )
      return true;

    if (
      deliveryTimes?.some((d) => !d.canDeliver || d.deleted || d.outOfStock)
    ) {
      return true;
    }

    const userCountry = getUserPreferencies()?.country_code;
    if (!isLoadingDeliveryTime && !userCountry) {
      return true;
    }

    return false;
  }, [deliveryTimes, isLoadingDeliveryTime, selectedProducts]);

  const { price, discount, total, shipping } = useMemo(() => {
    const price = formatPrice(data?.prices.subtotal ?? 0, {
      currency: actualCurrency,
    });
    const discount = formatPrice(data?.prices.discounted ?? 0, {
      currency: actualCurrency,
    });
    const shipping = formatPrice(data?.prices.shipping ?? 0, {
      currency: actualCurrency,
    });

    const total = formatPrice(data?.prices.total ?? 0, {
      currency: actualCurrency,
    });

    return {
      price,
      discount,
      shipping,
      total,
    };
  }, [
    actualCurrency,
    data?.prices.discounted,
    data?.prices.shipping,
    data?.prices.subtotal,
    data?.prices.total,
  ]);

  const handleCheckout = () => {
    if (!profile) return setIsOpenModal(true);
    // Push was causing issues of not updating the cart
    window.location.href = routes.CHECKOUT.INDEX;
  };

  return (
    <>
      <ModalContainer open={isOpenModal} onClose={() => setIsOpenModal(false)}>
        <ContinueShoppingModal setClose={() => setIsOpenModal(false)} />
      </ModalContainer>
      <CartBox>
        <CartBox.Header>
          <CartBox.MainButton
            disabled={isDisabledProceed}
            onClick={handleCheckout}
          >
            Proceed to checkout
          </CartBox.MainButton>
        </CartBox.Header>

        <CartBox.Content>
          <CartBox.TextRow
            title={`Order Summary (${selectedIds.length})`}
            loading={isLoading}
            text={price}
          />
          <CartBox.TextRow
            title="Discount"
            loading={isLoading}
            text={discount}
            textColor="error.main"
          />

          <CartBox.TextRow
            title="Shipping & Handling"
            loading={isLoading}
            text={shipping}
          />

          <CartBox.PromoCodeForm />
        </CartBox.Content>

        <CartBox.Footer>
          <CartBox.TextRowBold
            title="Total Price"
            loading={isLoading}
            text={total}
          />
        </CartBox.Footer>
      </CartBox>
    </>
  );
};

InYourWishlist.displayName = 'InYourWishlist';

const Cart = (): JSX.Element => {
  // INFO: itemsToUpdate is used after the page is left, it saves a list of items have been changed the selected state and it will send the request changes
  // after changes the route of the pag so it won't make a lo of requests to the server
  const itemsToUpdate = useRef<
    {
      productId: CartItemId;
      newSelected: boolean;
    }[]
  >([]);
  const { wishlist } = useWishlist();
  const [selectedIds, setSelectedIds] = useState<CartItemId[]>([]);
  const { cartArray, isLoading: isLoadingCart } = useCart();
  const { data: deliveryTimes, isLoading: isLoadingDeliveryTime } =
    useCartDeliveryTime(cartArray);
  const { updateItems } = useCartActions();

  const isLoadingProceed = useMemo(
    () => isLoadingCart || isLoadingDeliveryTime,
    [isLoadingCart, isLoadingDeliveryTime],
  );

  const updateIsPendingList = (items: CartItem[], newSelected: boolean) => {
    items?.forEach((item) => {
      const isPendingToUpdate = itemsToUpdate.current.find(
        (i) => i.productId === item.product_id,
      );

      if (isPendingToUpdate?.newSelected === !newSelected) {
        itemsToUpdate.current = itemsToUpdate.current.filter(
          (i) => i.productId !== item.product_id,
        );
        return;
      }
      itemsToUpdate.current = [
        ...itemsToUpdate.current,
        {
          newSelected: newSelected,
          productId: item.product_id,
        },
      ];
    });
  };

  const handleSelectAllItems = async () => {
    const areAllSelected = selectedIds.length === cartArray?.length;

    if (areAllSelected) {
      return handleUnselectAllItems();
    }

    cartArray?.length && updateIsPendingList(cartArray, true);

    setSelectedIds(cartArray?.map((c) => c.product_id) || []);
  };

  const handleUnselectAllItems = async () => {
    cartArray?.length && updateIsPendingList(cartArray, false);

    setSelectedIds([]);
  };

  const handleSelectedItem = (item: CartItem) => {
    updateIsPendingList([item], true);
    setSelectedIds((prev) => {
      return [...prev, item.product_id];
    });
  };

  const removeSelectedItem = (item: CartItem) => {
    updateIsPendingList([item], false);
    setSelectedIds((prev) => prev.filter((id) => item.product_id !== id));
  };

  useEffect(() => {
    // INFO: the itemsToUpdate.current.length is required to be verified to avoid flashes of updates before reloading or changing the route
    if (!cartArray?.length || itemsToUpdate.current.length) {
      return;
    }
    const ids: CartItem['product_id'][] = [];

    for (const item of cartArray) {
      if (item.selected) {
        ids.push(item.product_id);
      }
    }
    setSelectedIds(ids);
  }, [cartArray]);

  const updateItemsOnBackground = useCallback(async () => {
    await updateItems(
      itemsToUpdate.current.map((i) => ({
        data: {
          selected: i.newSelected,
        },
        productId: i.productId,
      })),
    );
  }, [updateItems]);

  // Run before page is changed to another route of the app
  useNavigationEvent(updateItemsOnBackground);

  useEffect(() => {
    // Run before the page reloads or gets closed
    window.addEventListener('beforeunload', updateItemsOnBackground);

    return () => {
      window.removeEventListener('beforeunload', updateItemsOnBackground);
    };
  }, [updateItemsOnBackground]);

  return (
    <CustomContainer>
      <BackLinkButton />
      <MobileHeading title="Shopping Cart" />
      <MainHeading
        sx={{
          marginTop: '20px',
          display: { md: 'block', xs: 'none' },
        }}
      >
        Shopping Cart
      </MainHeading>
      <GridLayout>
        <CartItems>
          <TableHeader>
            <TableHeaderText>
              <Checkbox
                sx={{
                  padding: '0px',
                  marginRight: '0.5rem',
                }}
                checked={
                  selectedIds.length === cartArray?.length &&
                  cartArray?.length > 0
                }
                onChange={handleSelectAllItems}
              />
              <Button
                sx={{
                  color: '#333E5C',
                  marginRight: '0',
                  paddingInline: '0',
                  fontWeight: '600',
                }}
                onClick={handleSelectAllItems}
              >
                Select All Item
              </Button>
            </TableHeaderText>
            <Button
              color="error"
              sx={{
                marginRight: '0',
                paddingLeft: '0',
                fontWeight: '600',
              }}
              onClick={handleUnselectAllItems}
            >
              Deselect All Item
            </Button>
          </TableHeader>

          {cartArray?.map((item) => {
            const isSelected = selectedIds.some(
              (selectedId) => selectedId === item.product_id,
            );
            const isInWish = Boolean(wishlist[item.product_id]);
            return (
              <ProductItem
                key={item.id}
                isSelected={isSelected}
                item={item}
                handleSelectedItem={handleSelectedItem}
                removeSelectedItem={removeSelectedItem}
                isInWish={isInWish}
                deliveryTime={
                  deliveryTimes?.find((t) => t.id === item.product_id) ?? null
                }
                isLoadingDeliveryTime={isLoadingDeliveryTime}
              />
            );
          })}
        </CartItems>
        <ProceedToCheckout
          cart={cartArray || []}
          loading={isLoadingProceed}
          selectedIds={selectedIds}
        />
      </GridLayout>
      <InYourWishlist />
    </CustomContainer>
  );
};

const Page = ({ cart, wishlist }: { cart?: Cart; wishlist?: Wishlist }) => {
  return (
    <SWRProvider
      options={{
        fallback: {
          [unstable_serialize([CUSTOMER.CART.LIST, false])]: cart,
          [CUSTOMER.WISHLIST]: wishlist,
        },
      }}
    >
      <Cart />
    </SWRProvider>
  );
};

export default Page;
