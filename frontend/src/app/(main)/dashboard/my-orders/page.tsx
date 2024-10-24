import { USER_ROLES } from '@/constants/auth';
import { cookiesKeys } from '@/lib/cookies';
import { getProfile } from '@/services/API/auth/profile';
import { getOrders } from '@/services/API/orders';
import { dashboardIndexRedirect } from '@/utils/redirects';
import { cookies } from 'next/headers';
import CustomerOrdersPage from './CustomerOrdersPage';

export const metadata = {
  title: 'My Orders',
};

const MyOrders = async () => {
  const accessToken = cookies().get(cookiesKeys.TOKEN)?.value;
  const profile = await getProfile(accessToken);

  if (profile.role !== USER_ROLES.USER) {
    return dashboardIndexRedirect();
  }

  const [orders] = await Promise.all([getOrders(accessToken)]);

  return <CustomerOrdersPage profile={profile} orders={orders} />;
};

export default MyOrders;
