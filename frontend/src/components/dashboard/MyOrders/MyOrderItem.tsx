'use client';
import dayjs from 'dayjs';
import isSameOrAfter from 'dayjs/plugin/isSameOrAfter';
import { styled } from '@mui/material/styles';
import {
  Typography,
  Button,
  Divider,
  Grid,
  Link as MuiLink,
} from '@mui/material';
import Image from 'next/image';
import Link from 'next/link';
import { Heart } from '@phosphor-icons/react';
import routes from '@/constants/routes';
import useWishlist from '@/hooks/queries/customer/useWishlist';
import { useWishlistActions } from '@/hooks/wishlist/useWishlistActions';
import { Order, OrderItem, OrderItemStatus } from '@/types/orders';
import { useCartActions } from '@/hooks/cart/useCartActions';
import useCart from '@/hooks/queries/customer/useCart';
import { useRouter } from 'next/navigation';
import { Menu, MenuItem } from '@/ui-kit/menu';
import useMenu from '@/hooks/useMenu';
import { useNavigationEvent } from '@/hooks/useNavigationEvent';
import { formatPrice } from '@/utils/currency';
import { useState } from 'react';
import { Loader } from '@/ui-kit/adornments';
import { getCustomerOrderItemActions } from '@/services/API/allCustomers';
import { Rates } from '@/types/exchange-rate';

dayjs.extend(isSameOrAfter);

interface MyOrdersProps {
  order: Order;
  item: OrderItem;
}

const ProductName = styled(MuiLink)(() => ({
  display: 'block',
  fontStyle: 'normal',
  fontWeight: '400',
  fontSize: '18px',
  color: '#333E5C',
  minWidth: '234px',
}));

const Price = styled(Typography)(() => ({
  fontSize: '18px',
  fontWeight: '600',
  color: '#333E5C',
}));

const Item = styled('div')(({ theme }) => ({
  display: 'flex',
  width: '100%',

  [theme.breakpoints.down('sm')]: {
    flexDirection: 'column',
    gap: '12px',
    padding: '20px',
  },
}));

const Card = styled('div')(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  padding: '24px',
  boxShadow:
    '0px 4px 20px rgba(0, 0, 0, 0.04), 0px 0.500862px 6.63642px rgba(0, 0, 0, 0.02)',
  borderRadius: '10px',
  gap: '16px',

  [theme.breakpoints.down('sm')]: {
    gap: '0',
    padding: '0',
  },
}));

const OrderTop = styled('div')(({ theme }) => ({
  display: 'flex',
  justifyContent: 'space-between',
  gap: '24px',
  alignItems: 'center',

  [theme.breakpoints.down('md')]: {
    padding: '20px',
    paddingTop: '24px',
  },
}));

const OrderChildStyle = styled(Typography)(() => ({
  marginLeft: '3px',
  fontWeight: '500',
  fontSize: '14px',
}));

const SellerName = styled(MuiLink)(({ theme }) => ({
  marginLeft: '3px',
  fontSize: '14px',
  fontWeight: '500',
  textDecoration: 'none',
  padding: 0,
  color: theme.palette.primary.main,
  lineHeight: theme.typography.body1.lineHeight,
}));

const OrderMain = styled(Typography)(() => ({
  fontSize: '14px',
}));

const FlexBox = styled('div')(() => ({
  display: 'flex',
}));

const ProductImageContainer = styled('a')(({ theme }) => ({
  height: '96px',
  width: '96px',
  overflow: 'hidden',
  position: 'relative',
  borderRadius: '10px',
  backgroundColor: theme.palette.grey[50],

  [theme.breakpoints.down('sm')]: {
    width: '80px',
    minWidth: '80px',
    height: '80px',
  },
}));

const OrderPrice = ({
  price,
  // rates,
  orderCurrency,
}: {
  price: number;
  rates: Rates | null;
  orderCurrency: Order['paymentCurrency'];
}) => {
  // const currency = useActualCurrency();
  // const converter = createCurrencyConverter(rates ?? {});
  //
  // const isSameCurrency = orderCurrency === currency;

  return (
    <>
      <Price className="text-[18px] font-semibold text-text-primary">
        {formatPrice(price, {
          locale: false,
          currency: orderCurrency ?? undefined,
        })}
      </Price>
      {/* {!isSameCurrency && ( */}
      {/*   <Price className="text-[18px] font-semibold text-text-primary"> */}
      {/*     {formatPrice( */}
      {/*       converter(price, { */}
      {/*         from: orderCurrency, */}
      {/*         to: currency, */}
      {/*       }), */}
      {/*       { currency, locale: false }, */}
      {/*     )} */}
      {/*   </Price> */}
      {/* )} */}
    </>
  );
};

