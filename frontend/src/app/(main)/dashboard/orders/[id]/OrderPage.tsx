'use client';
import { SellerDashboardLayout } from '@/layouts/SellerDashboardLayout';
import { CustomContainer } from '@/ui-kit/containers';
import routes from '@/constants/routes';
import SellerOrderPage from '@/components/sellerDashboard/SellerOrderPage';
import { Breadcrumbs } from '@/ui-kit/breadcrumbs';
import { ClientOrder } from '@/types/orders';

interface OrderPageProps {
  clientOrder: ClientOrder;
}

const Order = ({ clientOrder }: OrderPageProps) => {
  const title = `Order #${clientOrder.id}`;

  return (
    <>
      <CustomContainer>
        <Breadcrumbs
          sx={{
            margin: '40px 0px',
            display: { md: 'block', xs: 'none' },
          }}
          links={[
            {
              name: 'Orders',
              href: routes.SELLER_DASHBOARD.ORDERS.LIST,
            },
            {
              name: title,
            },
          ]}
        />
      </CustomContainer>
      <SellerDashboardLayout title="Orders">
        <SellerOrderPage clientOrder={clientOrder} />
      </SellerDashboardLayout>
    </>
  );
};

export default Order;
