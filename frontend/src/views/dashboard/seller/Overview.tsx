import { styled } from '@mui/material/styles';
import {
  Box,
  Typography,
  Grid,
  List,
  ListItem,
  ListItemText,
  ListItemButton,
  Divider,
  Skeleton,
  TypographyProps,
  IconButton,
  Badge,
  Tooltip,
} from '@mui/material';
import { ArrowsLeftRight, CaretRight } from '@phosphor-icons/react';
import Image from 'next/image';
import Link from 'next/link';
import useSWR from 'swr';
import { getSellerOverview } from '@/services/API/seller/overview';
import { getSellerBalance } from '@/services/API/seller/balance';
import { useNotifications } from '@/hooks/queries/useNotifications';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import routes from '@/constants/routes';
import { Notification } from '@/types/notifications';
import { Fragment, useMemo, useState } from 'react';
import { ConditionalWrapper } from '@/ui-kit/containers';
import { formatPrice } from '@/utils/currency';

dayjs.extend(relativeTime);

const Item = styled(Box)(({ theme }) => ({
  paddingBlock: '24px',
  borderBottom: '1px solid #EAECF4',
  '&:last-child': {
    borderBottom: '0',
    paddingBottom: '0',
  },

  [theme.breakpoints.down('sm')]: {},
}));

const StyledBox = styled(Box)(({ theme }) => ({
  background: '#FFFFFF',
  boxShadow:
    '0px 4px 53px rgba(0, 0, 0, 0.04), 0px 0.500862px 6.63642px rgba(0, 0, 0, 0.02)',
  borderRadius: '10px',
  padding: '24px',
  [theme.breakpoints.down('sm')]: {},
}));

const ProductImageHolder = styled(Box)(({ theme }) => ({
  position: 'relative',
  height: '96px',
  width: '96px',
  borderRadius: '10px',
  overflow: 'hidden',
  [theme.breakpoints.down('sm')]: {},
}));

const StyledBoxHeading = styled((props) => (
  <Typography component="h4" {...props} />
))<TypographyProps<'h4'>>(({ theme }) => ({
  fontSize: '18px',
  fontWeight: '600',
  [theme.breakpoints.down('sm')]: {},
}));

const LISTITEM_STYLES = {
  '& .MuiTypography-root': {
    color: '#333E5C',
    fontSize: '16px',
    lineHeight: '18px',
  },
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
};

const Activity = ({
  isLoading,
  notifications = [],
}: {
  isLoading: boolean;
  notifications?: Notification[];
}) => {
  return (
    <StyledBox>
      <StyledBoxHeading mb={0}>Activity</StyledBoxHeading>
      {isLoading
        ? new Array(3)
            .fill(0)
            .map((_, index) => (
              <Skeleton height={88} width="100%" key={`${index}-activity`} />
            ))
        : notifications.map((notification) => {
            const isToday = dayjs(notification.createdAt).isSame(
              dayjs(),
              'day',
            );

            return (
              <Item key={notification.id}>
                <Typography fontSize={16}>{notification.message}</Typography>
                <Typography fontSize={14} color="text.secondary" mt={0.5}>
                  {isToday
                    ? dayjs(notification.createdAt).fromNow()
                    : dayjs(notification.createdAt).format('DD MMMM')}
                </Typography>
              </Item>
            );
          })}
    </StyledBox>
  );
};

