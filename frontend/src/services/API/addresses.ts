import { CUSTOMER, ADDRESSES_CRUD_TYPES } from '@/constants/api';
import { axiosAPI } from '@/lib/axios';
import {
  Address,
  AddressFormData,
  AddressTypes,
  ADDRESS_TYPES_ENUM,
} from '@/types/address';
import { AxiosResponse } from 'axios';
import { CookieValueTypes } from 'cookies-next';

interface CreateUpdateAddressResponse extends AxiosResponse {
  data: {
    statusCode: number;
    message: string;
    data: Address;
  };
}

interface DeleteAddressResponse extends AxiosResponse {
  data: {
    statusCode: number;
    message: string;
  };
}

export const createAddress = async (
  data: AddressFormData,
  type: AddressTypes,
) => {
  const response: CreateUpdateAddressResponse = await axiosAPI.post(
    ADDRESSES_CRUD_TYPES.POST[type],
    data,
  );
  return response.data;
};

export const updateAddress = async (
  id: number,
  data: Partial<AddressFormData>,
  type: AddressTypes,
) => {
  const response: CreateUpdateAddressResponse = await axiosAPI.put(
    `${ADDRESSES_CRUD_TYPES.GET[type]}/${id}`,
    {
      ...data,
    },
  );
  return response.data;
};

export const deleteAddress = async (id: number, type: AddressTypes) => {
  if (type === ADDRESS_TYPES_ENUM.SHIPPING) {
    const response: DeleteAddressResponse = await axiosAPI.delete(
      `${CUSTOMER.SHIPPING_ADDRESS}/${id}`,
    );
    return response.data;
  }
  throw new Error('Invalid type');
};

export const getAddresses = async (
  type: AddressTypes,
  token?: CookieValueTypes,
) => {
  const { data } = await axiosAPI.get<Address | Address[]>(
    ADDRESSES_CRUD_TYPES.GET[type],
    {
      headers: token
        ? {
            Authorization: `Bearer ${token}`,
          }
        : {},
    },
  );

  if (!Array.isArray(data)) {
    return data ? [data] : [];
  }

  return data;
};
