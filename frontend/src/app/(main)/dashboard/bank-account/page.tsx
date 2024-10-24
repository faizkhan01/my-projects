import { USER_ROLES } from '@/constants/auth';
import { cookiesKeys } from '@/lib/cookies';
import { getProfile } from '@/services/API/auth/profile';
import { getBankInfo } from '@/services/API/seller/bankInfo';
import { dashboardIndexRedirect } from '@/utils/redirects';
import { cookies } from 'next/headers';
import BankAccountPage from './BankAccountPage';

export const metadata = {
  title: 'Bank Account',
};

const BankAccount = async () => {
  const token = cookies().get(cookiesKeys.TOKEN)?.value;

  const profile = await getProfile(token);

  if (profile.role !== USER_ROLES.SELLER) {
    return dashboardIndexRedirect();
  }

  const [bankInfo] = await Promise.all([getBankInfo(token)]);

  return <BankAccountPage bankInfo={bankInfo.data} profile={profile} />;
};

export default BankAccount;
