'use client';
import CatalogNewUpdateProduct from '@/components/sellerDashboard/CatalogNewUpdateProduct';
import { SellerDashboardLayout } from '@/layouts/SellerDashboardLayout';
import routes from '@/constants/routes';
import { CustomContainer } from '@/ui-kit/containers';
import { Breadcrumbs } from '@/ui-kit/breadcrumbs';
import { ProfileData } from '@/types/user';

const CreateCatalogProduct = ({ profile }: { profile: ProfileData }) => {
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
              name: 'Account',
              href: routes.SELLER_DASHBOARD.INDEX,
            },
            {
              name: 'Products',
              href: routes.SELLER_DASHBOARD.PRODUCTS.LIST,
            },
            {
              name: 'New Product',
            },
          ]}
        />
      </CustomContainer>
      <SellerDashboardLayout title="Catalog">
        <CatalogNewUpdateProduct profile={profile} />
      </SellerDashboardLayout>
    </>
  );
};

export default CreateCatalogProduct;
