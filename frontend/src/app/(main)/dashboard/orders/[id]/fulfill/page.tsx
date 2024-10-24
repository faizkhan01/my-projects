import { USER_ROLES } from '@/constants/auth';
import { cookiesKeys } from '@/lib/cookies';
import { getProfile } from '@/services/API/auth/profile';
import { getSellerOrder } from '@/services/API/orders';
import { dashboardIndexRedirect } from '@/utils/redirects';
import { cookies } from 'next/headers';
import { notFound } from 'next/navigation';
import { cache } from 'react';
import FulfillOrderPage from './FulfillOrderPage';

interface Props {
  params: {
    id: string;
  };
}

const getData = cache(async (params: Props['params']) => {
  const id = Number(params?.id as string);

  if (isNaN(id)) {
    return notFound();
  }

  const accessToken = cookies().get(cookiesKeys.TOKEN)?.value;

  const [profile, order] = await Promise.all([
    getProfile(accessToken),
    getSellerOrder(id, accessToken),
  ]);

  if (profile.role !== USER_ROLES.SELLER) {
    return dashboardIndexRedirect();
  }

  return {
    profile,
    clientOrder: order,
  };
});

export async function generateMetadata({ params }: Props) {
  return {
    title: `Order #${params.id} - Add Fulfillment`,
  };
}

const FulfillOrder = async ({ params }: Props) => {
  const { clientOrder } = await getData(params);
  return <FulfillOrderPage order={clientOrder} />;
};

export default FulfillOrder;
