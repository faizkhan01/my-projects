import { Address, AddressFormData } from '@/types/address';
import { Product } from '@/types/products';
import { Order } from '@/types/orders';
import { ProfileData } from '@/types/user';
import { axiosAPI } from '@/lib/axios';
import { PaymentMethod } from '@/types/paymentMethods';

export interface ConfirmCheckoutProps {
  products: { id: Product['id']; quantity: number }[];
  paymentMethodId: string;
  customerId?: ProfileData['id'];
  isGuest: boolean;
  guestEmail?: string;
  shippingId?: number;
  shipping?: AddressFormData;
  billingId?: number;
  billing?: AddressFormData;
  currency: string;
}

export interface ConfirmCheckoutResponse {
  data: {
    orders: Order[];
    errorProducts: Product[];
    successProducts: Product[];
    shipping: Address;
    paymentMethod: PaymentMethod;
    pricing: {
      subtotal: number;
      discounted: number;
      shipping: number;
      total: number;
    };
  };
}

export const confirmCheckout = async (body: ConfirmCheckoutProps) => {
  const { data } = await axiosAPI.post<ConfirmCheckoutResponse>(
    '/checkout/confirm',
    body,
  );

  return data;
};

export const createSetupIntent = async (data: { customerId?: number }) => {
  const res = await axiosAPI.post<{
    data: {
      client_secret: string;
    };
  }>('/checkout/setup-intent', data);

  return res.data;
};
