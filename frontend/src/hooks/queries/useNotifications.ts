import { axiosAPI } from '@/lib/axios';
import { GetNotificationsResponse } from '@/services/API/notifications';
import useSWRInfinite from 'swr/infinite';
import { getUseNotificationsKey } from './swr-keys';

export const useNotifications = () => {
  const { data, size, setSize, isLoading } = useSWRInfinite(
    getUseNotificationsKey,
    async (url) => {
      const res = await axiosAPI.get<GetNotificationsResponse>(url as string);
      return res.data;
    },
    {
      revalidateOnFocus: false,
    },
  );

  return {
    notifications: data,
    size,
    setSize,
    isLoading,
  };
};
