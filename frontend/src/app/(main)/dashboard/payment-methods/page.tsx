import { cookiesKeys } from '@/lib/cookies';
import { getProfile } from '@/services/API/auth/profile';
import { cookies } from 'next/headers';
import PaymentMethodsPage from './PaymentMethodsPage';
import { USER_ROLES } from '@/constants/auth';
import { redirect } from 'next/navigation';
import routes from '@/constants/routes';

export const metadata = {
  title: 'Payment Methods',
};

const PaymentMethods = async () => {
  const accessToken = cookies().get(cookiesKeys.TOKEN)?.value;

  const profile = await getProfile(accessToken);

  if (profile?.role !== USER_ROLES.USER) {
    return redirect(routes.DASHBOARD.INDEX);
  }

  return <PaymentMethodsPage profile={profile} />;
};

export default PaymentMethods;
