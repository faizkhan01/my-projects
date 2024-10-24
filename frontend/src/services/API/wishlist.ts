import { AxiosResponse } from 'axios';
import { axiosAPI } from '@/lib/axios';
import { CUSTOMER } from '@/constants/api';
import type { Wishlist, WishlistItemNoProduct } from '@/types/wishlist';
import { CookieValueTypes } from 'cookies-next';

interface WishlistResponse extends AxiosResponse {
  data: Wishlist;
}

interface AddToWishlistResponse extends AxiosResponse {
  data: {
    message: string;
    statusCode: number;
    data: WishlistItemNoProduct;
  };
}

interface RemoveFromWishlistResponse extends AxiosResponse {
  data: {
    message: string;
    statusCode: number;
  };
}

export const getWishlist = async (token?: CookieValueTypes) => {
  const response: WishlistResponse = await axiosAPI.get(CUSTOMER.WISHLIST, {
    headers: token
      ? {
          Authorization: `Bearer ${token}`,
        }
      : {},
  });
  return response.data;
};

export const addWishlist = async (productId: number) => {
  const response: AddToWishlistResponse = await axiosAPI.post(
    `${CUSTOMER.WISHLIST}/${productId}`,
  );

  return response.data;
};

export const removeWishlist = async (productId: number) => {
  const response: RemoveFromWishlistResponse = await axiosAPI.delete(
    `${CUSTOMER.WISHLIST}/${productId}`,
  );

  return response.data;
};
