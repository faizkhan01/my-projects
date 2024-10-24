import { PRODUCTS } from '@/constants/api';
import { getSimilarProducts } from '@/services/API/products';
import { Product } from '@/types/products';
import SWRImmutable from 'swr/immutable';

export const useSimilarProducts = (productId: number) => {
  const { data, error, isLoading, isValidating } = SWRImmutable(
    PRODUCTS.SIMILARS(productId),
    async () => {
      let similarProducts: Product[] = [];
      const data = await getSimilarProducts(productId);
      if (data?.data?.length) {
        similarProducts = data.data.map((item) => item._source);
      }
      return similarProducts;
    },
  );

  return {
    similarProducts: data,
    isLoading,
    isValidating,
    isError: error,
  };
};
