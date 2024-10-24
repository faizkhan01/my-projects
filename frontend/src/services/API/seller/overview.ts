import { axiosAPI } from '@/lib/axios';
import { Product } from '@/types/products';

type OverviewProduct = Pick<
  Product,
  'id' | 'name' | 'images' | 'price' | 'slug' | 'stock' | 'currency'
> & {
  orderItems: {
    id: number;
  }[];
};

interface GetSellerOverviewResponse {
  best_products: OverviewProduct[];
  pending_orders: number;
  total_orders: number;
  products_out_of_stock: OverviewProduct[];
  total_revenue: {
    sum: number;
    currency: string;
  };
}

export const getSellerOverview = async () => {
  const res = await axiosAPI.get<GetSellerOverviewResponse>(
    '/users/sellers/overview',
  );

  return res.data;
};
