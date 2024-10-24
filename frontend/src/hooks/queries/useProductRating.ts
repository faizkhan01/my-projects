import { PRODUCTS } from '@/constants/api';
import { getProductRating } from '@/services/API/products';
import useSWR from 'swr/immutable';

export const useProductRating = (id: number) => {
  const { data, error } = useSWR(PRODUCTS.RATING(id), () =>
    getProductRating(id),
  );

  return {
    data,
    isLoading: data === undefined && !error,
  };
};
