import { SELLER } from '@/constants/api';
import { axiosAPI } from '@/lib/axios';
import { CookieValueTypes } from 'cookies-next';

export const getSellerRequirements = async (token?: CookieValueTypes) => {
  const response = await axiosAPI.get<{
    currently_due: string[];
    eventually_due_due: string[];
    past_due: string[];
    errors: string[];
    disabled_reason: string | null;
    alternatives: string[];
  }>(SELLER.REQUIREMENTS, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};
