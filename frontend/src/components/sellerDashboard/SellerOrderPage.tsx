import routes from '@/constants/routes';
import {
  Box,
  Typography,
  Grid,
  Button,
  IconButton,
  Tooltip,
  useMediaQuery,
  Theme,
} from '@mui/material';
import Image from 'next/image';
import Link from 'next/link';
import { styled } from '@mui/material/styles';
import { BottomPageActions } from '../dashboard/BottomPageActions';
import { ClientOrder } from '@/types/orders';
import { formatAddress } from '@/utils/formatters';
import { BackLinkButton, ContainedButton } from '@/ui-kit/buttons';
import { DataGrid, DataGridColDef } from '@/ui-kit/tables';
import { MobileHeading } from '@/ui-kit/typography';
import { upperFirst } from 'lodash';
import { OrderItemStatus } from '@/types/orders';
import { PDFDownloadLink } from '@react-pdf/renderer';
import InvoicePage from '../dynamicPDF/InvoicePage';
import { ChatCircle } from '@phosphor-icons/react';
import { useSocketStore } from '@/hooks/stores/useSocketStore';
import { memo, useCallback, useMemo, useState } from 'react';
import { formatPhoneNumberIntl } from 'react-phone-number-input';
import useSWR from 'swr';
import { ORDERS } from '@/constants/api';
import { getInvoiceData } from '@/services/API/orders';
import MobileDataGrid from '@/ui-kit/tables/MobileDataGrid';
import { useSellerCurrency } from '@/hooks/queries/useProfile';
import {
  createCurrencyConverter,
  useCurrencyConverter,
} from '@/hooks/stores/useCurrencyConverterStore';
import { calculatePrice, formatPrice } from '@/utils/currency';

const StyledBox = styled(Box)(({ theme }) => ({
  backgroundColor: theme.palette.common.white,
  boxShadow:
    '0px 4px 53px rgba(0, 0, 0, 0.04), 0px 0.500862px 6.63642px rgba(0, 0, 0, 0.02)',
  padding: '24px',
  borderRadius: '10px',
}));

const BoxForDivider = styled(Box)(({ theme }) => ({
  backgroundColor: theme.palette.common.white,
  boxShadow:
    '0px 4px 53px rgba(0, 0, 0, 0.04), 0px 0.500862px 6.63642px rgba(0, 0, 0, 0.02)',
  borderRadius: '10px',
}));

const UpPaddingBox = styled(Box)(() => ({
  padding: '24px 24px 0px 24px',
}));

const DownPaddingBox = styled(Box)(() => ({
  padding: '0px 24px 24px 24px',
}));

const RedBox = styled(Box)(({ theme }) => ({
  width: '105px',
  height: '32px',
  fontStyle: 'normal',
  fontWeight: '400',
  fontSize: '16px',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  color: theme.palette.error.main,
  backgroundColor: theme.palette.error.light,

  [theme.breakpoints.down('sm')]: {
    width: '96px',
    height: '30px',
    fontSize: '14px',
  },
}));

const BlueBox = styled(Box)(({ theme }) => ({
  width: '105px',
  height: '32px',
  fontStyle: 'normal',
  fontWeight: '400',
  fontSize: '16px',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  color: theme.palette.common.white,
  backgroundColor: theme.palette.primary.main,

  [theme.breakpoints.down('sm')]: {
    width: '96px',
    height: '30px',
    fontSize: '14px',
  },
}));

const MainHeading = styled(Typography)(({ theme }) => ({
  fontStyle: 'normal',
  fontWeight: '600',
  fontSize: '24px',
  color: theme.palette.text.primary,

  [theme.breakpoints.down('sm')]: {
    fontSize: '18px',
  },
}));

const TitleText = styled(Typography)(({ theme }) => ({
  fontStyle: 'normal',
  fontWeight: '400',
  fontSize: '12px',
  marginBottom: '8px',
  color: theme.palette.text.secondary,
}));

const PrimaryText = styled(Typography)(({ theme }) => ({
  fontStyle: 'normal',
  fontWeight: '400',
  fontSize: '14px',
  marginBottom: '16px',
  color: theme.palette.text.primary,

  [theme.breakpoints.down('sm')]: {
    fontSize: '12px',
  },
}));

const AddressText = styled(Typography)(({ theme }) => ({
  fontStyle: 'normal',
  fontWeight: '400',
  fontSize: '14px',
  color: theme.palette.text.primary,

  [theme.breakpoints.down('sm')]: {
    fontSize: '12px',
  },
}));

