import { Cart } from '@/types/cart';
import useSWR from 'swr';
import { getUserPreferencies } from '@/lib/cookies';
import { useMemo } from 'react';
import { getCartDeliveryTime } from '@/services/API/cart';
import { CUSTOMER } from '@/constants/api';

export const useCartDeliveryTime = (cart?: Cart | null, country?: string) => {
  const userCountry = useMemo<string | undefined>(
    () => country ?? getUserPreferencies()?.country_code,
    [country],
  );

  const { data, isLoading } = useSWR(
    cart ? [CUSTOMER.CART.DELIVERY_TIME, cart, userCountry] : null,
    async () =>
      cart &&
      getCartDeliveryTime(
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        {
          productIds: cart.map((c) => c.product_id),
          country: userCountry,
        },
      ),
    {
      revalidateOnFocus: false,
      revaidateOnReconnect: false,
    },
  );

  return {
    data,
    isLoading,
  };
};
