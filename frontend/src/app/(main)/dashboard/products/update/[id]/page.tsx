import { USER_ROLES } from '@/constants/auth';
import { cookiesKeys } from '@/lib/cookies';
import { getProfile } from '@/services/API/auth/profile';
import { getSellerProduct } from '@/services/API/seller/products';
import { dashboardIndexRedirect } from '@/utils/redirects';
import { cookies } from 'next/headers';
import { notFound } from 'next/navigation';
import UpdateProductPage from './UpdateProductPage';

export const metadata = {
  title: 'Update Product',
};

const UpdateProduct = async ({ params }: { params: { id: string } }) => {
  const token = cookies().get(cookiesKeys.TOKEN)?.value;

  const profile = await getProfile(token);
  const id = params?.id;

  if (profile?.role !== USER_ROLES.SELLER) {
    return dashboardIndexRedirect();
  }

  const product = await getSellerProduct(Number(id), token);

  if (!product) {
    return notFound();
  }

  return <UpdateProductPage profile={profile} product={product} />;
};

export default UpdateProduct;
