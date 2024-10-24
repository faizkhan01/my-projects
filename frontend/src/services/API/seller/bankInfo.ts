import { SELLER } from '@/constants/api';
import { axiosAPI } from '@/lib/axios';
import { BankInfo } from '@/types/bank';
import { AxiosResponse } from 'axios';
import { CookieValueTypes } from 'cookies-next';

interface BankInfoResponse extends AxiosResponse {
  data: {
    data: BankInfo[];
  };
}

export const getBankInfo = async (token?: CookieValueTypes) => {
  const response: BankInfoResponse = await axiosAPI.get(
    SELLER.BANK_ACCOUNT.LIST,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  );
  return response.data;
};

export const createBankAccount = async (token: string) => {
  const response = await axiosAPI.post<{ message: string }>(
    SELLER.BANK_ACCOUNT.CREATE,
    {
      token,
    },
  );
  return response.data;
};

export const updateBankAccount = async (
  id: string,
  data: {
    defaultForCurrency?: boolean;
  },
) => {
  const response = await axiosAPI.put<{ message: string }>(
    SELLER.BANK_ACCOUNT.UPDATE(id),
    data,
  );
  return response.data;
};

export const deleteBankAccount = async (id: string) => {
  const response = await axiosAPI.delete<{ message: string }>(
    SELLER.BANK_ACCOUNT.DELETE(id),
  );

  return response.data;
};
