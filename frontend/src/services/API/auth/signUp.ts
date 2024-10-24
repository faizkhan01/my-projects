import axios from 'axios';
import { AxiosResponse } from 'axios';
import {
  SignUpCustomerFormData,
  SignUpVendorFormData,
  LoginFormData,
  LoginBodyData,
} from '@/types/auth';
import { axiosAPI } from '@/lib/axios';
import { USER_ROLES } from '@/constants/auth';
import { AUTH } from '@/constants/api';
import { getCartFromStorage } from '@/utils/cart';

interface SignUpResponseData {
  statusCode: number;
  message: string;
}

export interface LoginResponseData {
  statusCode: number;
  message: {
    accessToken: string;
  };
}

interface SignUpCustomerResponse extends AxiosResponse {
  data: SignUpResponseData;
}

interface SignUpVendorResponse extends AxiosResponse {
  data: SignUpResponseData;
}

interface LogInResponse extends AxiosResponse {
  data: LoginResponseData;
}

export const signUpCustomer = async (data: SignUpCustomerFormData) => {
  const response: SignUpCustomerResponse = await axiosAPI.post(AUTH.REGISTER, {
    ...data,
    role: USER_ROLES.USER,
  });

  return response.data;
};

export const signUpVendor = async (data: SignUpVendorFormData) => {
  const response: SignUpVendorResponse = await axiosAPI.post(AUTH.REGISTER, {
    ...data,
    role: USER_ROLES.SELLER,
  });

  return response.data;
};

export const login = async (data: LoginFormData) => {
  const cart = getCartFromStorage();
  const body: LoginBodyData = {
    email: data.email,
    password: data.password,
    cart: cart?.map((item) => ({
      quantity: item.quantity,
      productId: item.product_id,
    })),
  };

  const response: LogInResponse = await axios.post('/api/auth/login', body);

  return response.data;
};
