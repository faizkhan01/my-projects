import { BLOG } from '@/constants/api';
import { GetBlogPostsResponse, getBlogPosts } from '@/services/API/blog';
import queryString from 'query-string';
import { SWRInfiniteKeyLoader } from 'swr/infinite';

export const getUseBlogPostsInfiniteKey =
  (
    query: Parameters<typeof getBlogPosts>[0] | null,
  ): SWRInfiniteKeyLoader<GetBlogPostsResponse> =>
  (index, previousPageData) => {
    if (previousPageData && !previousPageData.results.length) return null;

    const limit = query?.limit ?? 12;

    const copyQuery = {
      ...query,
      offset: limit * (index ?? 0),
    };

    return `${BLOG.POSTS.LIST}?${queryString.stringify(copyQuery)}`;
  };
