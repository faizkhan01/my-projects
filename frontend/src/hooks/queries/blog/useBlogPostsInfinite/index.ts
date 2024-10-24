import { getBlogPosts } from '@/services/API/blog';
import useSWRInfinite from 'swr/infinite';
import { getUseBlogPostsInfiniteKey } from './get-key';
import { useMemo } from 'react';

export const useBlogPostsInfinite = (
  query: Parameters<typeof getBlogPosts>[0] | null,
) => {
  const { data, error, size, setSize, isLoading } = useSWRInfinite(
    getUseBlogPostsInfiniteKey(query),
    async () => getBlogPosts(query || undefined),
    {
      revalidateIfStale: false,
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
    },
  );

  const allPosts = useMemo(
    () => data?.flatMap((page) => page.results) ?? [],
    [data],
  );
  const isEnd = useMemo(() => {
    return allPosts.length >= (data?.[0]?.total ?? 0);
  }, [allPosts.length, data]);

  const isLoadingMore =
    isLoading || (size > 0 && data && typeof data[size - 1] === 'undefined');

  return {
    posts: allPosts,
    data,
    isEnd,
    size,
    setSize,
    isLoading,
    isLoadingMore,
    isError: error,
  };
};
