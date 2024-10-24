import { getProductReviews } from '@/services/API/products';
import useSWRInfinite from 'swr/infinite';
import { getUseProductReviewsKey } from './swr-keys';
import { useSearchParams } from 'next/navigation';

type Queries = Partial<{
  sort_by: string;
  with_media: string | boolean;
  limit?: number;
}>;

export const useReviewSortFilters = () => {
  const query = useSearchParams();
  const sort_by = query.get('sort_by') || '';
  const with_media = query.get('with_media') || 'false';

  return { sort_by, with_media };
};

export const useProductReviews = (productId: number, queries?: Queries) => {
  const { data, error, mutate, isValidating, size, setSize } = useSWRInfinite(
    getUseProductReviewsKey(productId, queries),
    (url) => (url ? getProductReviews(url as string) : null),
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
    },
  );

  return {
    reviews: data || [],
    isLoading: data === undefined && !error,
    isValidating,
    isError: error,
    mutate,
    size,
    setSize,
  };
};
