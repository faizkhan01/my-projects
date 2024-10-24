import { Country, State } from './countries';
import { Rates } from './exchange-rate';
import { Product, ProductReview } from './products';
import { Store } from './stores';

export enum OrderPaymentStatus {
  UNPAID = 'UNPAID',
  PAID = 'PAID',
  REFUNDED = 'REFUNDED',
  PARTIALLY_REFUNDED = 'PARTIALLY_REFUNDED',
}

export enum OrderFulfillmentStatus {
  FULFILLED = 'FULFILLED',
  PARTIALLY_FULFILLED = 'PARTIALLY_FULFILLED',
  UNFULFILLED = 'UNFULFILLED',
}

export enum OrderItemStatus {
  CREATED = 'CREATED',
  PENDING_REFUND = 'PENDING_REFUND',
  CANCELED_REFUND = 'CANCELED_REFUND',
  REFUNDED = 'REFUNDED',
  CANCELED = 'CANCELED',
  SHIPPED = 'SHIPPED',
  DELIVERED = 'DELIVERED',
}

export interface Order {
  id: number;
  createdAt: Date;
  refunded?: boolean;
  fulfilled?: boolean;
  paymentStatus: OrderPaymentStatus;
  fulfillmentStatus: OrderFulfillmentStatus;
  items: OrderItem[];
  store?: Pick<Store, 'id' | 'name' | 'slug'>;
  orderNumber?: string;
  paymentCurrency: string | null;
  rates: Rates | null;
}

export interface OrderItem {
  id: number;
  quantity: number;
  totalPrice: number;
  unitPrice: number;
  tax: number;
  shipping: number;
  discount: number;
  product: Product;
  itemCurrency: string | null;
  status: OrderItemStatus;
  fulfilledAt: Date | null;
  refundedAt: Date | null;
  review?: ProductReview;
  trackNumber: string;
}

export interface OrderItemWithOrder extends OrderItem {
  order: Pick<Order, 'id' | 'orderNumber' | 'paymentCurrency' | 'rates'>;
}

export interface OrderInvoice {
  order: Pick<
    Order,
    | 'id'
    | 'orderNumber'
    | 'fulfillmentStatus'
    | 'paymentStatus'
    | 'fulfilled'
    | 'refunded'
    | 'items'
    | 'paymentCurrency'
    | 'rates'
  > & {
    createdAt: string;
    customer: {
      id: number;
      firstName: string;
      lastName: string;
      email: string;
    };
    items: OrderItem[];
    shipping: {
      id: number;
      firstName: string;
      lastName: string;
      phone: string;
      email: string;
      city: string;
      addressOne: string;
      addressTwo: string;
      zipCode: string;
      state: State;
      country: Country;
    };
    billing: {
      id: number;
      firstName: string;
      lastName: string;
      phone: string;
      email: string;
      city: string;
      addressOne: string;
      addressTwo: string;
      zipCode: string;
      state: State;
      country: Country;
    };
  };

  paymentMethod: {
    type: string;
    brand: string;
    country: string;
    last4: string;
  };

  pricing: {
    subtotal: number;
    discounted: number;
    shipping: number;
    total: number;
  };
}

export interface ClientOrder extends Order {
  customer: {
    id: number;
    firstName: string;
    lastName: string;
    email: string;
  } | null;
  guestEmail: string;
  refunded: boolean;
  fulfilled: boolean;
  items: OrderItem[];
  shipping: {
    id: number;
    firstName: string;
    lastName: string;
    phone: string;
    email: string;
    city: string;
    addressOne: string;
    addressTwo: string;
    zipCode: string;
    state: State;
  };
}