const MainText = styled(Typography)(({ theme }) => ({
  fontStyle: 'normal',
  fontWeight: '400',
  fontSize: '14px',
  marginBottom: '16px',
  color: theme.palette.primary.main,

  [theme.breakpoints.down('sm')]: {
    fontSize: '12px',
  },
}));

const BoxHeading = styled(Typography)(({ theme }) => ({
  fontStyle: 'normal',
  fontWeight: '600',
  fontSize: '18px',
  marginBottom: '16px',
  color: theme.palette.text.primary,
}));

const GenerateButton = styled(Button)(({ theme }) => ({
  fontStyle: 'normal',
  fontWeight: '400',
  fontSize: '18px',
  color: theme.palette.primary.main,
}));

const ProductImageContainer = styled(Box)(() => ({
  height: '40px',
  width: '40px',
  overflow: 'hidden',
  position: 'relative',
  borderRadius: '4px',
}));

interface SellerOrderPageProps {
  clientOrder: ClientOrder;
}

const InvoicesSection = memo(function InvoicesSection({
  orderId,
}: {
  orderId: number;
}) {
  const [isCreatingInvoice, setIsCreatingInvoice] = useState(false);
  const { data: invoice, isLoading } = useSWR(
    isCreatingInvoice ? ORDERS.INVOICE(orderId) : null,
    async () => getInvoiceData(orderId),
  );
  const sellerCurrency = useSellerCurrency();

  return (
    <StyledBox>
      <div className="flex items-center justify-between">
        <BoxHeading sx={{ margin: '0' }}>Invoices</BoxHeading>
        {invoice ? (
          <PDFDownloadLink
            document={
              <InvoicePage invoice={invoice} toCurrency={sellerCurrency} />
            }
            fileName={`invoice-${
              invoice?.order?.orderNumber ?? invoice?.order?.id
            }.pdf`}
          >
            {({ loading, error }) => (
              <GenerateButton disabled={loading}>
                {loading ? 'Loading...' : !error && 'Download Invoice'}
                {error && 'Error'}
              </GenerateButton>
            )}
          </PDFDownloadLink>
        ) : (
          <GenerateButton
            onClick={() => setIsCreatingInvoice(true)}
            disabled={isLoading}
          >
            {isLoading ? 'Loading...' : 'Generate'}
          </GenerateButton>
        )}
      </div>
    </StyledBox>
  );
});

const RightSection = ({ clientOrder }: SellerOrderPageProps) => {
  const [isCreatingChat, setIsCreatingChat] = useState(false);
  const createChat = useSocketStore((state) => state.createChat);
  const { shipping } = clientOrder;

  const handleChat = () => {
    if (!clientOrder?.customer?.id || isCreatingChat) return;
    setIsCreatingChat(true);

    createChat({
      userId: clientOrder.customer.id,
    });
  };
  return (
    <div className="top-0 flex flex-col gap-[30px] md:sticky">
      <StyledBox>
        <BoxHeading className="flex items-center justify-between">
          <span>Client</span>
          {clientOrder?.customer?.id && (
            <Tooltip title="Chat with client">
              <IconButton
                size="small"
                color="primary"
                disabled={isCreatingChat}
                onClick={handleChat}
              >
                <ChatCircle />
              </IconButton>
            </Tooltip>
          )}
        </BoxHeading>
        <TitleText>Name</TitleText>
        <PrimaryText>
          {clientOrder.customer?.firstName ??
            shipping?.firstName ??
            'Not Provided'}{' '}
          {clientOrder.customer?.lastName ??
            shipping?.lastName ??
            'Not Provided'}
        </PrimaryText>
        <TitleText>Email</TitleText>
        <PrimaryText className="break-all">
          {clientOrder.customer?.email ??
            clientOrder?.guestEmail ??
            shipping?.email ??
            'Not Provided'}
        </PrimaryText>
        <TitleText>Shipping Address</TitleText>
        <PrimaryText>
          {formatAddress({
            addressOne: shipping?.addressOne,
            city: shipping?.city,
            state: shipping?.state?.name,
            zipCode: shipping?.zipCode,
          })}
        </PrimaryText>
        <TitleText>Phone Number</TitleText>
        <AddressText>
          {formatPhoneNumberIntl(shipping.phone) || 'No Provided'}
        </AddressText>

        {/*<TitleText>Billing Address</TitleText>
              <PrimaryText>
                4517 Washington Ave. Manchester, Kentucky 39495
              </PrimaryText> */}
      </StyledBox>
      <InvoicesSection orderId={clientOrder.id} />
    </div>
  );
};

