import { axiosAPI } from '@/lib/axios';
import { ProductSearchSuggestion } from '@/types/products';
import useSWR from 'swr';

export const useProductSearchSuggestions = (search?: string) => {
  const { data, isLoading } = useSWR(
    search ? `/products/search-suggestions?q=${search}` : null,
    async (url) => {
      const res = await axiosAPI.get<ProductSearchSuggestion[]>(url);
      return res.data;
    },
    {
      keepPreviousData: true,
      revalidateOnFocus: false,
      revalidateIfStale: false,
    },
  );

  return {
    suggestions: data,
    isLoading,
  };
};
