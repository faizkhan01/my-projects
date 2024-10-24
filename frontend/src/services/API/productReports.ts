import { AxiosResponse } from 'axios';
import { axiosAPI } from '@/lib/axios';
import { type ReportCategory } from '@/types/productReports';

export interface CreateReportResponse extends AxiosResponse {
  data: {
    detailReason: string;
    reasonId: number;
    productId: number;
    message: string;
  };
}

export interface GetReportCategoriesResponse extends AxiosResponse {
  data: ReportCategory[];
}

export const getReportCategories = async () => {
  const { data }: GetReportCategoriesResponse = await axiosAPI.get(
    '/product-reports/categories',
  );
  return data;
};

export const createReport = async (
  detailReason: string,
  reasonId: number,
  productId: number,
) => {
  const response: CreateReportResponse = await axiosAPI.post(
    '/product-reports',
    {
      detailReason: detailReason,
      reasonId: reasonId,
      productId: productId,
    },
  );

  return response.data;
};
