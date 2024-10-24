import { SELLER } from '@/constants/api';
import { axiosAPI } from '@/lib/axios';
import { AxiosResponse } from 'axios';
import { CookieValueTypes } from 'cookies-next';

export interface SellerSettings {
  firstName: string;
  lastName: string;
  email: string;
  currency: string;
  allowedCurrencies: string[];
  storeName: string;
  phone: string;
  addressOne: string;
  addressTwo: string;
  city: string;
  state: {
    id: number;
    name: string;
  };
  country: SellerSettingsCountry;
  zipCode: string;
}

export interface SellerSettingsWithMedia extends SellerSettings {
  banner: {
    id: number;
    url: string;
  };
  logo: {
    id: number;
    url: string;
  };
}

export interface SellerSettingsCountry {
  id: number;
  emoji: string;
  name: string;
}

interface SellerSettingsResponse extends AxiosResponse {
  data: SellerSettingsWithMedia;
}

interface SellerSettingsUpdateResponse extends AxiosResponse {
  data: {
    message: string;
    data: SellerSettingsWithMedia;
  };
}

export const getSellerSettings = async (token?: CookieValueTypes) => {
  const response: SellerSettingsResponse = await axiosAPI.get(SELLER.SETTINGS, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};

export const updateSellerSettings = async (data: FormData) => {
  const response: SellerSettingsUpdateResponse = await axiosAPI.put(
    SELLER.SETTINGS,
    data,
  );

  return response.data;
};

export const closeStore = async () => {
  const response = await axiosAPI.post<{ message: string }>(SELLER.CLOSE_STORE);
  return response.data;
};
