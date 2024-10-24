import { SELLER } from '@/constants/api';
import { axiosAPI } from '@/lib/axios';
import { AxiosResponse } from 'axios';
import { CookieValueTypes } from 'cookies-next';

interface Response extends AxiosResponse {
  data: {
    url: string;
  };
}

export const getSellerOnboardingLink = async (token: CookieValueTypes) => {
  const response: Response = await axiosAPI.post(
    SELLER.ONBOARDING,
    {},
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  );
  return response.data;
};
