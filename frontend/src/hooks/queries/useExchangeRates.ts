import useSWR from 'swr';
import { EXCHANGE_RATES } from '@/constants/api';
import { getExchangeRates } from '@/services/API/exchange-rates';
import { useUserPreferencesStore } from '../stores/useUserPreferencesStore';

export const useExchangeRates = () => {
  const currency = useUserPreferencesStore((s) => s.currency);
  const { data, error } = useSWR(
    EXCHANGE_RATES.RATES('USD'),
    () => getExchangeRates('USD'),
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
      revalidateIfStale: false,
    },
  );

  return {
    base: data?.base ?? 'USD',
    rates: data?.rates,
    actualCurrency: currency ?? 'USD',
    isLoading: data === undefined && !error,
    isError: error,
  };
};
