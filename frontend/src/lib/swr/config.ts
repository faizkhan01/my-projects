import { SWRConfiguration } from 'swr';
import axios, { AxiosRequestConfig } from 'axios';
import { axiosAPI } from '@/lib/axios';

const swrConfiguration: SWRConfiguration = {
  fetcher: async <T>(url: string, config?: AxiosRequestConfig): Promise<T> => {
    try {
      const { data }: { data: T } = await axiosAPI.get(url, {
        ...(config || {}),
      });

      return data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error(error);
        throw error;
      } else {
        throw error;
      }
    }
  },
};

export default swrConfiguration;
