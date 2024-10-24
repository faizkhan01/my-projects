import NextLink from 'next/link';
import {
  DataGridColDef,
  DataGridRowActions,
  MobileDataTable,
  NewDataTable,
} from '@/ui-kit/tables';
import { styled } from '@mui/material/styles';
import dayjs from 'dayjs';
import { SellerOrder } from '@/types/sellerOrders';
import { Typography, Box, Link } from '@mui/material';
import { upperFirst } from 'lodash';
import routes from '@/constants/routes';
import { OrderFulfillmentStatus, OrderPaymentStatus } from '@/types/orders';
import { ChatCircle } from '@phosphor-icons/react';
import { useMemo, useState } from 'react';
import { useSocketStore } from '@/hooks/stores/useSocketStore';
import { BackLinkButton } from '@/ui-kit/buttons';
import { MobileHeading } from '@/ui-kit/typography';
import { CellContext } from '@tanstack/react-table';
import { formatPrice } from '@/utils/currency';
import { createCurrencyConverter } from '@/hooks/stores/useCurrencyConverterStore';
import { useSellerCurrency } from '@/hooks/queries/useProfile';

interface SellerOrdersProps {
  sellerOrders: SellerOrder[];
}

export const BoxStyle = styled(Box)(({ theme }) => ({
  display: 'grid',
  alignItems: 'center',
  backgroundColor: 'common.white',
  boxShadow:
    '0px 4px 53px rgba(0, 0, 0, 0.04), 0px 0.500862px 6.63642px rgba(0, 0, 0, 0.02)',
  marginBottom: '96px',
  borderRadius: '10px',

  [theme.breakpoints.down('sm')]: {
    marginBottom: '60px',
  },
}));

const getBackgroundColorForFulfilmentStatus = (
  status: OrderFulfillmentStatus,
) => {
  switch (status) {
    case OrderFulfillmentStatus.FULFILLED:
      return 'bg-primary-main';
    case OrderFulfillmentStatus.UNFULFILLED:
      return 'bg-warning-main';
    case OrderFulfillmentStatus.PARTIALLY_FULFILLED:
      return 'bg-warning-main';
  }
};

const formatStatus = (value: string) =>
  upperFirst(value.toLowerCase().split('_').join(' '));

const tableTitle = 'All Orders';

