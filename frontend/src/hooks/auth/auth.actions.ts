import { useState } from 'react';
import { axiosAPI, handleAxiosError } from '@/lib/axios';
import { AUTH } from '@/constants/api';
import {
  LoginFormData,
  SignUpCustomerFormData,
  SignUpVendorFormData,
} from '@/types/auth';
import { EditProfileData } from '@/types/user';
import {
  login as loginAPI,
  signUpCustomer as signUpCustomerAPI,
  signUpVendor as signUpVendorAPI,
} from '@/services/API/auth/signUp';

import { editProfile as editProfileAPI } from '@/services/API/auth/profile';
import { StorageKeys, removeStorageItem } from '@/lib/localStorage';
import routes from '@/constants/routes';
import { getRedirectTo } from '@/utils/redirects';

export const useAuthActions = () => {
  const [loading, setLoading] = useState(false);

  const signUpCustomer = async (data: SignUpCustomerFormData) => {
    setLoading(true);

    try {
      return await signUpCustomerAPI(data);
    } finally {
      setLoading(false);
    }
  };

  const signUpVendor = async (data: SignUpVendorFormData) => {
    setLoading(true);

    try {
      return await signUpVendorAPI(data);
    } finally {
      setLoading(false);
    }
  };

  const login = async (data: LoginFormData) => {
    setLoading(true);

    try {
      await loginAPI(data);

      // clear cart after login
      removeStorageItem(StorageKeys.CART);

      let redirectPath = routes.DASHBOARD.INDEX;

      const searchparams = new URLSearchParams(window.location.search);
      const redirectTo = getRedirectTo(searchparams);

      if (redirectTo) {
        redirectPath = redirectTo;
      } else if (
        window.location.pathname !== routes.INDEX &&
        !window.location.pathname.startsWith(routes.AUTH.INDEX)
      ) {
        // if user is not on homepage, redirect to current page
        redirectPath = window.location.pathname;
      }

      window.location.pathname = redirectPath;
    } finally {
      setLoading(false);
    }
  };

  const resetPassword = async (email: string) => {
    setLoading(true);
    try {
      const response = await axiosAPI.post(AUTH.RESET_PASSWORD, {
        email,
      });
      if (response.status === 200) {
        return true;
      }
    } catch (error) {
      handleAxiosError(error);
      throw error;
    } finally {
      setLoading(false);
    }

    return false;
  };

  const resetPasswordConfirm = async (token: string, password: string) => {
    setLoading(true);
    try {
      const response = await axiosAPI.post(AUTH.RESET_PASSWORD_CONFIRM, {
        token,
        password,
      });
      if (response.status === 200) {
        return true;
      }
    } finally {
      setLoading(false);
    }
    return false;
  };

  const editProfile = async (data: Partial<EditProfileData>) => {
    setLoading(true);

    try {
      return await editProfileAPI(data);
    } finally {
      setLoading(false);
    }
  };

  return {
    resetPassword,
    resetPasswordConfirm,
    login,
    signUpCustomer,
    editProfile,
    signUpVendor,
    loading,
  };
};
