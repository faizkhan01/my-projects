import { axiosAPI } from '@/lib/axios';

interface CreateSupportRequestData {
  orderNumber: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  description: string;
  urgencyLevel: null | number;
  contactMethod: string;
  reason: string;
}

export const createSupportRequest = async (data: CreateSupportRequestData) => {
  const res = await axiosAPI.postForm<{ message: string }>(
    '/support-requests',
    data,
  );
  return res.data;
};
