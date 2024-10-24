import { axiosAPI } from '@/lib/axios';
import { Balance } from '@/types/balance';
import { CookieValueTypes } from 'cookies-next';

export interface GetSellerBalanceResponse {
  pending: Balance[];
  available: Balance[];
}

export const getSellerBalance = async (token?: CookieValueTypes) => {
  const res = await axiosAPI.get<GetSellerBalanceResponse>(
    '/balance',

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
