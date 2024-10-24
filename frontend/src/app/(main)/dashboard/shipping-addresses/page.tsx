import { USER_ROLES } from '@/constants/auth';
import { cookiesKeys } from '@/lib/cookies';
import { getProfile } from '@/services/API/auth/profile';
import { dashboardIndexRedirect } from '@/utils/redirects';
import { cookies } from 'next/headers';
import ShippingAddressesPage from './ShippingAddressesPage';

export const metadata = {
  title: 'Shipping address',
};

const ShippingAddresses = async () => {
  const accessToken = cookies().get(cookiesKeys.TOKEN)?.value;

  const [profile] = await Promise.all([getProfile(accessToken)]);

  if (profile.role !== USER_ROLES.USER) {
    return dashboardIndexRedirect();
  }

  return <ShippingAddressesPage profile={profile} />;
};

export default ShippingAddresses;
