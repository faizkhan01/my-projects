import { GetNotificationsResponse } from '@/services/API/notifications';
import { GetProductReviewsResponse } from '@/services/API/products';
import { SWRInfiniteKeyLoader } from 'swr/infinite';

type UseProductsReviewsQueries = Partial<{
  sort_by: string;
  with_media: string | boolean;
  limit?: number;
}>;

export const getUseProductReviewsKey =
  (
    productId: number,
    queries?: UseProductsReviewsQueries,
  ): SWRInfiniteKeyLoader<GetProductReviewsResponse> =>
  (index, previousPageData) => {
    if (previousPageData && !previousPageData.results.length) return null;

    const params = new URLSearchParams();
    if (queries?.sort_by) params.append('sort_by', queries.sort_by);
    if (queries?.with_media !== undefined)
      params.append('with_media', queries.with_media.toString());

    const limit = queries?.limit ?? 5;

    params.append('limit', limit.toString());
    params.append('offset', (limit * (index ?? 0)).toString());

    const key = `/products/${productId}/reviews?${params.toString()}`;
    return key;
  };

export const getUseNotificationsKey: SWRInfiniteKeyLoader<
  GetNotificationsResponse
> = (pageIndex, previousPageData) => {
  if (previousPageData && !previousPageData?.results.length) {
    return null;
  }

  const PAGE_SIZE = 5;

  return `/notifications?limit=${PAGE_SIZE}&offset=${pageIndex * PAGE_SIZE}`;
};
