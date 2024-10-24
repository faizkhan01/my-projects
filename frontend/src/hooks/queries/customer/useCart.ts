'use client';
import { useMemo } from 'react';
import useSWR from 'swr';
import { CUSTOMER } from '@/constants/api';
import { getCart } from '@/services/API/cart';
import type { CartItem } from '@/types/cart';
import useProfile from '../useProfile';
import { USER_ROLES } from '@/constants/auth';
import { Arguments } from 'swr';
import { getCartFromStorage } from '@/utils/cart';

// https://swr.vercel.app/docs/mutation#mutate-multiple-items
// This is needed because we're using the useCart with an array of arguments, so to match all the arguments, we use this matcher
export const getUseCartMutateKey = (key: Arguments) =>
  Array.isArray(key) && key[0] === CUSTOMER.CART.LIST;

const useCart = (selected = false) => {
  const { profile, isLoading: isLoadingProfile } = useProfile();

  // If the user is a guest, we'll use the cart from the local storage
  // If the user is logged in and the role of customer, we'll use the cart from the API
  // If the user is logged in and the role is seller, we'll set it as inactive to avoid API calls
  const active =
    !isLoadingProfile &&
    (profile === null || profile?.role === USER_ROLES.USER);

  const { data, error, isValidating, mutate } = useSWR(
    active ? [CUSTOMER.CART.LIST, selected] : null,
    ([, selected]) =>
      profile?.id ? getCart({ selected }) : getCartFromStorage(),
    {
      revalidateIfStale: true,
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
    },
  );

  const objectData = useMemo(() => {
    const object: Record<number, CartItem> = {};

    if (!data) {
      return object;
    }

    data?.forEach((item: CartItem) => {
      object[item.product_id] = item;
    });

    return object;
  }, [data]);

  return {
    isLoading: Boolean((!error && data === undefined) || isLoadingProfile),
    isValidating,
    mutate,
    isError: error,
    cart: objectData,
    cartArray: data,
    isEmpty: data?.length === 0 || data === null,
  };
};

export default useCart;
