import { AxiosResponse } from 'axios';
import { axiosAPI } from '@/lib/axios';
import { STORES } from '@/constants/api';
import type { Store, ValidateStoreName } from '@/types/stores';
import type { Product } from '@/types/products';
import { PaginatedResponse } from '@/types/pagination';

interface ValidateStoreNameResponse extends AxiosResponse {
  data: ValidateStoreName;
}

interface StoreResponse extends AxiosResponse {
  data: Store;
}

export const validateStoreName = async (name: string) => {
  const response: ValidateStoreNameResponse = await axiosAPI.get(
    `${STORES.VALIDATE_STORE_NAME}/${name}`,
  );

  return response.data;
};

export const getStore = async (slug: string) => {
  const response: StoreResponse = await axiosAPI.get(
    `${STORES.STORES}/${slug}`,
  );

  return response.data;
};

interface StoreProductsResponse {
  data: PaginatedResponse<Product[]>;
}

export const getStoreProducts = async (route: string) => {
  const response: StoreProductsResponse = await axiosAPI.get(route);
  return response.data;
};

export const getStorePaths = async () => {
  const response = await axiosAPI.get<{ slug: string }[]>(`${STORES.PATHS}`);
  return response.data;
};