const DataTable = ({ clientOrder }: { clientOrder: ClientOrder }) => {
  const converter = useMemo(
    () => createCurrencyConverter(clientOrder.rates ?? {}),
    [clientOrder.rates],
  );
  const sellerCurrency = useSellerCurrency();
  const isMobile = useMediaQuery((theme: Theme) =>
    theme.breakpoints.down('md'),
  );

  const convertCurrency = useCallback(
    (price: number): number => {
      return (
        converter(price, {
          from: clientOrder.paymentCurrency,
          to: sellerCurrency,
        }) || 0
      );
    },
    [clientOrder, converter, sellerCurrency],
  );
  const formatCurrency = useCallback(
    (price: number): string => {
      return formatPrice(price, {
        currency: sellerCurrency,
      });
    },
    [sellerCurrency],
  );
  const { columns, mobileColumns } = useMemo(() => {
    const columns: DataGridColDef<ClientOrder['items'][0]>[] = [
      {
        id: 'product',
        accessorFn: (params) => params.product.name,
        header: 'Product',
        size: 150,
        meta: {
          align: 'left',
          headerAlign: 'left',
          mobileColSpan: 4,
        },
        cell: (params) => {
          const images = params.row.original.product?.images;
          const name = params.row.original.product?.name;

          const image = images?.[0];
          return (
            <div className="flex items-center gap-4 overflow-hidden">
              <div>
                {image && (
                  <ProductImageContainer>
                    <Image
                      src={image.url}
                      alt={`${name}-image`}
                      fill
                      style={{ objectFit: 'cover' }}
                    />
                  </ProductImageContainer>
                )}
              </div>
              <Typography
                title={name ?? ''}
                component="span"
                className="overflow-hidden text-ellipsis"
              >
                {name ?? ''}
              </Typography>
            </div>
          );
        },
      },
      {
        accessorKey: 'quantity',
        header: 'Quantity',
        meta: {
          align: 'left',
          headerAlign: 'left',
        },
      },
      {
        accessorFn: (params) => convertCurrency(params.unitPrice),
        header: 'Unit Price',
        meta: {
          align: 'left',
          headerAlign: 'left',
        },
        cell: ({ getValue }) => formatCurrency(getValue() as number),
      },
      {
        accessorFn: (params) => params.discount,
        header: 'Discount',
        meta: {
          align: 'left',
          headerAlign: 'left',
        },
        cell: ({ getValue }) => `${getValue() as number}%`,
      },
      {
        accessorFn: (params) => convertCurrency(params.shipping),
        header: 'Shipping',
        meta: {
          align: 'left',
          headerAlign: 'left',
        },
        cell: ({ getValue }) => formatCurrency(getValue() as number),
      },
      {
        accessorFn: (params) => convertCurrency(params.totalPrice),
        header: 'Total Price',
        meta: {
          align: 'left',
          headerAlign: 'left',
          description: 'Calculated after taxes, shipping and product discount',
        },
        cell: (params) => formatCurrency(params.getValue() as number),
      },
      {
        id: 'status',
        accessorFn: (params) =>
          upperFirst(params.status.toLowerCase().split('_').join(' ')),
        header: 'Status',
      },
    ];

    const mobileColumns: DataGridColDef<ClientOrder['items'][0]>[] =
      columns.filter((c) => c.id !== 'status');

    return {
      columns,
      mobileColumns,
    };
  }, [convertCurrency, formatCurrency]);

  return (
    <>
      <div className="px-6 md:px-0">
        {isMobile ? (
          <MobileDataGrid
            columns={mobileColumns}
            data={clientOrder.items}
            enableRowSelection={false}
            hideToolbar
            hideFooter
            columnNumber={4}
          />
        ) : (
          <DataGrid
            columns={columns}
            data={clientOrder.items}
            enableRowSelection={false}
            hideToolbar
            hideFooter
          />
        )}
      </div>
    </>
  );
};

