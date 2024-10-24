'use client';
import SellerShipping from '@/components/sellerDashboard/SellerShipping';
import { SellerDashboardLayout } from '@/layouts/SellerDashboardLayout';

const Shipping = () => {
  return (
    <SellerDashboardLayout title="Shipping" hideTitleOnMobile>
      <SellerShipping />
    </SellerDashboardLayout>
  );
};

export default Shipping;
