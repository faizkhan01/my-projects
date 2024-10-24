import { AxiosResponse } from 'axios';
import { CookieValueTypes } from 'cookies-next';
import { axiosAPI } from '@/lib/axios';
import { AUTH, CUSTOMER } from '@/constants/api';
import { ProfileData, EditProfileData, UserSettingsData } from '@/types/user';
import { cache } from 'react';
import { requestAPI } from '@/lib/request';

// interface EditProfileResponse extends AxiosResponse {
//   data: EditProfileData;
// }

interface EditProfileResponse extends AxiosResponse {
  data: {
    data: EditProfileData;
    message: string;
  };
}

interface UserSettingsResponse extends AxiosResponse {
  data: UserSettingsData;
}

export const getProfile = cache(async (token?: CookieValueTypes) => {
  const response = await requestAPI<ProfileData>(AUTH.PROFILE, {
    headers: token
      ? {
          Authorization: `Bearer ${token}`,
        }
      : {},
  });
  return response;
});

export const editProfile = async (
  data: Partial<EditProfileData>,
  token?: CookieValueTypes,
) => {
  const formData = new FormData();

  for (const [key, value] of Object.entries(data)) {
    if (value === null) continue;
    formData.append(key, value);
  }

  const response: EditProfileResponse = await axiosAPI.post(
    CUSTOMER.SETTINGS,
    formData,
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

export const getUserSettings = async (token?: CookieValueTypes) => {
  const response: UserSettingsResponse = await axiosAPI.get(CUSTOMER.SETTINGS, {
    headers: token
      ? {
          Authorization: `Bearer ${token}`,
        }
      : {},
  });
  return response.data;
};
