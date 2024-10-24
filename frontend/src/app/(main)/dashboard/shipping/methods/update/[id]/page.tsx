import { getCountries } from '@/services/API/countries';
import { USER_ROLES } from '@/constants/auth';
import { cookiesKeys } from '@/lib/cookies';
import { getProfile } from '@/services/API/auth/profile';
import { getShippingProfile } from '@/services/API/shipping-profiles';
import { dashboardIndexRedirect } from '@/utils/redirects';
import { cookies } from 'next/headers';
import { notFound } from 'next/navigation';
import UpdateShippingProfilePage from './UpdateShippingProfilePage';

export const metadata = {
  title: 'Update shipping profile',
};

const UpdateShippingProfile = async ({
  params,
}: {
  params: { id: string };
}) => {
  const id = Number(params.id);

  if (isNaN(id)) {
    return notFound();
  }

  const token = cookies().get(cookiesKeys.TOKEN)?.value;
  const [profile, countries, sProfile] = await Promise.all([
    getProfile(token),
    getCountries(),
    getShippingProfile(id, token),
  ]);

  if (profile.role !== USER_ROLES.SELLER) {
    return dashboardIndexRedirect();
  }

  if (!sProfile?.data) {
    return notFound();
  }

  return (
    <UpdateShippingProfilePage
      profile={profile}
      countries={countries}
      shippingProfile={sProfile.data}
    />
  );
};

export default UpdateShippingProfile;
