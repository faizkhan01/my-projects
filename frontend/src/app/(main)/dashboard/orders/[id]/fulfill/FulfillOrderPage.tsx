'use client';
import { SellerDashboardLayout } from '@/layouts/SellerDashboardLayout';
import SellerOrdersFulfill from '@/components/sellerDashboard/SellerOrdersFulfill';
import { CustomContainer } from '@/ui-kit/containers';
import { useParams } from 'next/navigation';

import routes from '@/constants/routes';
import { Breadcrumbs } from '@/ui-kit/breadcrumbs';
import { ClientOrder } from '@/types/orders';

const Orders = ({ order }: { order: ClientOrder }) => {
  const params = useParams();

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
              name: `Order #${params.id}`,
              href: routes.SELLER_DASHBOARD.ORDERS.LIST,
            },
            {
              name: 'Fulfill',
            },
          ]}
        />
      </CustomContainer>
      <SellerDashboardLayout title="Orders">
        <SellerOrdersFulfill clientOrder={order} />
      </SellerDashboardLayout>
    </>
  );
};

export default Orders;
