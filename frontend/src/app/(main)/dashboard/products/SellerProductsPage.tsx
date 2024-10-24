'use client';
import { SellerDashboardLayout } from '@/layouts/SellerDashboardLayout';
import CatalogAllProduct from '@/components/sellerDashboard/CatalogAllProduct';
import { SellerProduct } from '@/types/products';

const Catalog = ({ sellerProducts }: { sellerProducts: SellerProduct[] }) => {
  const title = 'Catalog';

  return (
    <SellerDashboardLayout title={title} hideTitleOnMobile>
      <CatalogAllProduct sellerProducts={sellerProducts} />
    </SellerDashboardLayout>
  );
};

export default Catalog;
