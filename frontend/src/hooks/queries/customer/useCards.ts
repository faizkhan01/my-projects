import useSWR from 'swr';
import { CUSTOMER } from '@/constants/api';
import { getCustomerCards } from '@/services/API/cards';

const useCustomerCards = (active = true) => {
  const { data, error, mutate, isLoading, isValidating } = useSWR(
    active ? CUSTOMER.CARDS : null,
    () => getCustomerCards(),
  );

  return {
    cards: data,
    isError: error,
    isLoading,
    isValidating,
    mutate,
  };
};

export default useCustomerCards;
