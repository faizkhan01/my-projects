import { getProduct } from '@/services/API/products';
import ReviewPage from './ReviewPage';
import { redirect } from 'next/navigation';
import routes from '@/constants/routes';

export const metadata = {
  title: 'Review',
};

const ProductReview = async ({
  params,
  searchParams,
}: {
  params: { slug: string; id: string };
  searchParams: {
    orderItem?: string;
  };
}) => {
  const id = Number(params.id);
  const orderItemId = Number(searchParams.orderItem);

  if (!searchParams?.orderItem || isNaN(id) || isNaN(orderItemId)) {
    return redirect(routes.PRODUCTS.INFO(params.slug, id));
  }

  const product = await getProduct(id);

  return <ReviewPage product={product} orderItemId={orderItemId} />;
};

export default ProductReview;
