import { CATEGORIES } from '@/constants/api';
import { Category } from '@/types/categories';
import { axiosAPI } from '@/lib/axios';
import { requestAPI } from '@/lib/request';

type GetCategoriesResponse = Category[];
type GetCategoriesByProductResponse = Category[];

interface GetCategoryResponse {
  category: Category;
  count: number;
}

export const getCategories = async (props?: { withImages: boolean }) => {
  const data = await requestAPI<GetCategoriesResponse>(
    `${CATEGORIES.LIST}?withImages=${props?.withImages ?? false}`,
    {
      next: { revalidate: 300 },
    },
  );
  return data;
};

export const getCategory = async (id: number) => {
  const { data } = await axiosAPI.get<GetCategoryResponse>(
    `${CATEGORIES.LIST}/${id}`,
  );
  return data;
};

export const getCategoriesByProduct = async (productId: number) => {
  const { data } = await axiosAPI.get<GetCategoriesByProductResponse>(
    `${CATEGORIES.LIST}/by-product/${productId}`,
  );
  return data;
};
