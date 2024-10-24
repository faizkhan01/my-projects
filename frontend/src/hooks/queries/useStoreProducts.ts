import { useRef } from 'react';
import { getStoreProducts } from '@/services/API/stores';
import useSWR from 'swr/immutable';

export const getSWRStoreProductsKey = (
  storeSlug: string,
  queries: UseStoreProductsQueries,
) => {
  const params = new URLSearchParams();
  if (queries?.query) params.append('q', queries.query);
  if (queries?.offset) params.append('offset', queries.offset.toString());
  if (queries?.limit) params.append('limit', queries.limit.toString());

  return `/stores/${storeSlug}/products?${params.toString()}`;
};

export interface UseStoreProductsQueries {
  query?: string;
  offset?: number;
  limit?: number;
}

const useStoreProducts = (
  storeSlug: string,
  queries: UseStoreProductsQueries,
) => {
  const total = useRef<number>(1);
  const route = getSWRStoreProductsKey(storeSlug, queries);

  const { data, error, mutate, isLoading, isValidating } = useSWR(route, () =>
    getStoreProducts(route),
  );

  total.current = data?.total || total.current; // using this we make sure that the pagination doesn't change the total when the page changes

  return {
    products: data?.results || [],
    total: total.current,
    isLoading,
    isValidating,
    isError: error,
    mutate,
  };
};

export default useStoreProducts;
