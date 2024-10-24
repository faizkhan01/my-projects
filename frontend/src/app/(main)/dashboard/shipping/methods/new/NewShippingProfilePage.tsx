'use client';
import ShippingInformationPage from '@/components/sellerDashboard/ShippingInformationPage';
import { SellerDashboardLayout } from '@/layouts/SellerDashboardLayout';
import routes from '@/constants/routes';
import { CustomContainer } from '@/ui-kit/containers';
import { COUNTRIES } from '@/constants/api';
import { Breadcrumbs } from '@/ui-kit/breadcrumbs';
import { ProfileData } from '@/types/user';
import { Country } from '@/types/countries';
import { SWRConfig } from 'swr';

const ShippingInformation = ({
  profile,
  countries,
}: {
  profile: ProfileData;
  countries: Country[];
}) => {
  const title = 'Create shipping profile';
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
        <ShippingInformationPage profile={profile} />
      </SellerDashboardLayout>
    </SWRConfig>
  );
};

export default ShippingInformation;
