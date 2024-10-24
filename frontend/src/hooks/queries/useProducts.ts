import useSWR from 'swr';
import { getProducts, GetProductsParams } from '@/services/API/products';
import { PRODUCTS } from '@/constants/api';
import { useMemo } from 'react';

const useProducts = (params?: GetProductsParams, isDisabled = false) => {
  const shouldFetch = useMemo(() => {
    // If it doesn't have params, then it will fetch
    if (!params) {
      return true;
    }

    // if isDisabled is true, then avoid making the request
    if (isDisabled) {
      return false;
    }

    // If there are params and all of them properties are undefined, then, avoid making the request
    if (Object.values(params).every((param) => param === undefined)) {
      return false;
    }
    return true;
  }, [params, isDisabled]);

  const { data, error, isLoading } = useSWR(
    shouldFetch ? [PRODUCTS.LIST, JSON.stringify(params)] : null,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    ([_url]) => getProducts(params),
    {
      keepPreviousData: true,
      revalidateIfStale: true,
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
    },
  );

  return {
    products: data,
    error,
    isLoading: !error && !data,
    isFetching: isLoading,
  };
};

export default useProducts;
