import { AxiosResponse } from 'axios';
import { CookieValueTypes } from 'cookies-next';
import { axiosAPI } from '@/lib/axios';
import { SellerOrder } from '@/types/sellerOrders';
import { Order, OrderInvoice, ClientOrder } from '@/types/orders';
import { ORDERS } from '@/constants/api';

interface OrdersResponse extends AxiosResponse {
  data: Order[];
}
interface SellerOrdersResponse extends AxiosResponse {
  data: SellerOrder[];
}
interface ClientOrdersResponse extends AxiosResponse {
  data: ClientOrder;
}

export interface InvoiceResponse extends AxiosResponse {
  data: OrderInvoice;
}

interface FulfillOrderData {
  carrierName: string;
  trackNumber: string;
  orderItems: number[];
}

export const getOrders = async (token?: CookieValueTypes) => {
  const response: OrdersResponse = await axiosAPI.get(
    `/users/customers/orders`,
    {
      headers: token
        ? {
            Authorization: `Bearer ${token}`,
          }
        : {},
    },
  );
  return response.data;
};

export const getSellerOrders = async (token?: CookieValueTypes) => {
  const response: SellerOrdersResponse = await axiosAPI.get(
    `/users/sellers/orders`,
    {
      headers: token
        ? {
            Authorization: `Bearer ${token}`,
          }
        : {},
    },
  );
  return response.data;
};

export const getSellerOrder = async (id: number, token?: CookieValueTypes) => {
  const response: ClientOrdersResponse = await axiosAPI.get(
    `users/sellers/orders/${id}`,
    {
      headers: token
        ? {
            Authorization: `Bearer ${token}`,
          }
        : {},
    },
  );
  return response.data;
};

export const fulfillOrder = async (orderId: number, data: FulfillOrderData) => {
  const res = await axiosAPI.post<{ message: string }>(
    ORDERS.FULFILL(orderId),
    data,
  );

  return res.data;
};

export const getInvoiceData = async (id: number, token?: CookieValueTypes) => {
  const response: InvoiceResponse = await axiosAPI.get(ORDERS.INVOICE(id), {
    headers: token
      ? {
          Authorization: `Bearer ${token}`,
        }
      : {},
  });
  return response.data;
};
