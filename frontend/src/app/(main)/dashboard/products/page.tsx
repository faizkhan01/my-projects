import { USER_ROLES } from '@/constants/auth';
import { cookiesKeys } from '@/lib/cookies';
import { getProfile } from '@/services/API/auth/profile';
import { getSellerProducts } from '@/services/API/seller/products';
import { dashboardIndexRedirect } from '@/utils/redirects';
import { cookies } from 'next/headers';
import SellerProductsPage from './SellerProductsPage';

export const metadata = {
  title: 'Products',
};

const SellerProducts = async () => {
  const accessToken = cookies().get(cookiesKeys.TOKEN)?.value;

  const profile = await getProfile(accessToken);

  if (profile.role !== USER_ROLES.SELLER) {
    return dashboardIndexRedirect();
  }

  const [sellerProducts] = await Promise.all([getSellerProducts(accessToken)]);

  return <SellerProductsPage sellerProducts={sellerProducts} />;
};

export default SellerProducts;
