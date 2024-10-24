'use client';
import { useCallback, useMemo } from 'react';
import {
  Page,
  Text,
  View,
  Document,
  StyleSheet,
  Image as PdfImage,
} from '@react-pdf/renderer';
import { formatAddress, formatOrderDate } from '@/utils/formatters';
import { OrderInvoice } from '@/types/orders';
import { theme } from '@/lib/theme';
import { formatPrice } from '@/utils/currency';
import { usePriceCalculator } from '@/hooks/usePriceCalculator';
import { createCurrencyConverter } from '@/hooks/stores/useCurrencyConverterStore';

interface InvoicePageProps {
  invoice: OrderInvoice | null;
  toCurrency: string; // zustand doesn't work here
}

// Create styles
const styles = StyleSheet.create({
  page: {
    flexDirection: 'column',
    backgroundColor: '#fff',
  },
  section: {},
  lightText: {
    fontSize: '14px',
    // lineHeight: '16px',
    fontWeight: 400,
    color: '#96A2C1',
    marginBottom: '8px',
  },
  PrimaryText: {
    fontSize: '16px',
    fontWeight: 400,
    // lineHeight: '24px',
    color: '#333E5C',
  },
  gridItem: {
    width: '25%',
  },
  TextRow: {
    display: 'flex',
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  link: {
    textDecoration: 'none',
    color: theme.palette.primary.main,
  },
});

const OrderedProduct = ({
  item,
  rate,
  toCurrency,
}: {
  item: OrderInvoice['order']['items'][0];
  rate: number;
  toCurrency: string;
}) => {
  const { priceFormatted, totalFormatted } = usePriceCalculator(
    [
      {
        discount: item.discount,
        price: item.unitPrice,
        quantity: item.quantity,
      },
    ],
    {
      currency: toCurrency,
      exchangeRate: rate,
    },
  );

  const hasDiscount = !!item?.discount;
  return (
    <View
      style={{
        padding: '24px 24px 0 24px',
        borderBottom: '1px solid #EAECF4',
        borderTop: '1px solid #EAECF4',
      }}
    >
      <View
        style={{
          display: 'flex',
          flexDirection: 'row',
          marginBottom: '24px',
        }}
      >
        {item.product.images?.[0] && (
          <View style={{ width: '96px', marginRight: '16px' }}>
            <PdfImage
              src={item.product.images?.[0].url}
              style={{
                width: '96px',
                borderRadius: '10px',
                height: '96px',
              }}
            />
          </View>
        )}
        <View
          style={{
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'space-between',
            gap: '16px',
          }}
        >
          <View
            style={{
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
            }}
          >
            <View>
              <Text
                style={{
                  fontSize: '18px',
                  color: '#333E5C',
                  fontWeight: 400,
                  marginBottom: '4px',
                }}
              >
                {item.product.name}
              </Text>
            </View>
            <Text
              style={{
                color: '#333E5C',
                fontSize: '12px',
                fontWeight: 400,
              }}
            >
              Qty: {item.quantity}
            </Text>
          </View>
          <View
            style={{
              display: 'flex',
              flexDirection: 'row',
              alignItems: 'center',
              gap: '8px',
              height: '22px',
            }}
          >
            <Text
              style={{
                fontSize: '18px',
                fontWeight: 600,
                color: '#333E5C',
              }}
            >
              {totalFormatted}
            </Text>
            {hasDiscount && (
              <Text
                style={{
                  color: '#96A2C1',
                  fontSize: '14px',
                  fontWeight: 400,
                  textDecoration: 'line-through',
                }}
              >
                {priceFormatted}
              </Text>
            )}
          </View>
        </View>
      </View>
    </View>
  );
};

// Create Document Component
const InvoicePage = ({ invoice, toCurrency }: InvoicePageProps) => {
  const converter = createCurrencyConverter(invoice?.order.rates ?? {});

  const convertCurrency = useCallback(
    (amount: number) => {
      return converter(amount, {
        from: invoice?.order.paymentCurrency ?? null,
        to: toCurrency,
      });
    },
    [converter, invoice?.order.paymentCurrency, toCurrency],
  );

  const convertAndFormat = useCallback(
    (amount: number) => {
      return formatPrice(convertCurrency(amount), {
        currency: toCurrency,
      });
    },
    [convertCurrency, toCurrency],
  );
  const order = invoice?.order;
  const paymentMethod = invoice?.paymentMethod;

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
      priceFormatted: convertAndFormat(invoice?.pricing?.subtotal ?? 0),
      totalFormatted: convertAndFormat(invoice?.pricing?.total ?? 0),
      discountFormatted: convertAndFormat(invoice?.pricing?.discounted ?? 0),
      shippingFormatted: convertAndFormat(invoice?.pricing?.shipping ?? 0),
    };
  }, [convertAndFormat, invoice?.pricing]);

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View
          style={{
            padding: '56px 10px 24px 10px',
            display: 'flex',
            alignItems: 'center',
            width: '100%',
          }}
        >
          <PdfImage
            src={window.location.origin + '/assets/logo/Logo.png'}
            style={{ width: '150px' }}
          />
        </View>

        {order && (
          <View
            style={{
              display: 'flex',
              padding: '24px',
              borderTop: '1px solid #EAECF4',
              flexDirection: 'row',
            }}
          >
            <View style={styles.gridItem}>
              <Text style={styles.lightText}>Order Date</Text>
              {order?.createdAt && (
                <Text style={styles.PrimaryText}>
                  {formatOrderDate(order.createdAt)}
                </Text>
              )}
            </View>
            <View style={styles.gridItem}>
              <Text style={styles.lightText}>Order Number</Text>
              <Text style={styles.PrimaryText}>{order.orderNumber}</Text>
            </View>
            <View style={styles.gridItem}>
              <Text style={styles.lightText}>Payment</Text>
              <Text style={styles.PrimaryText}>
                {paymentMethod?.brand} - {paymentMethod?.last4}
              </Text>
            </View>
            <View style={styles.gridItem}>
              <Text style={styles.lightText}>Address</Text>
              <Text style={styles.PrimaryText}>
                {formatAddress({
                  addressOne: order?.shipping?.addressOne || '',
                  city: order?.shipping?.city || '',
                  state: order?.shipping?.state.name || '',
                  zipCode: order?.shipping?.zipCode || '',
                })}
              </Text>
            </View>
          </View>
        )}

        {order?.items.map((item) => {
          return (
            <OrderedProduct
              key={item.id}
              item={item}
              toCurrency={toCurrency}
              rate={convertCurrency(1)}
            />
          );
        })}
        <View style={{ padding: '24px', borderBottom: '1px solid #EAECF4' }}>
          <View style={styles.TextRow}>
            <Text style={{ fontSize: '18px', fontWeight: 400 }}>Subtotal</Text>
            <Text style={{ fontSize: '18px', fontWeight: 600 }}>
              {priceFormatted}
            </Text>
          </View>
          <View style={{ ...styles.TextRow, marginTop: '16px' }}>
            <Text style={{ fontSize: '18px', fontWeight: 400 }}>Discount</Text>
            <Text
              style={{
                fontSize: '18px',
                fontWeight: 600,
                color: theme.palette.error.main,
              }}
            >
              -{discountFormatted}
            </Text>
          </View>
          <View style={{ ...styles.TextRow, marginTop: '16px' }}>
            <Text style={{ fontSize: '18px', fontWeight: 400 }}>
              Shipping & Handling
            </Text>
            <Text
              style={{
                fontSize: '18px',
                fontWeight: 600,
              }}
            >
              {shippingFormatted}
            </Text>
          </View>

          {/* <View style={{ ...styles.TextRow, marginTop: '16px' }}> */}
          {/*   <Text style={{ fontSize: '18px', fontWeight: 400 }}> */}
          {/*     Promotional Code (HB1337) */}
          {/*   </Text> */}
          {/*   <Text */}
          {/*     style={{ */}
          {/*       fontSize: '18px', */}
          {/*       fontWeight: 600, */}
          {/*       color: theme.palette.primary.main, */}
          {/*     }} */}
          {/*   > */}
          {/*     -$13.00 */}
          {/*   </Text> */}
          {/* </View> */}
        </View>
        <View
          style={{
            ...styles.TextRow,
            padding: '24px',
            borderBottom: '1px solid #EAECF4',
          }}
        >
          <Text style={{ fontSize: '24px', fontWeight: 400 }}>Total</Text>
          <Text style={{ fontSize: '24px', fontWeight: 600 }}>
            {totalFormatted}
          </Text>
        </View>
        {/* <View style={{ padding: '24px' }}> */}
        {/*   <Text style={{ fontSize: '18px', fontWeight: 500 }}> */}
        {/*     If you have any questions, you can contact our{' '} */}
        {/*     <Link style={styles.link} src="#"> */}
        {/*       support service */}
        {/*     </Link> */}
        {/*     .You can track your order on the{' '} */}
        {/*     <Link style={styles.link} src="#"> */}
        {/*       order status page */}
        {/*     </Link> */}
        {/*     . Thank you for choosing Only Latest Inc. */}
        {/*   </Text> */}
        {/* </View> */}
      </Page>
    </Document>
  );
};

export default InvoicePage;
