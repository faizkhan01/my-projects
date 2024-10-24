import { getProfile } from '@/services/API/auth/profile';
import { cookiesKeys } from '@/lib/cookies';
import { cookies } from 'next/headers';
import DashboardPage from './DashboardPage';

export const metadata = {
  title: 'Dashboard',
};

const Dashboard = async () => {
  const token = cookies().get(cookiesKeys.TOKEN)?.value;
  const profile = await getProfile(token);

  return <DashboardPage profile={profile} />;
};

export default Dashboard;
