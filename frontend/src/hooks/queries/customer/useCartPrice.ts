import { Cart } from '@/types/cart';
import useSWR from 'swr';
import { getUserPreferencies } from '@/lib/cookies';
import { useMemo } from 'react';
import { getCartPrice } from '@/services/API/cart';
import { CUSTOMER } from '@/constants/api';

export const useCartPrice = (
  cart: Cart | null,
  params: {
    country?: string;
    currency?: string;
  },
) => {
  const userCountry = useMemo<string | undefined>(
    () => params?.country ?? getUserPreferencies()?.country_code,
    [params?.country],
  );

  const { data, isLoading } = useSWR(
    cart ? [CUSTOMER.CART.PRICE, cart, userCountry] : null,
    async () =>
      cart &&
      getCartPrice(
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        {
          products: cart.map((c) => ({
            id: c.product_id,
            quantity: c.quantity,
          })),
          country: userCountry,
          currency: params?.currency,
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
