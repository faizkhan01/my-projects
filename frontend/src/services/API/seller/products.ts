import { axiosAPI } from '@/lib/axios';
import { CookieValueTypes } from 'cookies-next';
import { SellerProduct } from '@/types/products';
import { SELLER } from '@/constants/api';

type GetSellerProductsResponse = SellerProduct[];
type GetSellerProductResponse = SellerProduct;

export const getSellerProducts = async (token?: CookieValueTypes) => {
  const response = await axiosAPI.get<GetSellerProductsResponse>(
    SELLER.PRODUCTS.LIST,
    {
      headers: token
        ? {
            Authorization: `Bearer ${token}`,
          }
        : {},
    },
  );
  return response.data;
};

export const getSellerProduct = async (
  id: number,
  token?: CookieValueTypes,
) => {
  const response = await axiosAPI.get<GetSellerProductResponse>(
    SELLER.PRODUCTS.ONE(id),
    {
      headers: token
        ? {
            Authorization: `Bearer ${token}`,
          }
        : {},
    },
  );
  return response.data;
};
