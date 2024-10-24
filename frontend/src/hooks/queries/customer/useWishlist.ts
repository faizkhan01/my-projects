'use client';
import useSWRImmutable from 'swr/immutable';
import { CUSTOMER } from '@/constants/api';
import { getWishlist } from '@/services/API/wishlist';
import type { WishlistItem } from '@/types/wishlist';
import useProfile from '../useProfile';
import { USER_ROLES } from '@/constants/auth';

const useWishlist = () => {
  const { profile, isLoading: isLoadingProfile } = useProfile();
  const active = Boolean(profile?.role === USER_ROLES.USER);

  const { data, error, isValidating, mutate } = useSWRImmutable(
    active ? CUSTOMER.WISHLIST : null,
    () => getWishlist(),
  );

  const objectData: Record<number, WishlistItem> = {};

  if (data && active) {
    data.forEach((item: WishlistItem) => {
      objectData[item.product_id] = item;
    });
  }

  return {
    isLoading: !error && data === undefined && isLoadingProfile,
    isValidating,
    mutate,
    isError: error,
    wishlist: objectData,
    wishlistArray: data,
  };
};

export default useWishlist;
