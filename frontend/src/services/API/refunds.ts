import { axiosAPI } from '@/lib/axios';
import { RefundReason, RefundWithExtraData } from '@/types/refunds';
import { CookieValueTypes } from 'cookies-next';

type GetAllRefundsResponse = RefundWithExtraData[];

interface CreateRefundAndReturnData {
  description: string;
  reasonId: number;
  orderItemId: number;
  images: File[];
}

export const getAllRefunds = async (token?: CookieValueTypes) => {
  const res = await axiosAPI.get<GetAllRefundsResponse>(`/refunds`, {
    headers: token
      ? {
          Authorization: `Bearer ${token}`,
        }
      : {},
  });
  return res.data;
};

export const getRefundReasons = async () => {
  const res = await axiosAPI.get<RefundReason[]>('/refunds/reasons');
  return res.data;
};

export const confirmRefund = async (
  refundId: number,
  data: {
    amount: number;
    reason: string;
  },
) => {
  const res = await axiosAPI.post<{ message: string }>(
    `/refunds/${refundId}/confirm`,
    data,
  );
  return res.data;
};

export const rejectRefund = async (
  refundId: number,
  data: {
    reason: string;
  },
) => {
  const res = await axiosAPI.post<{ message: string }>(
    `/refunds/${refundId}/cancel`,
    data,
  );
  return res.data;
};

export const createRefundAndReturn = async (
  data: CreateRefundAndReturnData,
) => {
  const formData = new FormData();

  formData.append('orderItemId', data.orderItemId.toString());
  formData.append('reasonId', data.reasonId.toString());
  formData.append('description', data.description);

  for (const image of data.images) {
    formData.append('images', image);
  }

  const res = await axiosAPI.post('/refunds', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return res.data;
};
