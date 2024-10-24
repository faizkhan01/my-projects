'use client';
import ShippingProfiles from '@/components/sellerDashboard/ShippingProfiles';
import { SellerDashboardLayout } from '@/layouts/SellerDashboardLayout';
import { SELLER } from '@/constants/api';
import { ShippingProfile } from '@/types/shippingProfiles';
import { SWRConfig } from 'swr';

const Profiles = ({ profiles }: { profiles: ShippingProfile[] }) => {
  const title = 'Shipping Profiles';

  return (
    <SWRConfig
      value={{
        fallback: {
          [SELLER.SHIPPING_PROFILES.LIST]: profiles,
        },
      }}
    >
      <SellerDashboardLayout title={title} hideTitleOnMobile>
        <ShippingProfiles />
      </SellerDashboardLayout>
    </SWRConfig>
  );
};

export default Profiles;