const Overview = (): JSX.Element => {
  const { data: overviewData, isLoading: loadingOverview } = useSWR(
    '/users/sellers/overview',
    async () => getSellerOverview(),
  );
  const [showPending, setShowPending] = useState(false);

  const { isLoading: loadingNotifications, notifications } = useNotifications();

  const { data: balanceData, isLoading: loadingBalance } = useSWR(
    '/balance',
    async () => getSellerBalance(),
  );

  const isLoading = loadingBalance || loadingOverview || loadingNotifications;
  const availableBalance = useMemo(
    () =>
      balanceData?.available.find((b) => b.amount !== 0) ||
      balanceData?.available?.[0],
    [balanceData],
  );
  const pendingBalance = useMemo(
    () =>
      balanceData?.pending.find((b) => b.amount !== 0) ||
      balanceData?.pending?.[0],
    [balanceData],
  );
  const balance = showPending ? pendingBalance : availableBalance;

  return (
    <>
      <Typography mb={1} fontWeight={600} fontSize={24}>
        Overview
      </Typography>
      <Typography fontSize={16} mb={3}>
        Here&apos;s some of the information we&apos;ve gathered about your store
      </Typography>
      <Grid container spacing="30px">
        <Grid item xs={12} md={8}>
          <Grid container spacing={{ xs: '15px', sm: '30px' }}>
            <Grid item xs={6}>
              <StyledBox sx={{ height: '100%' }}>
                <Box
                  sx={{ display: 'flex', gap: 1, mb: 2, alignItems: 'center' }}
                >
                  <StyledBoxHeading>Balance</StyledBoxHeading>
                  <Tooltip
                    title={
                      showPending
                        ? 'Show available balance'
                        : 'Show pending balance'
                    }
                    placement="right"
                  >
                    <IconButton
                      size="small"
                      onClick={() => {
                        setShowPending((pending) => !pending);
                      }}
                    >
                      <ArrowsLeftRight size={18} />
                    </IconButton>
                  </Tooltip>
                </Box>
                <ConditionalWrapper
                  condition={showPending}
                  wrapper={(c) => (
                    <Badge color="warning" variant="dot">
                      <Box sx={{ pr: 1 }}>{c}</Box>
                    </Badge>
                  )}
                >
                  <Typography fontWeight={600} fontSize={24}>
                    {isLoading ? (
                      <Skeleton />
                    ) : (
                      balance &&
                      formatPrice(balance.amount / 100, {
                        currency: balance.currency,
                        currencyDisplay: 'code',
                        locale: false,
                      })
                    )}
                  </Typography>
                </ConditionalWrapper>
              </StyledBox>
            </Grid>
            <Grid item xs={6}>
              <StyledBox
                sx={{
                  height: '100%',
                }}
              >
                <StyledBoxHeading mb={2}>Orders</StyledBoxHeading>
                <Typography fontWeight={600} fontSize={24}>
                  {isLoading ? <Skeleton /> : overviewData?.total_orders}
                </Typography>
              </StyledBox>
            </Grid>
            <Grid item xs={12}>
              <StyledBox
                sx={{
                  height: '100%',
                }}
              >
                <StyledBoxHeading mb={2}>Total Revenue</StyledBoxHeading>
                <Typography fontWeight={600} fontSize={24}>
                  {isLoading ? (
                    <Skeleton />
                  ) : (
                    formatPrice(overviewData?.total_revenue?.sum || 0, {
                      currencyDisplay: 'code',
                      locale: false,
                      currency: overviewData?.total_revenue?.currency,
                    })
                  )}
                </Typography>
              </StyledBox>
            </Grid>
          </Grid>
          <StyledBox sx={{ padding: '8px', marginTop: '30px' }}>
            <List disablePadding>
              <ListItem disablePadding>
                {isLoading ? (
                  <Skeleton height={60} width="100%" variant="rounded" />
                ) : (
                  <ListItemButton
                    sx={{ borderRadius: '10px', padding: '16px' }}
                    component={overviewData?.pending_orders ? Link : 'button'}
                    href={
                      overviewData?.pending_orders
                        ? routes.SELLER_DASHBOARD.ORDERS.LIST
                        : undefined
                    }
                  >
                    <ListItemText
                      sx={LISTITEM_STYLES}
                      primary={
                        overviewData?.pending_orders
                          ? `${overviewData.pending_orders} orders are ready to fulfill`
                          : 'No orders are ready to fulfill'
                      }
                      secondary={
                        !!overviewData?.pending_orders && (
                          <CaretRight
                            size={16}
                            color="text.secondary"
                            weight="light"
                          />
                        )
                      }
                    />
                  </ListItemButton>
                )}
              </ListItem>
              <Divider variant="middle" sx={{ marginBlock: '8px' }} />
              <ListItem disablePadding>
                {isLoading ? (
                  <Skeleton height={60} width="100%" variant="rounded" />
                ) : (
                  <ListItemButton
                    sx={{ borderRadius: '10px', padding: '16px' }}
                    component={
                      overviewData?.products_out_of_stock.length
                        ? Link
                        : 'button'
                    }
                    href={
                      overviewData?.products_out_of_stock.length
                        ? routes.SELLER_DASHBOARD.PRODUCTS.LIST
                        : undefined
                    }
                  >
                    <ListItemText
                      sx={LISTITEM_STYLES}
                      primary={
                        overviewData?.products_out_of_stock.length
                          ? `${overviewData.products_out_of_stock.length} ${
                              overviewData.products_out_of_stock.length > 1
                                ? 'products'
                                : 'product'
                            } are out of stock`
                          : 'No products are out of stock'
                      }
                      secondary={
                        !!overviewData?.products_out_of_stock.length && (
                          <CaretRight
                            size={16}
                            color="text.secondary"
                            weight="light"
                          />
                        )
                      }
                    />
                  </ListItemButton>
                )}
              </ListItem>
            </List>
          </StyledBox>

          <Box sx={{ mt: 2, display: { xs: 'block', md: 'none' } }}>
            <Activity
              isLoading={isLoading}
              notifications={notifications?.[0].results}
            />
          </Box>

          <StyledBox mt={3}>
            <StyledBoxHeading mb={3}>Best Product</StyledBoxHeading>
            <List disablePadding>
              {isLoading &&
                new Array(3).fill(0).map((_, index) => (
                  <Fragment key={`${index}-loading-best-product`}>
                    <Skeleton
                      height={90}
                      width="100%"
                      variant="rounded"
                      component={ListItem}
                    />
                    {index !== 2 && <Divider sx={{ marginBlock: '24px' }} />}
                  </Fragment>
                ))}
            </List>

            {!isLoading && !overviewData?.best_products.length && (
              <ListItem disablePadding>
                <ListItemText>
                  We&apos;re still gathering data about your store
                </ListItemText>
              </ListItem>
            )}

            {Boolean(!isLoading && overviewData?.best_products.length) &&
              overviewData?.best_products.map((product, index) => {
                return (
                  <Box
                    key={product.id}
                    component="li"
                    sx={{
                      listStyle: 'none',
                    }}
                  >
                    <Grid container spacing="16px">
                      <Grid item xs="auto">
                        <ProductImageHolder>
                          <Image
                            src={product.images?.[0]?.url}
                            fill
                            alt="Product Image"
                          />
                        </ProductImageHolder>
                      </Grid>
                      <Grid item xs container>
                        <Grid item xs>
                          <Typography fontSize={18} lineHeight="21.6px">
                            {product.name}
                          </Typography>
                        </Grid>
                        <Grid item>
                          <Typography
                            fontSize={18}
                            fontWeight={600}
                            lineHeight="21.6px"
                          >
                            {formatPrice(product.price, {
                              currency: product.currency,
                            })}
                          </Typography>
                        </Grid>

                        <Grid
                          item
                          xs={12}
                          sx={{
                            display: 'flex',
                            alignItems: 'flex-end',
                          }}
                        >
                          <Typography
                            fontSize={14}
                            color="text.secondary"
                            lineHeight="16px"
                          >
                            {product.orderItems.length} Orders
                          </Typography>
                        </Grid>
                      </Grid>
                    </Grid>
                    {index !== overviewData.best_products.length - 1 && (
                      <Divider sx={{ marginBlock: '24px' }} />
                    )}
                  </Box>
                );
              })}
          </StyledBox>
        </Grid>
        <Grid
          item
          xs={12}
          md={4}
          sx={{
            display: {
              xs: 'none',
              md: 'block',
            },
          }}
        >
          <Activity
            isLoading={isLoading}
            notifications={notifications?.[0].results}
          />
        </Grid>
      </Grid>
    </>
  );
};

export default Overview;