const ActionsButton = ({ item }: { item: OrderItem }) => {
  const {
    handleClick,
    handleClose,
    open,
    anchorEl,
    buttonAria: buttonProps,
    menuAria: menuProps,
  } = useMenu();

  useNavigationEvent(() => handleClose());

  const [actions, setActions] = useState<{
    canRefund: boolean;
    canReview: boolean;
  } | null>(null);

  return (
    <>
      <Menu
        {...menuProps}
        open={open}
        onClose={handleClose}
        anchorEl={anchorEl}
      >
        {actions !== null ? (
          <>
            <MenuItem
              href={routes.DASHBOARD.CREATE_REFUND_RETURN(item.id)}
              disabled={!actions.canRefund}
            >
              Return Item
            </MenuItem>
            <MenuItem
              href={routes.PRODUCTS.REVIEW(
                item.product.slug,
                item.product.id,
                item.id,
              )}
              disabled={!actions.canReview}
            >
              Add Review
            </MenuItem>
          </>
        ) : (
          <div className="flex items-center justify-center p-4">
            <Loader size={32} />
          </div>
        )}
      </Menu>
      <Button
        {...buttonProps}
        onClick={(e) => {
          getCustomerOrderItemActions(item.id)
            .then((res) => {
              if (res) {
                setActions(res);
              }
            })
            .catch(() => {
              //console.log(err);
            });
          handleClick(e);
        }}
        variant="text"
        size="small"
        sx={{
          marginLeft: {
            xs: '3px',
            md: '0',
          },
          padding: '0',
          fontSize: '14px',
          lineHeight: 'normal',
        }}
      >
        Options
      </Button>
    </>
  );
};

const BuyWishButtons = ({ item }: Pick<MyOrdersProps, 'item'>) => {
  const { push } = useRouter();
  const { cart, isLoading: isLoadingCart } = useCart();
  const { addWishlist, removeWishlist } = useWishlistActions();
  const { wishlist, isLoading: isLoadingWish } = useWishlist();
  const { addToCart } = useCartActions();

  const isWish = Boolean(wishlist[item.product.id]);
  const isCart = Boolean(cart[item.product.id]);

  return (
    <div className="flex flex-1">
      <div className="ml-0 flex w-full gap-4 sm:ml-auto sm:w-auto">
        <Button
          sx={{
            width: {
              xs: '100%',
              sm: '150px',
            },
            height: '40px',
            borderRadius: '2px',
          }}
          variant={isCart ? 'contained' : 'outlined'}
          disabled={isLoadingCart}
          size="large"
          onClick={() =>
            isCart ? push(routes.CART.INDEX) : addToCart(item.product, 1)
          }
        >
          {isCart ? 'In cart' : 'Buy'}
        </Button>
        <Button
          sx={{
            height: '40px',
            width: 'fit-content',
            minWidth: 'auto',
            borderRadius: '2px',
            p: '8px',
          }}
          disabled={isLoadingWish}
          variant="outlined"
          color={isWish ? 'error' : 'primary'}
          onClick={() =>
            isWish ? removeWishlist(item.product) : addWishlist(item.product)
          }
        >
          {isWish ? <Heart size={24} weight="fill" /> : <Heart size={24} />}
        </Button>
      </div>
    </div>
  );
};

