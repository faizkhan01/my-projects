import { AxiosResponse } from 'axios';
import { CookieValueTypes } from 'cookies-next';
import { axiosAPI } from '@/lib/axios';
import { AllCustomers } from '@/types/allCustomers';
import { CUSTOMER } from '@/constants/api';

interface CustomersOrdersResponse extends AxiosResponse {
  data: AllCustomers[];
}

export const getCustomersOrders = async (token?: CookieValueTypes) => {
  const response: CustomersOrdersResponse = await axiosAPI.get(
    `/users/sellers/customers`,
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

export const getCustomerOrderItemActions = async (orderItemId: number) => {
  const response = await axiosAPI.get<{
    canRefund: boolean;
    canReview: boolean;
  }>(CUSTOMER.ORDER_ITEMS.ACTIONS(orderItemId));
  return response.data;
};
