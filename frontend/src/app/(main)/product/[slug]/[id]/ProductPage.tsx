import {
  GetProductReviewsResponse,
  GetProductRatingResponse,
} from '@/services/API/products';
import { Category } from '@/types/categories';
import ProductPageContent from './_ProductPageContent';
import { Product } from '@/types/products';
import { unstable_serialize } from 'swr/infinite';
import { PRODUCTS } from '@/constants/api';
import { getUseProductReviewsKey } from '@/hooks/queries/swr-keys';
import { Store } from '@/types/stores';
import { SWRProvider } from '@/components/Providers';

const ProductPage = ({
  product,
  categories,
  reviews,
  reviewsWithImages,
  rating,
  similarProducts,
  originUrl,
  store,
}: {
  product: Product;
  store: Store;
  similarProducts: Product[];
  categories: Category[];
  reviews: GetProductReviewsResponse | null;
  reviewsWithImages: GetProductReviewsResponse | null;
  rating: GetProductRatingResponse;
  originUrl: string;
}) => {
  const id = product.id;
  const reviewsKey = getUseProductReviewsKey(id, { with_media: false });
  const reviewsWithImagesKey = getUseProductReviewsKey(id, {
    limit: 20,
    with_media: true,
  });
  const swrReviewsKey = unstable_serialize(reviewsKey);
  const swrReviewsWithImagesKey = unstable_serialize(reviewsWithImagesKey);

  return (
    <SWRProvider
      options={{
        fallback: {
          [swrReviewsKey]: [reviews],
          [swrReviewsWithImagesKey]: [reviewsWithImages],
          [PRODUCTS.RATING(id)]: rating,
          [PRODUCTS.SIMILARS(id)]: similarProducts,
        },
      }}
    >
      <ProductPageContent
        product={product}
        store={store}
        categories={categories}
        reviews={reviews}
        originUrl={originUrl}
      />
    </SWRProvider>
  );
};

export default ProductPage;
