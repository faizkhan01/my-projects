'use client';
import { memo } from 'react';
import ProductCard, { type ProductCardProps } from './ProductCard';
import { Product } from '@/types/products';
import { Skeleton, Theme, useMediaQuery } from '@mui/material';
import useCart from '@/hooks/queries/customer/useCart';
import useWishlist from '@/hooks/queries/customer/useWishlist';
import { ProductGridCarousel } from '../carousel/ProductGridCarousel';
import { useUserPreferencesStore } from '@/hooks/stores/useUserPreferencesStore';
import clsx from 'clsx';
import { isProductFreeShipping } from '@/utils/products';
import { useCurrencyConverter } from '@/hooks/stores/useCurrencyConverterStore';

interface ProductsCardViewProps {
  products: Product[];
  loading?: boolean;
  loadingCount?: number;
  size?: ProductCardProps['size'];
  carouselOnMobile?: boolean;
}

const ProductsCardView = memo(
  ({
    products,
    size,
    loading = false,
    loadingCount = 5,
    carouselOnMobile = false,
  }: ProductsCardViewProps): JSX.Element => {
    const shippingCountry = useUserPreferencesStore(
      (state) => state.shippingCountry,
    );
    const currency = useUserPreferencesStore((state) => state.currency);
    const converter = useCurrencyConverter();

    const isMobile = useMediaQuery((theme: Theme) =>
      theme.breakpoints.down('sm'),
    );
    const { cart } = useCart();
    const { wishlist } = useWishlist();

    if (!products.length && !loading) return <></>;

    return (
      <>
        {Boolean(carouselOnMobile && isMobile) && (
          <ProductGridCarousel products={products} loading={loading} />
        )}

        {Boolean(carouselOnMobile && isMobile) === false && (
          <div
            className={clsx(
              'grid grid-cols-2 gap-[15px] sm:grid-cols-3',
              size === 'large' && 'md:gap-[30px] lg:grid-cols-3',
              size !== 'large' && 'md:gap-[20px] lg:grid-cols-4',
            )}
          >
            {loading &&
              new Array(carouselOnMobile ? 2 : loadingCount)
                .fill(0)
                .map((_, index) => (
                  <Skeleton variant="rounded" height={400} key={index} />
                ))}

            {!loading &&
              products.map((product) => {
                const isInWish = Boolean(wishlist[product.id]);
                const isInCart = Boolean(cart[product.id]);

                return (
                  <ProductCard
                    key={product.id}
                    product={product}
                    isWish={isInWish}
                    isCart={isInCart}
                    currency={currency ?? 'USD'}
                    exchangeRate={converter(1, {
                      from: product.currency,
                      to: currency,
                    })}
                    isFreeShipping={isProductFreeShipping(
                      shippingCountry,
                      product,
                    )}
                    size={size}
                  />
                );
              })}
          </div>
        )}
      </>
    );
  },
);

ProductsCardView.displayName = 'ProductsCardView';

export default ProductsCardView;
