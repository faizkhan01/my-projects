import { cookies } from 'next/headers';
import EditProfilePage from './EditProfilePage';
import { cookiesKeys } from '@/lib/cookies';
import { getProfile, getUserSettings } from '@/services/API/auth/profile';
import { USER_ROLES } from '@/constants/auth';
import { dashboardIndexRedirect } from '@/utils/redirects';

export const metadata = {
  title: 'Edit Profile',
};

const getData = async () => {
  const accessToken = cookies().get(cookiesKeys.TOKEN)?.value;

  const profile = await getProfile(accessToken);

  if (profile.role !== USER_ROLES.USER) {
    return dashboardIndexRedirect();
  }

  const [user] = await Promise.all([getUserSettings(accessToken)]);

  return {
    profile,
    user,
  };
};

const EditProfile = async () => {
  const { profile, user } = await getData();
  return <EditProfilePage profile={profile} user={user} />;
};

export default EditProfile;
