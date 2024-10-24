import { USER_ROLES } from '@/constants/auth';
import { cookiesKeys } from '@/lib/cookies';
import { getProfile } from '@/services/API/auth/profile';
import { getShippingProfiles } from '@/services/API/shipping-profiles';
import { dashboardIndexRedirect } from '@/utils/redirects';
import { cookies } from 'next/headers';
import ShippingProfilesPage from './ShippingProfilesPage';

export const metadata = {
  title: 'Shipping Profiles',
};

const ShippingProfiles = async () => {
  const token = cookies().get(cookiesKeys.TOKEN)?.value;
  const profile = await getProfile(token);

  if (profile.role !== USER_ROLES.SELLER) {
    return dashboardIndexRedirect();
  }

  const [profiles] = await Promise.all([getShippingProfiles(token)]);

  return <ShippingProfilesPage profiles={profiles} />;
};

export default ShippingProfiles;
