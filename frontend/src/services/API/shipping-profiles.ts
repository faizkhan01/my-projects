import { axiosAPI } from '@/lib/axios';
import { ShippingProfile } from '@/types/shippingProfiles';
import { CookieValueTypes } from 'cookies-next';

interface CreateShippingProfileData {
  name: string;
  description?: string;
  minProcessingDays: number;
  maxProcessingDays: number;
  countryId: number;
  areas: {
    carrier: string;
    price: number;
    minDays: number;
    maxDays: number;
    everyWhere: boolean;
    countryId?: number;
  }[];
}

interface CreateShippingProfileAreaData {
  carrier: string;
  price: number;
  minDays: number;
  maxDays: number;
  everyWhere: boolean;
  countryIds?: number[];
}

type UpdateShippingProfileData = Partial<
  Omit<CreateShippingProfileData, 'areas'>
>;

type UpdateShippingProfileAreaData = Partial<CreateShippingProfileAreaData>;

export const getShippingProfiles = async (token?: CookieValueTypes) => {
  const res = await axiosAPI.get<ShippingProfile[]>(`/shipping-profiles`, {
    headers: token
      ? {
          Authorization: `Bearer ${token}`,
        }
      : {},
  });
  return res.data;
};

export const getShippingProfile = async (
  id: number,
  token?: CookieValueTypes,
) => {
  const res = await axiosAPI.get<{ data: ShippingProfile }>(
    `/shipping-profiles/${id}`,
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

export const createShippingProfile = async (
  data: CreateShippingProfileData,
) => {
  const res = await axiosAPI.post<{ message: string }>(
    '/shipping-profiles',
    data,
  );

  return res.data;
};

export const updateShippingProfile = async (
  id: number,
  data: UpdateShippingProfileData,
) => {
  const res = await axiosAPI.put<{ message: string }>(
    `/shipping-profiles/${id}`,
    data,
  );

  return res.data;
};

export const deleteShippingProfile = async (id: number) => {
  const res = await axiosAPI.delete(`/shipping-profiles/${id}`);

  return res.data;
};

// Shipping Profile Areas
export const createShippingProfileArea = async (
  profileId: number,
  data: CreateShippingProfileAreaData,
) => {
  const res = await axiosAPI.post<{ message: string }>(
    `/shipping-profiles/${profileId}/areas`,
    data,
  );

  return res.data;
};
export const updateShippingProfileArea = async (
  profileId: number,
  id: number,
  data: UpdateShippingProfileAreaData,
) => {
  const res = await axiosAPI.put<{ message: string }>(
    `/shipping-profiles/${profileId}/areas/${id}`,
    data,
  );

  return res.data;
};

export const deleteShippingProfileArea = async (
  profileId: number,
  id: number,
) => {
  const res = await axiosAPI.delete(
    `/shipping-profiles/${profileId}/areas/${id}`,
  );

  return res.data;
};
