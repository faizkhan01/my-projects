import { PROMOTIONS } from '@/constants/api';
import { axiosAPI } from '@/lib/axios';
import { Promotion } from '@/types/promotion';

type GetPromotionsResponse = Promotion[];
type GetPromotionResponse = Promotion;

export const getPromotions = async () => {
  const res = await axiosAPI.get<GetPromotionsResponse>(PROMOTIONS.LIST);

  return res.data;
};

export const getPromotion = async (id: number) => {
  const res = await axiosAPI.get<GetPromotionResponse>(PROMOTIONS.ONE(id));

  return res.data;
};
