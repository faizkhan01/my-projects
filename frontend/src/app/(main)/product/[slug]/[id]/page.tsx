import { getCategoriesByProduct } from '@/services/API/categories';
import {
  getProduct,
  getProductReviews,
  getProductRating,
  getSimilarProducts,
} from '@/services/API/products';
import axios from 'axios';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import ProductPage from './ProductPage';
import { getUseProductReviewsKey } from '@/hooks/queries/swr-keys';
import { headers } from 'next/headers';
import { getOrigin } from '@/utils/ssr';
import { getStore } from '@/services/API/stores';

interface Props {
  params: { slug: string; id: string };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const id = Number(params.id);

  const product = await getProduct(id);

  return {
    title: product.name,
  };
}

const Product = async ({ params }: Props) => {
  const id = Number(params.id);
  const originUrl = getOrigin(headers());

  const reviewsKey = getUseProductReviewsKey(id, { with_media: false });
  const queryReviewsKey = reviewsKey(0, null)?.toString();

  const reviewsWithImagesKey = getUseProductReviewsKey(id, {
    limit: 20,
    with_media: true,
  });
  const queryReviewsWithImagesKey = reviewsWithImagesKey(0, null)?.toString();

  try {
    const [
      product,
      categories,
      reviews,
      reviewsWithImages,
      rating,
      similarProducts,
    ] = await Promise.all([
      getProduct(id),
      getCategoriesByProduct(id),
      queryReviewsKey ? getProductReviews(queryReviewsKey) : null,
      queryReviewsWithImagesKey
        ? getProductReviews(queryReviewsWithImagesKey)
        : null,
      getProductRating(id),
      getSimilarProducts(id),
    ]);

    if (product.published === false) {
      return notFound();
    }

    const store = await getStore(product.store?.slug);

    return (
      <ProductPage
        store={store}
        similarProducts={similarProducts?.data?.map((p) => p._source)}
        product={product}
        categories={categories}
        reviews={reviews}
        reviewsWithImages={reviewsWithImages}
        rating={rating}
        originUrl={originUrl}
      />
    );
  } catch (error) {
    if (axios.isAxiosError(error)) {
      if (error.response?.status === 404) {
        console.error('not found product', id);
        console.error(error.response);
        return notFound();
      } else {
        console.error(`An error loading some product data: ${id}`);
        console.error(error.response);

        throw new Error(error.response?.data);
      }
    }
    throw new Error(`Unknown error loading product data: ${error}`);
  }
};

export default Product;
