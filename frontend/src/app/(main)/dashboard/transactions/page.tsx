import { USER_ROLES } from '@/constants/auth';
import { cookiesKeys } from '@/lib/cookies';
import { getProfile } from '@/services/API/auth/profile';
import { getSellerPayout } from '@/services/API/payouts';
import { getSellerBalance } from '@/services/API/seller/balance';
import { getSellerTransactions } from '@/services/API/transactions';
import { dashboardIndexRedirect } from '@/utils/redirects';
import { cookies } from 'next/headers';
import TransactionsPage from './TransactionsPage';

export const metadata = {
  title: 'Transactions',
};

const Transactions = async () => {
  const accessToken = cookies().get(cookiesKeys.TOKEN)?.value;

  const [profile, payouts, balance, transactions] = await Promise.all([
    getProfile(accessToken),
    getSellerPayout(accessToken),
    getSellerBalance(accessToken),
    getSellerTransactions(accessToken),
  ]);

  if (profile.role !== USER_ROLES.SELLER) {
    return dashboardIndexRedirect();
  }

  return (
    <TransactionsPage
      balance={balance}
      payouts={payouts}
      transactions={transactions}
    />
  );
};

export default Transactions;
