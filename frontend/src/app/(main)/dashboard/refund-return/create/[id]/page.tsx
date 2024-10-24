import { USER_ROLES } from '@/constants/auth';
import { cookiesKeys } from '@/lib/cookies';
import { getProfile } from '@/services/API/auth/profile';
import { getOrderItem } from '@/services/API/orderItem';
import { dashboardIndexRedirect } from '@/utils/redirects';
import { cookies } from 'next/headers';
import CreateRefundPage from './CreateRefundPage';
import { notFound } from 'next/navigation';

const CreateRefund = async ({ params }: { params: { id: string } }) => {
  const orderId = Number(params?.id);
  const accessToken = cookies().get(cookiesKeys.TOKEN)?.value;

  const [profile, orderItem] = await Promise.all([
    getProfile(accessToken),
    getOrderItem(orderId, accessToken),
  ]);

  if (profile.role !== USER_ROLES.USER) {
    return dashboardIndexRedirect();
  }

  if (!orderItem) {
    return notFound();
  }

  return <CreateRefundPage orderItem={orderItem} profile={profile} />;
};

export default CreateRefund;
