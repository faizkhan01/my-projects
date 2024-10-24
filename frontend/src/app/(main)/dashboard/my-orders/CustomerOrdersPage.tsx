import { DashboardLayout } from '@/layouts/DashboardLayout';
import MyOrders from '@/components/dashboard/MyOrders/MyOrders';
import { ProfileData } from '@/types/user';
import { Order } from '@/types/orders';

const Orders = ({
  profile,
  orders,
}: {
  profile: ProfileData;
  orders: Order[];
}) => (
  <DashboardLayout profile={profile} title="My Orders">
    <MyOrders orders={orders} />
  </DashboardLayout>
);

export default Orders;
