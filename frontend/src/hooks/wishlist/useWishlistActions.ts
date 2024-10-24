import {
  addWishlist as addWishlistAPI,
  removeWishlist as removeWishlistAPI,
} from '@/services/API/wishlist';
import { CUSTOMER } from '@/constants/api';
import { useSWRConfig } from 'swr';
import type { Wishlist } from '@/types/wishlist';
import type { Product } from '@/types/products';
import useAuthModalStore from '../stores/useAuthModalStore';
import { USER_ROLES } from '@/constants/auth';
import { shallow } from 'zustand/shallow';
import { useAuthStore } from '../stores/useAuthStore';

export const useWishlistActions = () => {
  const { mutate } = useSWRConfig();
  const { open } = useAuthModalStore(
    (state) => ({
      open: state.open,
    }),
    shallow,
  );

  const profile = useAuthStore((state) => state.profile);

  const checkIsCustomer = (): boolean => {
    const userProfile = profile;

    if (!userProfile) {
      open('login');
      return false;
    }

    if (userProfile?.role !== USER_ROLES.USER) {
      return false;
    }

    return true;
  };

  const addWishlist = async (product: Product) => {
    if (!checkIsCustomer()) return;

    mutate(CUSTOMER.WISHLIST, addWishlistAPI(product.id), {
      rollbackOnError: true,
      populateCache: false,
      optimisticData: (current: Wishlist) => {
        return Array.isArray(current)
          ? [...current, { product_id: product.id, product }]
          : current;
      },
    });
  };

  const removeWishlist = async (product: Product) => {
    if (!checkIsCustomer()) return;

    mutate(CUSTOMER.WISHLIST, removeWishlistAPI(product.id), {
      rollbackOnError: true,
      populateCache: false,
      optimisticData: (current: Wishlist) => {
        return current.filter((item) => item.product_id !== product.id);
      },
    });
  };

  return {
    addWishlist,
    removeWishlist,
  };
};
