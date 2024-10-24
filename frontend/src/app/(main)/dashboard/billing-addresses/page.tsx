import { USER_ROLES } from '@/constants/auth';
import { cookiesKeys } from '@/lib/cookies';
import { getProfile } from '@/services/API/auth/profile';
import { dashboardIndexRedirect } from '@/utils/redirects';
import { cookies } from 'next/headers';
import BillingAddressesPage from './BillingAddressesPage';

export const metadata = {
  title: 'Billing address',
};

const BillingAddresses = async () => {
  const accessToken = cookies().get(cookiesKeys.TOKEN)?.value;
  const [profile] = await Promise.all([getProfile(accessToken)]);

  if (profile.role !== USER_ROLES.USER) {
    return dashboardIndexRedirect();
  }

  return <BillingAddressesPage profile={profile} />;
};

export default BillingAddresses;
