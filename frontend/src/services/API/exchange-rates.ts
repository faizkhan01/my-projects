import { EXCHANGE_RATES } from '@/constants/api';
import { axiosAPI } from '@/lib/axios';
import type { Rates } from '@/types/exchange-rate';

export const getExchangeRates = async (currency: string) => {
  const res = await axiosAPI.get<{
    id: number;
    base: string;
    rates: Rates;
  }>(EXCHANGE_RATES.RATES(currency));
  return res.data;
};
