import { CUSTOMER } from '@/constants/api';
import { axiosAPI } from '@/lib/axios';
import type { FollowedStore } from '@/types/stores';
import { CookieValueTypes } from 'cookies-next';

type GetFollowingStoresResponse = FollowedStore[];

export const getFollowingStores = async (token?: CookieValueTypes) => {
  const res = await axiosAPI.get<GetFollowingStoresResponse>(
    CUSTOMER.FOLLOWING,
    {
      headers: token
        ? {
            Authorization: `Bearer ${token}`,
          }
        : {},
    },
  );
  return res.data;
};

export const createFollowStore = async (storeId: number) => {
  const response = await axiosAPI.post(`/users/customers/following/${storeId}`);

  return response.data;
};

export const deleteFollowStore = async (storeId: number) => {
  const response = await axiosAPI.delete(
    `/users/customers/following/${storeId}`,
  );
  return response.data;
};
