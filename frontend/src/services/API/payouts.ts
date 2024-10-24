import { axiosAPI } from '@/lib/axios';
import { SellerPayout } from '@/types/sellerPayout';
import { CookieValueTypes } from 'cookies-next';

interface RequestPayoutData {
  amount: number;
  currency: string;
  bankAccountId: string;
}

export type GetSellerPayoutResponse = SellerPayout[];

export const getSellerPayout = async (token?: CookieValueTypes) => {
  const response = await axiosAPI.get<GetSellerPayoutResponse>('/payouts', {
    headers: token
      ? {
          Authorization: `Bearer ${token}`,
        }
      : {},
  });
  return response.data;
};

export const requestPayout = async (data: RequestPayoutData) => {
  const res = await axiosAPI.post<{ message: string }>('/payouts', data);
  return res.data;
};
