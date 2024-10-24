import { USER_ROLES } from '@/constants/auth';
import { cookiesKeys } from '@/lib/cookies';
import { getProfile } from '@/services/API/auth/profile';
import { dashboardIndexRedirect } from '@/utils/redirects';
import { cookies } from 'next/headers';
import { getCountries } from '@/services/API/countries';
import NewShippingProfilePage from './NewShippingProfilePage';

export const metadata = {
  title: 'Create shipping profile',
};

const NewShippingProfile = async () => {
  const token = cookies().get(cookiesKeys.TOKEN)?.value;

  const [profile, countries] = await Promise.all([
    getProfile(token),
    getCountries(),
  ]);

  if (profile.role !== USER_ROLES.SELLER) {
    return dashboardIndexRedirect();
  }

  return <NewShippingProfilePage profile={profile} countries={countries} />;
};

export default NewShippingProfile;