const MyOrderItem: React.FC<MyOrdersProps> = ({ order, item }) => {
  let status!: string;
  let statusColor!: string;
  let statusBg!: string;

  switch (item.status) {
    case OrderItemStatus.CREATED:
      status = 'Waiting for fulfillment';
      statusColor = 'text-warning-main';
      statusBg = 'bg-warning-main';
      break;
    case OrderItemStatus.PENDING_REFUND:
      status = 'Pending Refund';
      statusColor = 'text-warning-main';
      statusBg = 'bg-warning-main';
      break;
    case OrderItemStatus.CANCELED_REFUND:
      status = 'Cancelled Refund';
      statusColor = 'text-error-main';
      statusBg = 'bg-error-main';
      break;
    case OrderItemStatus.REFUNDED:
      status = 'Refunded';
      statusColor = 'text-error-main';
      statusBg = 'bg-error-main';
      break;
    case OrderItemStatus.SHIPPED:
      status = 'In delivery';
      statusColor = 'text-warning-main';
      statusBg = 'bg-warning-main';
      break;
    case OrderItemStatus.DELIVERED:
      status = 'Retrieved';
      statusColor = 'text-success-main';
      statusBg = 'bg-success-main';
      break;
    case OrderItemStatus.CANCELED:
      status = 'Cancelled';
      statusColor = 'text-error-main';
      statusBg = 'bg-error-main';
      break;
  }

  return (
    <Card>
      <div className="hidden md:block">
        <OrderTop>
          <Grid container spacing={3}>
            <Grid item>
              <FlexBox>
                <OrderMain> Order: </OrderMain>
                <OrderChildStyle>{order.orderNumber}</OrderChildStyle>
              </FlexBox>
            </Grid>
            <Grid item>
              <FlexBox>
                <OrderMain> Order Date: </OrderMain>
                <OrderChildStyle>
                  {dayjs(order.createdAt).format('D MMMM YYYY')}
                </OrderChildStyle>
              </FlexBox>
            </Grid>

            <Grid item xl>
              <FlexBox>
                <OrderMain> Seller Name: </OrderMain>
                {order.store && (
                  <Link
                    passHref
                    legacyBehavior
                    href={routes.STORES.INFO(order.store.slug)}
                  >
                    <SellerName>{order.store.name}</SellerName>
                  </Link>
                )}
              </FlexBox>
            </Grid>
            <Grid item>
              <FlexBox>
                <OrderMain> Status: </OrderMain>
                <OrderChildStyle className={statusColor}>
                  {status}
                </OrderChildStyle>
              </FlexBox>
            </Grid>
            <Grid item>
              <FlexBox>
                <ActionsButton item={item} />
              </FlexBox>
            </Grid>
          </Grid>
        </OrderTop>
      </div>
      <div className="relative block md:hidden">
        <div
          className={`absolute right-0 top-0 flex h-5 items-center justify-center rounded-[0_6px] px-2.5 ${statusBg}`}
        >
          <Typography className="text-xs/[18px] font-normal text-white">
            {status}
          </Typography>
        </div>
        <OrderTop>
          <Grid container rowSpacing={1}>
            <Grid item xs={6}>
              <FlexBox>
                <OrderMain> Order: </OrderMain>
                <OrderChildStyle>{order.orderNumber}</OrderChildStyle>
              </FlexBox>
            </Grid>

            <Grid
              item
              xs={6}
              display="flex"
              justifyContent="flex-end"
              alignItems="center"
            >
              <FlexBox>
                <OrderMain>Date: </OrderMain>
                <OrderChildStyle>
                  {dayjs(order.createdAt).format('D MMMM YYYY')}
                </OrderChildStyle>
              </FlexBox>
            </Grid>

            <Grid item xs={6}>
              <FlexBox>
                <OrderMain> Seller: </OrderMain>

                {order.store && (
                  <Link
                    passHref
                    legacyBehavior
                    href={routes.STORES.INFO(order.store.slug)}
                  >
                    <SellerName>{order.store.name}</SellerName>
                  </Link>
                )}
              </FlexBox>
            </Grid>

            <Grid
              item
              xs={6}
              display="flex"
              justifyContent="flex-end"
              alignItems="center"
            >
              <FlexBox>
                <OrderMain> Action: </OrderMain>
                <ActionsButton item={item} />
              </FlexBox>
            </Grid>
          </Grid>
        </OrderTop>
      </div>

      <Divider />

      <Item>
        <div className="flex flex-1 gap-4">
          <Link
            passHref
            legacyBehavior
            href={routes.PRODUCTS.INFO(item.product.slug, item.product.id)}
          >
            <ProductImageContainer>
              <Image
                src={item?.product.images?.[0]?.url}
                alt={item?.product.name}
                fill
                className="object-cover"
              />
            </ProductImageContainer>
          </Link>
          <div className="flex-1">
            <Link
              passHref
              legacyBehavior
              href={routes.PRODUCTS.INFO(item.product.slug, item.product.id)}
            >
              <ProductName
                underline="hover"
                className="contents break-words lg:block"
              >
                {item?.product.name}
              </ProductName>
            </Link>
            <div className="block lg:hidden">
              <OrderPrice
                price={item?.totalPrice}
                rates={order?.rates}
                orderCurrency={order?.paymentCurrency}
              />
            </div>
          </div>
          <div className="mr-2 hidden lg:ml-[52px] lg:block">
            <OrderPrice
              price={item?.totalPrice}
              rates={order?.rates}
              orderCurrency={order?.paymentCurrency}
            />
          </div>
        </div>
        <BuyWishButtons item={item} />
      </Item>
    </Card>
  );
};

export default MyOrderItem;