const OrdersPage = ({ sellerOrders = [] }: SellerOrdersProps) => {
  const sellerCurrency = useSellerCurrency();
  const [isCreatingChat, setIsCreatingChat] = useState(false);

  const createChat = useSocketStore((state) => state.createChat);

  const { columns, mobileColumns } = useMemo(() => {
    const columnIdsToHideOnMobile = {
      fulfillmentStatus: 'fulfillmentStatus',
      actions: 'actions',
    };

    const getRowActions = (params: CellContext<SellerOrder, unknown>) => (
      <DataGridRowActions
        {...params}
        actions={[
          <DataGridRowActions.Action
            disabled={isCreatingChat}
            onClick={async () => {
              if (!params?.row?.original.customer?.id || isCreatingChat) return;
              setIsCreatingChat(true);
              createChat({
                userId: params?.row?.original.customer?.id,
              });
            }}
            icon={<ChatCircle size={18} className="text-primary-main" />}
            label="Chat with client"
            key={`chat-with-client-${params.row.id}`}
            showInMenu
          />,
        ]}
      />
    );

    const result: DataGridColDef<SellerOrder>[] = [
      {
        accessorFn: (row) => row?.orderNumber || row?.id,
        header: 'Order Number',
        size: 150,
        meta: {
          mobileHideLabel: true,
          mobileColSpan: 2,
        },
        cell: (params) => {
          const status = params.row.original.fulfillmentStatus;
          return (
            <div className="flex w-full items-center justify-between">
              <div className="flex items-center gap-3.5">
                <Link
                  component={NextLink}
                  href={routes.SELLER_DASHBOARD.ORDERS.INFO(
                    params.row.original.id,
                  )}
                  color="text.primary"
                >
                  #{params.row.original.orderNumber}
                </Link>

                <div
                  className={`${getBackgroundColorForFulfilmentStatus(
                    status,
                  )} flex h-5 items-center justify-center rounded-md px-2.5 py-0.5 text-xs font-medium text-white md:hidden`}
                >
                  {formatStatus(status)}
                </div>
              </div>
              <div className="md:hidden">{getRowActions(params)}</div>
            </div>
          );
        },
      },
      {
        accessorKey: 'createdAt',
        header: 'Date',
        size: 180,
        cell: (params) =>
          dayjs(params.getValue() as SellerOrder['createdAt']).format(
            'MMM D, YYYY h:mm a',
          ),
      },
      {
        accessorKey: 'client',
        header: 'Client',
        size: 140,
        accessorFn: (row) => {
          if (row.customer) {
            const { firstName, lastName } = row.customer;
            return `${firstName} ${lastName}`;
          } else {
            const { firstName, lastName } = row.shipping;
            return `${firstName} ${lastName}`;
          }
        },
      },
      {
        accessorKey: 'paymentStatus',
        header: 'Payment',
        size: 130,
        cell: (params) => {
          const value = params.row.original.paymentStatus;
          return (
            <div className="flex items-center gap-1">
              <Box
                component="span"
                sx={{
                  display: 'inline-block',
                  width: 6,
                  height: 6,
                  borderRadius: '50%',
                  backgroundColor: () => {
                    switch (value) {
                      case OrderPaymentStatus.PAID:
                        return 'primary.main';
                      case OrderPaymentStatus.UNPAID:
                        return 'warning.main';
                      case OrderPaymentStatus.REFUNDED:
                        return 'error.main';
                      case OrderPaymentStatus.PARTIALLY_REFUNDED:
                        return 'warning.main';
                    }
                  },
                }}
              />
              <Typography
                component="span"
                style={{
                  fontStyle: 'normal',
                  fontWeight: 400,
                  fontSize: '14px',
                  lineHeight: '18px',
                }}
              >
                {formatStatus(value)}
              </Typography>
            </div>
          );
        },
      },
      {
        id: columnIdsToHideOnMobile.fulfillmentStatus,
        accessorKey: 'fulfillmentStatus',
        header: 'Status',
        size: 130,
        cell: (params) => {
          const value = params.row.original.fulfillmentStatus;
          return (
            <div className="flex items-center gap-1">
              <Box
                component="span"
                className={`${getBackgroundColorForFulfilmentStatus(value)}`}
                sx={{
                  display: 'inline-block',
                  width: 6,
                  height: 6,
                  borderRadius: '50%',
                }}
              />
              <Box
                component="span"
                sx={{
                  fontStyle: 'normal',
                  fontWeight: 400,
                  fontSize: '14px',
                  lineHeight: '18px',
                }}
              >
                {formatStatus(value)}
              </Box>
            </div>
          );
        },
      },
      {
        header: 'Total Price',
        size: 100,
        accessorFn: (row) =>
          row.items.reduce((acc, current) => {
            return (
              acc +
              (row.rates
                ? createCurrencyConverter(row.rates)(current.totalPrice, {
                    from: row.paymentCurrency,
                    to: sellerCurrency,
                  })
                : current.totalPrice)
            );
          }, 0),
        cell: (params) => {
          const value = params.getValue() as number;
          return formatPrice(value, { currency: sellerCurrency });
        },
      },
      {
        id: columnIdsToHideOnMobile.actions,
        header: 'Actions',
        size: 155,
        cell: (params) => {
          return getRowActions(params);
        },
      },
    ];

    const mobileResult = result.filter((r) => {
      if (!r.id) return true;
      return Object.values(columnIdsToHideOnMobile).indexOf(r.id) === -1;
    });

    return {
      columns: result,
      mobileColumns: mobileResult,
    };
  }, [createChat, isCreatingChat, sellerCurrency]);

  return (
    <div>
      <BackLinkButton />
      <MobileHeading title="Orders" />
      <BoxStyle>
        <NewDataTable
          title={tableTitle}
          data={sellerOrders}
          columns={columns}
          hideOnMobile
          // rowHeight={60}
          // sx={{ height: 658 }}
        />
        <MobileDataTable
          title={tableTitle}
          columns={mobileColumns}
          columnNumber={2}
          data={sellerOrders}
        />
      </BoxStyle>
    </div>
  );
};

export default OrdersPage;
