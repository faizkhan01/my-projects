import { axiosAPI } from '@/lib/axios';
import { CUSTOMER } from '@/constants/api';
import { PaymentMethod } from '@/types/paymentMethods';
import { CookieValueTypes } from 'cookies-next';

export type CustomerCardsResponse = PaymentMethod[];

export interface DeleteCustomerCardResponse {
  statusCode: number;
  message: string;
}

export const getCustomerCards = async (token?: CookieValueTypes) => {
  const response = await axiosAPI.get<CustomerCardsResponse>(CUSTOMER.CARDS, {
    headers: token
      ? {
          Authorization: `Bearer ${token}`,
        }
      : {},
  });
  return response.data;
};

export const createCustomerCardIntent = async (paymentMethodId: string) => {
  const response = await axiosAPI.post<{ data: { client_secret: string } }>(
    CUSTOMER.CARDS,
    {
      paymentMethodId,
    },
  );

  return response.data;
};

export const deleteCustomerCard = async (paymentMethodId: string) => {
  const response = await axiosAPI.delete<DeleteCustomerCardResponse>(
    `${CUSTOMER.CARDS}/${paymentMethodId}`,
  );

  return response.data;
};
