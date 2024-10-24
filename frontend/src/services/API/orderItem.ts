import { axiosAPI } from '@/lib/axios';
import { OrderItemWithOrder } from '@/types/orders';
import { CookieValueTypes } from 'cookies-next';

export const getOrderItem = async (id: number, token: CookieValueTypes) => {
  const res = await axiosAPI.get<OrderItemWithOrder>(
    '/users/customers/order-items/' + id,
    {
      headers: token
        ? {
            Authorization: `Bearer ${token}`,
          }
        : {},
    },
  );
  return res.data;
};
