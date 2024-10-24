import { USER_ROLES } from '@/constants/auth';
import { cookiesKeys } from '@/lib/cookies';
import { getProfile } from '@/services/API/auth/profile';
import { getSellerOrder } from '@/services/API/orders';
import { dashboardIndexRedirect } from '@/utils/redirects';
import { cookies } from 'next/headers';
import { notFound } from 'next/navigation';
import OrderPage from './OrderPage';
import { cache } from 'react';

interface OrdersProps {
  params: {
    id: string;
  };
}

const getData = cache(async (params: OrdersProps['params']) => {
  const id = Number(params?.id as string);

  if (isNaN(id)) {
    return notFound();
  }

  const accessToken = cookies().get(cookiesKeys.TOKEN)?.value;

  const [profile, clientOrder] = await Promise.all([
    getProfile(accessToken),
    getSellerOrder(id, accessToken),
  ]);

  if (profile.role !== USER_ROLES.SELLER) {
    return dashboardIndexRedirect();
  }

  return {
    profile,
    clientOrder,
  };
});

export async function generateMetadata({ params }: OrdersProps) {
  return {
    title: `Order #${params.id}`,
  };
}
const Order = async ({ params }: OrdersProps) => {
  const { clientOrder } = await getData(params);

  return <OrderPage clientOrder={clientOrder} />;
};

export default Order;
