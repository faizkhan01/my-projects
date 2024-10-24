import { USER_ROLES } from '@/constants/auth';
import { cookiesKeys } from '@/lib/cookies';
import { getProfile } from '@/services/API/auth/profile';
import { getFollowingStores } from '@/services/API/following';
import { dashboardIndexRedirect } from '@/utils/redirects';
import { cookies } from 'next/headers';
import CustomerFollowingPage from './CustomerFollowingPage';

export const metadata = {
  title: 'Following',
};

const CustomerFollowing = async () => {
  const accessToken = cookies().get(cookiesKeys.TOKEN)?.value;

  const [profile] = await Promise.all([getProfile(accessToken)]);

  if (profile.role !== USER_ROLES.USER) {
    return dashboardIndexRedirect();
  }

  const following = await getFollowingStores(accessToken);

  return <CustomerFollowingPage profile={profile} following={following} />;
};

export default CustomerFollowing;