const SellerOrderPage = ({ clientOrder }: SellerOrderPageProps) => {
  const sellerCurrency = useSellerCurrency();
  const converter = useCurrencyConverter();

  const convertCurrency = useCallback(
    (price: number): number => {
      return (
        converter(price, {
          from: clientOrder.paymentCurrency,
          to: sellerCurrency,
        }) || 0
      );
    },
    [clientOrder.paymentCurrency, converter, sellerCurrency],
  );
  const formatCurrency = useCallback(
    (price: number): string => {
      return formatPrice(price, {
        currency: sellerCurrency,
      });
    },
    [sellerCurrency],
  );

  return (
    <Box>
      <BackLinkButton />
      <MobileHeading title="Orders" />
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: {
            xs: '24px',
            sm: '30px',
          },
        }}
      >
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: '24px',
          }}
        >
          <MainHeading>
            Order #{clientOrder.orderNumber || clientOrder.id}
          </MainHeading>
          {clientOrder.fulfilled ? (
            <BlueBox>Fulfilled</BlueBox>
          ) : (
            <RedBox>Unfulfilled</RedBox>
          )}
        </Box>
      </Box>
      <Grid
        container
        direction={{
          xs: 'column-reverse',
          lg: 'row',
        }}
        spacing={'30px'}
        justifyContent="space-between"
        sx={{
          mb: '30px',
        }}
      >
        <Grid
          item
          xs={12}
          lg={8}
          sx={{
            maxWidth: '100% !important',
          }}
        >
          <StyledBox
            sx={{
              display: 'flex',
              gap: '30px',
              flexDirection: 'column',
              padding: 0,
            }}
          >
            <BoxForDivider sx={{ display: 'grid' }}>
              <UpPaddingBox>
                <Box
                  sx={{
                    display: 'flex',
                    gap: '4px',
                    alignItems: 'center',
                  }}
                >
                  <Box
                    sx={{
                      display: 'inline-block',
                      width: 8,
                      height: 8,
                      borderRadius: '50%',
                      marginBottom: { xs: '22px', md: '16px' },
                      backgroundColor: clientOrder.fulfilled
                        ? 'primary.main'
                        : 'error.main',
                    }}
                    component="span"
                  />
                  <BoxHeading
                    sx={{
                      marginBottom: { xs: '22px', md: '16px' },
                    }}
                  >{`${
                    clientOrder.fulfilled ? 'Fulfilled' : 'Unfulfilled'
                  }`}</BoxHeading>
                </Box>
              </UpPaddingBox>
              <DataTable clientOrder={clientOrder} />

              <DownPaddingBox
                sx={{
                  pt: '24px',
                }}
              >
                <Link
                  href={routes.SELLER_DASHBOARD.ORDERS.FULFILL(
                    Number(clientOrder.id),
                  )}
                  legacyBehavior
                  passHref
                >
                  <ContainedButton
                    className="w-full max-w-full md:max-w-[150px]"
                    disabled={clientOrder.items.every(
                      (i) => i.status !== OrderItemStatus.CREATED,
                    )}
                  >
                    Place an order
                  </ContainedButton>
                </Link>
              </DownPaddingBox>
            </BoxForDivider>
            <BoxForDivider>
              <UpPaddingBox>
                <Box
                  sx={{
                    display: 'flex',
                    gap: '4px',
                    alignItems: 'center',
                  }}
                >
                  <Box
                    component="span"
                    sx={{
                      display: 'inline-block',
                      width: 8,
                      height: 8,
                      borderRadius: '50%',
                      marginBottom: '16px',
                      backgroundColor: clientOrder.refunded
                        ? 'error.main'
                        : 'primary.main',
                    }}
                  />
                  <BoxHeading>
                    {clientOrder.refunded ? 'Refunded' : 'Paid'}
                  </BoxHeading>
                </Box>
                <Grid container>
                  <Grid item xs={5.5} sm={5.5}>
                    <PrimaryText>Intermediate total</PrimaryText>
                    <PrimaryText>Taxes</PrimaryText>
                    <PrimaryText>Shipping</PrimaryText>
                    <MainText>Total</MainText>
                  </Grid>
                  <Grid item xs={5} sm={5.5}>
                    <PrimaryText>
                      {clientOrder.items.length} elements
                    </PrimaryText>
                    <PrimaryText>Does not apply</PrimaryText>
                    {/* <PrimaryText>FedEX</PrimaryText> */}
                  </Grid>
                  <Grid item xs={1.5} sm={1}>
                    <PrimaryText>
                      {formatCurrency(
                        convertCurrency(
                          clientOrder.items.reduce((a, b) => {
                            return (
                              a +
                              calculatePrice({
                                price: b.unitPrice,
                                quantity: b.quantity,
                                discount: b.discount,
                              }).total
                            );
                          }, 0),
                        ),
                      )}
                    </PrimaryText>
                    <PrimaryText align="right">
                      {formatCurrency(
                        convertCurrency(
                          clientOrder.items.reduce((a, b) => a + b.tax, 0),
                        ),
                      )}
                    </PrimaryText>
                    <PrimaryText align="right">
                      {formatCurrency(
                        convertCurrency(
                          clientOrder.items.reduce((a, b) => a + b.shipping, 0),
                        ),
                      )}
                    </PrimaryText>
                    <MainText>
                      {formatCurrency(
                        convertCurrency(
                          clientOrder.items.reduce(
                            (a, b) => a + b.totalPrice,
                            0,
                          ),
                        ),
                      )}
                    </MainText>
                  </Grid>
                </Grid>
              </UpPaddingBox>
              {/* <Divider sx={{ marginBottom: '16px' }} /> */}
              {/* <DownPaddingBox> */}
              {/*   <Grid container justifyContent="space-between"> */}
              {/*     <Grid item xs={10.5} sm={11}> */}
              {/*       <PrimaryText>Pre-authorized amount</PrimaryText> */}
              {/*       <PrimaryText>Received amount</PrimaryText> */}
              {/*       <PrimaryText>Refunded amount</PrimaryText> */}
              {/*       <MainText>Unliquidated balance</MainText> */}
              {/*     </Grid> */}
              {/*     <Grid item xs={1.5} sm={1}> */}
              {/*       <PrimaryText>$418.42</PrimaryText> */}
              {/*       <PrimaryText align="right"> */}
              {/*         $ */}
              {/*         {clientOrder.items.reduce( */}
              {/*           (acc, current) => acc + current.totalPrice, */}
              {/*           0 */}
              {/*         )} */}
              {/*       </PrimaryText> */}
              {/*       <PrimaryText align="right">$0.00</PrimaryText> */}
              {/*       <MainText>$418.42</MainText> */}
              {/*     </Grid> */}
              {/*   </Grid> */}
              {/*   <ContainedButton */}
              {/*     sx={{ */}
              {/*       width: '100%', */}
              {/*       maxWidth: { */}
              {/*         xs: '100%', */}
              {/*         md: '130px', */}
              {/*       }, */}
              {/*     }} */}
              {/*     type="submit" */}
              {/*     title="Refund" */}
              {/*   /> */}
              {/* </DownPaddingBox> */}
            </BoxForDivider>
          </StyledBox>
          {/* <StyledBox>
            <BoxHeading>History</BoxHeading>
            <Box>
              <Timeline sx={{ p: 0 }}>
                <StyledLineItem>
                  <TimelineSeparator>
                    <StyledDot />
                    <TimelineConnector sx={{ my: '8px' }} />
                    <TimelineConnector sx={{ mb: '5px' }} />
                  </TimelineSeparator>
                  <StyledContent>
                    <PrimaryText>Order placed</PrimaryText>
                    <PrimaryText>3 day ago</PrimaryText>
                  </StyledContent>
                </StyledLineItem>

                <StyledLineItem>
                  <TimelineSeparator>
                    <StyledDot />
                    <TimelineConnector sx={{ my: '8px' }} />
                    <TimelineConnector sx={{ mb: '5px' }} />
                  </TimelineSeparator>
                  <StyledContent>
                    <PrimaryText>Order placed</PrimaryText>
                    <PrimaryText>3 day ago</PrimaryText>
                  </StyledContent>
                </StyledLineItem>
                <Stack direction="row">
                  <StyledDot />
                  <StyledContent sx={{ py: 0, pl: '8px' }}>
                    <PrimaryText>Order was confirmed</PrimaryText>
                    <PrimaryText>3 day ago</PrimaryText>
                  </StyledContent>
                </Stack>
              </Timeline>
            </Box>

            <form
              onSubmit={(evt) => {
                evt.preventDefault();
                if (searchValue) {
                  // onSearch?.(searchValue);
                }
              }}
            >
              <Stack direction="row" spacing={2}>
                <Avatar
                  alt="User Pic"
                  src="https://i.ibb.co/6BsKJ59/1.png"
                  sx={{ width: 40, height: 40 }}
                />

                <SearchInput
                  sx={{
                    width: '100%',
                    height: '40px',
                    borderRadius: '5px',
                  }}
                  label="Search"
                  placeholder="Enter a note here..."
                  onChange={(evt) => setSearchValue(evt.target.value)}
                />
              </Stack>
            </form>
          </StyledBox> */}
        </Grid>
        <Grid item xs={12} lg={4}>
          <RightSection clientOrder={clientOrder} />
        </Grid>
      </Grid>
      <BottomPageActions
        disabled
        backHref={routes.SELLER_DASHBOARD.ORDERS.LIST}
      />
    </Box>
  );
};

export default SellerOrderPage;
