import { CookieValueTypes } from 'cookies-next';
import { axiosAPI } from '@/lib/axios';
import { Notification } from '@/types/notifications';

export interface GetNotificationsResponse {
  total: number;
  limit: number;
  offset: number;
  results: Notification[];
}

export const getNotifications = async (
  url: string,
  token?: CookieValueTypes,
) => {
  const response = await axiosAPI.get<GetNotificationsResponse>(url, {
    headers: token
      ? {
          Authorization: `Bearer ${token}`,
        }
      : {},
  });
  return response.data;
};

export const markReadNotification = async (notificationId: number) => {
  const response = await axiosAPI.post(`/notifications/${notificationId}/read`);

  return response.data;
};

export const resetNotificationsCount = async () => {
  const response = await axiosAPI.post(`/notifications/reset`);

  return response.data;
};
