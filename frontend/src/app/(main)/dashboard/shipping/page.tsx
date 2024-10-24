import { USER_ROLES } from '@/constants/auth';
import { cookiesKeys } from '@/lib/cookies';
import { getProfile } from '@/services/API/auth/profile';
import { dashboardIndexRedirect } from '@/utils/redirects';
import { cookies } from 'next/headers';
import SellerShippingPage from './SellerShippingPage';

export const metadata = {
  title: 'Shipping',
};

const SellerShipping = async () => {
  const token = cookies().get(cookiesKeys.TOKEN)?.value;
  const profile = await getProfile(token);

  if (profile.role !== USER_ROLES.SELLER) {
    return dashboardIndexRedirect();
  }

  return <SellerShippingPage />;
};

export default SellerShipping;
