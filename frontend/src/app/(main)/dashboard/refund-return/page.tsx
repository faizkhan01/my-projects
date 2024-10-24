import { USER_ROLES } from '@/constants/auth';
import { cookiesKeys } from '@/lib/cookies';
import { getProfile } from '@/services/API/auth/profile';
import { getAllRefunds } from '@/services/API/refunds';
import { dashboardIndexRedirect } from '@/utils/redirects';
import { cookies } from 'next/headers';
import RefundAndReturnPage from './RefundAndReturnPage';

export const metadata = {
  title: 'Refund and return',
};

const RefundReturn = async () => {
  const accessToken = cookies().get(cookiesKeys.TOKEN)?.value;

  const [profile, allRefunds] = await Promise.all([
    getProfile(accessToken),
    getAllRefunds(accessToken),
  ]);

  if (profile.role !== USER_ROLES.USER && profile.role !== USER_ROLES.SELLER) {
    return dashboardIndexRedirect();
  }

  return <RefundAndReturnPage profile={profile} allRefunds={allRefunds} />;
};

export default RefundReturn;
