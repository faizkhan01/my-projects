import { axiosAPI } from '@/lib/axios';
import { reportSeller } from '@/types/reportSeller';

export const reportsSellerModal = async (data: reportSeller) => {
  const res = await axiosAPI.post<{ message: string }>('/seller-reports', data);
  return res.data;
};
