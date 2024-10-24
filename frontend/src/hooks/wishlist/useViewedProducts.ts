import { getStorageItem, StorageKeys } from '@/lib/localStorage';
import useSWR from 'swr';
import useProfile from '../queries/useProfile';
import { axiosAPI } from '@/lib/axios';
import { ViewedProduct } from '@/types/viewedProducts';

export const useViewedProducts = () => {
  const { profile, isLoading: isLoadingProfile } = useProfile();
  const active = !isLoadingProfile;

  const { data: viewedProducts, error } = useSWR(
    active ? '/viewed-products' : null,
    async () => {
      if (profile) {
        const res = await axiosAPI.get<ViewedProduct[]>('/viewed-products');
        return res.data;
      } else {
        return getStorageItem(StorageKeys.VIEWED_PRODUCTS);
      }
    },
  );

  return {
    viewedProducts,
    error,
    isLoading: !error && viewedProducts === undefined,
  };
};
