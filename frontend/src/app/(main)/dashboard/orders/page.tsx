import { USER_ROLES } from '@/constants/auth';
import routes from '@/constants/routes';
import { cookiesKeys } from '@/lib/cookies';
import { getProfile } from '@/services/API/auth/profile';
import { dashboardIndexRedirect } from '@/utils/redirects';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import SellerOrdersPage from './SellerOrdersPage';
import { getSellerOrders } from '@/services/API/orders';

export const metadata = {
  title: 'Orders',
};
const Orders = async () => {
  const accessToken = cookies().get(cookiesKeys.TOKEN)?.value;

  const profile = await getProfile(accessToken);

  if (profile.role === USER_ROLES.USER) {
    return redirect(routes.DASHBOARD.MY_ORDERS);
  }

  if (profile.role !== USER_ROLES.SELLER) {
    return dashboardIndexRedirect();
  }

  const sellerOrders = await getSellerOrders(accessToken);

  return <SellerOrdersPage sellerOrders={sellerOrders} />;
};

export default Orders;
