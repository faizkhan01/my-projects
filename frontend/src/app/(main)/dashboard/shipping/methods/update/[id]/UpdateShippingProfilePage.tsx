'use client';
import routes from '@/constants/routes';
import { SellerDashboardLayout } from '@/layouts/SellerDashboardLayout';
import { Breadcrumbs } from '@/ui-kit/breadcrumbs';
import { CustomContainer } from '@/ui-kit/containers';
import ShippingInformationPage from '@/components/sellerDashboard/ShippingInformationPage';
import { ProfileData } from '@/types/user';
import { ShippingProfile } from '@/types/shippingProfiles';
import { Country } from '@/types/countries';
import { SWRConfig } from 'swr';
import { COUNTRIES } from '@/constants/api';

const ShippingMethodUpdate = ({
  profile,
  shippingProfile,
  countries,
}: {
  profile: ProfileData;
  countries: Country[];
  shippingProfile: ShippingProfile;
}) => {
  const title = 'Update shipping profile';

  return (
    <SWRConfig
      value={{
        fallback: {
          [COUNTRIES.LIST]: countries,
        },
      }}
    >
      <CustomContainer>
        <Breadcrumbs
          sx={{
            margin: '40px 0px',
            display: { md: 'block', xs: 'none' },
          }}
          links={[
            {
              name: 'Configuration',
              href: routes.SELLER_DASHBOARD.SHIPPING.INDEX,
            },
            {
              name: 'Shipping Methods',
              href: routes.SELLER_DASHBOARD.SHIPPING.METHODS.INDEX,
            },
            {
              name: title,
            },
          ]}
        />
      </CustomContainer>
      <SellerDashboardLayout title={title} hideTitleOnMobile>
        <ShippingInformationPage
          profile={profile}
          isEdit
          shippingProfile={shippingProfile}
        />
      </SellerDashboardLayout>
    </SWRConfig>
  );
};

export default ShippingMethodUpdate;
