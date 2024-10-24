import { USER_ROLES } from '@/constants/auth';
import { cookiesKeys } from '@/lib/cookies';
import { getCustomersOrders } from '@/services/API/allCustomers';
import { getProfile } from '@/services/API/auth/profile';
import { dashboardIndexRedirect } from '@/utils/redirects';
import { cookies } from 'next/headers';
import CustomersPage from './CustomersPage';

export const metadata = {
  title: 'Customers',
};

const Customers = async () => {
  const accessToken = cookies().get(cookiesKeys.TOKEN)?.value;
  const profile = await getProfile(accessToken);

  if (profile.role !== USER_ROLES.SELLER) {
    return dashboardIndexRedirect();
  }

  const [customersOrders] = await Promise.all([
    getCustomersOrders(accessToken),
  ]);

  return <CustomersPage customersOrders={customersOrders} />;
};

export default Customers;
