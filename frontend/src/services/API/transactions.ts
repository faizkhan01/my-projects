import { axiosAPI } from '@/lib/axios';
import { Transaction } from '@/types/transactions';
import { CookieValueTypes } from 'cookies-next';

export interface GetSellerTransactionsResponse {
  has_more: boolean;
  data: Transaction[];
}

export const getSellerTransactions = async (token?: CookieValueTypes) => {
  const response = await axiosAPI.get<GetSellerTransactionsResponse>(
    `/charges`,
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
