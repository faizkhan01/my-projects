import axios, { AxiosHeaders } from 'axios';
import useGlobalSnackbar from '@/hooks/stores/useGlobalSnackbar';
import { useAuthStore } from '@/hooks/stores/useAuthStore';

// Error handlers
const handleAxiosError = (error: unknown) => {
  let message = undefined;

  if (axios.isAxiosError(error)) {
    const { response } = error;
    const data = response?.data as { message: string };

    if (data?.message) {
      message = data.message;
    }
  } else if ((error as Record<string, string>)?.message) {
    message = (error as Record<string, string>)?.message;
  }

  if (message) {
    return useGlobalSnackbar.getState().open({
      message: Array.isArray(message) ? message.join(', ') : message,
      severity: 'error',
    });
  }

  console.error(error);
};

// Instances
const axiosAPI = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  formSerializer: {
    indexes: null, // INFO: This avoids axios transforming file upload names from images to images[] when using postForm or updateForm
  },
});

axiosAPI.interceptors.request.use(
  (config) => {
    const state = useAuthStore.getState();
    const accessToken = state.token;

    if (accessToken && config.headers) {
      // https://github.com/axios/axios/issues/5416
      (config.headers as AxiosHeaders).set(
        'Authorization',
        `Bearer ${accessToken}`,
      );
    }

    return config;
  },
  (error) => {
    if (error?.response?.status === 401) {
      const state = useAuthStore.getState();

      state.logout();
    }
  },
);

export { axiosAPI, handleAxiosError };
