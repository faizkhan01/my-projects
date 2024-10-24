import { BLOG } from '@/constants/api';
import { axiosAPI } from '@/lib/axios';
import { requestAPI } from '@/lib/request';
import { BlogCategory, BlogPost } from '@/types/blog';
import { PaginatedResponse, PaginationQueryParams } from '@/types/pagination';

export type GetBlogPostsResponse = PaginatedResponse<BlogPost[]>;

export const GET_BLOG_POSTS_SORT_BY = [
  'date_asc',
  'date_desc',
  'title_asc',
  'title_desc',
] as const;
export const GET_BLOG_POSTS_STATUS = ['draft', 'published'] as const;

export const getBlogPosts = async (
  query?: {
    q?: string;
    sort?: (typeof GET_BLOG_POSTS_SORT_BY)[number];
    limit?: number;
    offset?: number;
    categoryIdOrSlug?: number | string;
    authorId?: number;
    status?: (typeof GET_BLOG_POSTS_STATUS)[number];
    showcased?: boolean;
  } & PaginationQueryParams,
) => {
  const data = await requestAPI<GetBlogPostsResponse>(BLOG.POSTS.LIST, {
    params: query,
  });

  return data;
};

export const getBlogPost = async (idOrSlug: number | string) => {
  const data = await requestAPI<BlogPost>(BLOG.POSTS.ONE(idOrSlug));
  return data;
};

export const getBlogCategories = async (query?: { showInMenu?: boolean }) => {
  const { data } = await axiosAPI.get<BlogCategory[]>(BLOG.CATEGORIES.LIST, {
    params: query,
  });

  return data;
};
