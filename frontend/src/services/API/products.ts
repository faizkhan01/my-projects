import type { Product, ProductFilters, ProductReview } from '@/types/products';
import { axiosAPI } from '@/lib/axios';
import { PRODUCTS } from '@/constants/api';
import { PaginatedResponse } from '@/types/pagination';

type GetProductResponse = Product;

export type GetProductsResponse = PaginatedResponse<{
  filters: ProductFilters;
  results: {
    _source: Product;
  }[];
}>;

export interface GetProductRatingResponse {
  data: {
    rating_1: number;
    rating_2: number;
    rating_3: number;
    rating_4: number;
    rating_5: number;
    average: number;
  };
}

export interface GetProductsParams {
  q?: string;
  sort_by?:
    | 'price_desc'
    | 'price_asc'
    | 'date_asc'
    | 'date_desc'
    | 'name_asc'
    | 'name_desc';
  category?: string;
  limit?: number;
  offset?: number;
  price?: {
    lte?: number;
    gte?: number;
  };
  store?: string;
  withAggs: boolean;
  currency?: string;
}

export type GetProductReviewsResponse = PaginatedResponse<ProductReview[]>;

type GetProductsPathsResponse = {
  id: number;
  slug: string;
}[];

interface GetSimilarProductsResponse {
  data: {
    _source: Product;
  }[];
}

export interface CreateProductData {
  name: string;
  description: string;
  stock: number;
  categoryId: number;
  shippingProfileId?: number;
  shippingProfile?: {
    minProcessingDays: number;
    maxProcessingDays: number;
    countryId: number;
    areas: {
      carrier: string;
      price: number;
      minDays: number;
      maxDays: number;
      everyWhere: boolean;
      countryIds?: number[];
    }[];
  };
  sku?: string;
  tags?: string[];
  discount?: number;
  price: number;
  published: boolean;
  images: File[];
}

export type UpdateProductData = Partial<
  Pick<
    CreateProductData,
    | 'name'
    | 'description'
    | 'stock'
    | 'categoryId'
    | 'shippingProfileId'
    | 'sku'
    | 'tags'
    | 'discount'
    | 'price'
    | 'published'
    | 'images'
    | 'shippingProfile'
  > & {
    deleteImages: number[];
  }
>;

export const getSimilarProducts = async (productId: number) => {
  const { data } = await axiosAPI.get<GetSimilarProductsResponse>(
    PRODUCTS.SIMILARS(productId),
  );
  return data;
};

export const getProducts = async (params?: GetProductsParams) => {
  const { data } = await axiosAPI.get<GetProductsResponse>(PRODUCTS.LIST, {
    params,
  });
  return data;
};

export const getProduct = async (id: number) => {
  const { data } = await axiosAPI.get<GetProductResponse>(PRODUCTS.ONE(id));
  return data;
};

export const getProductRating = async (id: number) => {
  const { data } = await axiosAPI.get<GetProductRatingResponse>(
    PRODUCTS.RATING(id),
  );
  return data;
};

export const getProductReviews = async (url: string) => {
  const { data } = await axiosAPI.get<GetProductReviewsResponse>(url);

  return data;
};

export const createProductReview = async (
  id: number,
  review: {
    comment: string;
    rating: number;
    images?: FileList | null;
    orderItemId: number;
  },
) => {
  const { data } = await axiosAPI.postForm(`/products/${id}/reviews`, review);

  return data;
};

export const getProductsPaths = async () => {
  const { data } = await axiosAPI.get<GetProductsPathsResponse>(
    '/products/paths',
  );

  return data;
};

export const createProduct = async (data: CreateProductData) => {
  const res = await axiosAPI.postForm('/products', data);

  return res.data;
};

export const updateProduct = async (id: number, data: UpdateProductData) => {
  const res = await axiosAPI.putForm(`/products/${id}`, data);

  return res.data;
};

export const deleteProduct = async (id: number) => {
  const res = await axiosAPI.delete(`/products/${id}`);
  return res.data;
};
