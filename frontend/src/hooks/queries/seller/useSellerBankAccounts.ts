import { SELLER } from '@/constants/api';
import { getBankInfo } from '@/services/API/seller/bankInfo';
import useSWR from 'swr';

export const useSellerBankAccounts = () => {
  const { data, error } = useSWR(SELLER.BANK_ACCOUNT.LIST, async () =>
    getBankInfo(),
  );

  return {
    bankAccounts: data?.data,
    isLoading: !error && !data,
    isError: error,
  };
};
