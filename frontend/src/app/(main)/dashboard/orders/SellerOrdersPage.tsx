'use client';
import OrdersPage from '@/components/sellerDashboard/OrdersPage';
import { SellerDashboardLayout } from '@/layouts/SellerDashboardLayout';
import { SellerOrder } from '@/types/sellerOrders';

interface SellerOrdersProps {
  sellerOrders: SellerOrder[];
}

const orders = ({ sellerOrders }: SellerOrdersProps) => {
  const title = 'Orders';
  return (
    <SellerDashboardLayout title={title}>
      <OrdersPage sellerOrders={sellerOrders} />
    </SellerDashboardLayout>
  );
};

export default orders;
