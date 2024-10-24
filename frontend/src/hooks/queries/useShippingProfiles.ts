import { SELLER } from '@/constants/api';
import { getShippingProfiles } from '@/services/API/shipping-profiles';
import useSWR from 'swr';

export const useShippingProfiles = () => {
  const { data, isLoading, error } = useSWR(
    SELLER.SHIPPING_PROFILES.LIST,
    async () => getShippingProfiles(),
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
    },
  );

  return {
    shippingProfiles: data,
    isLoading,
    error,
  };
};
