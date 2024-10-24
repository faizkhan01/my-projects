'use client';
import CatalogNewUpdateProduct from '@/components/sellerDashboard/CatalogNewUpdateProduct';
import routes from '@/constants/routes';
import { SellerDashboardLayout } from '@/layouts/SellerDashboardLayout';
import { SellerProduct } from '@/types/products';
import { ProfileData } from '@/types/user';
import { Breadcrumbs } from '@/ui-kit/breadcrumbs';
import { CustomContainer } from '@/ui-kit/containers';

const UpdateCatalogProduct = ({
  product,
  profile,
}: {
  product: SellerProduct;
  profile: ProfileData;
}) => {
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
              name: product.name,
            },
          ]}
        />
      </CustomContainer>
      <SellerDashboardLayout title="Catalog">
        <CatalogNewUpdateProduct isEdit product={product} profile={profile} />
      </SellerDashboardLayout>
    </>
  );
};

export default UpdateCatalogProduct;
