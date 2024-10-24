import useSWR from 'swr';
import { SELLER } from '@/constants/api';
import { getSellerRequirements } from '@/services/API/seller/requirements';
import useProfile from './useProfile';

export const useSellerRequirements = () => {
  const { profile } = useProfile();

  const { data, error } = useSWR(
    profile ? SELLER.REQUIREMENTS : null,
    () => getSellerRequirements(),
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
      shouldRetryOnError: false,
    },
  );

  return {
    isLoading: data === undefined && !error,
    isError: error,
    requirements: data,
  };
};
