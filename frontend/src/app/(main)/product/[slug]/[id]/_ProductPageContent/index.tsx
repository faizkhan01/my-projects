'use client';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import { useState, useMemo, useEffect, useCallback, ReactNode } from 'react';
import { styled } from '@mui/material/styles';
import useAuthModalStore from '@/hooks/stores/useAuthModalStore';
import { Box, Stack, Divider, Rating, Tab } from '@mui/material';
import { Star, Heart, Warning } from '@phosphor-icons/react';
import { CustomContainer } from '@/ui-kit/containers';
import ProductCarousel from '@/components/carousel/ProductCarousel';
import ProductMobileCarousel from '@/components/carousel/ProductMobileCarousel';
import type { Product } from '@/types/products';
import routes from '@/constants/routes';
import useWishlist from '@/hooks/queries/customer/useWishlist';
import { useWishlistActions } from '@/hooks/wishlist/useWishlistActions';
import { ReviewsPanel } from '@/components/reviews/ReviewsPanel';
import { ProductJsonLd } from 'next-seo';
import {
  getStorageItem,
  setStorageItem,
  StorageKeys,
} from '@/lib/localStorage';
import { SimilarProductList } from '@/components/productPage/SimilarProductList';
import useProfile from '@/hooks/queries/useProfile';
import { USER_ROLES } from '@/constants/auth';
import { useParams } from 'next/navigation';
import { TabContext, TabList, TabPanel } from '@mui/lab';
import { mutate } from 'swr';
import { axiosAPI } from '@/lib/axios';
import { Breadcrumbs } from '@/ui-kit/breadcrumbs';
import { LoadingBackdrop } from '@/ui-kit/backdrops';
import { Category } from '@/types/categories';
import { GetProductReviewsResponse } from '@/services/API/products';

import { Store } from '@/types/stores';
import { ViewedProduct } from '@/types/viewedProducts';
import { HeaderButton, RatingContainer, ReviewContainer } from './styled';
import { ProductInfo } from './ProductInfo';
import { useCurrencyConverter } from '@/hooks/stores/useCurrencyConverterStore';
import { useActualCurrency } from '@/hooks/stores/useUserPreferencesStore';
import { calculatePrice } from '@/utils/currency';

const ReportProductModal = dynamic(
  () => import('@/components/modals/ReportProductModal'),
  {
    ssr: false,
    loading: () => <LoadingBackdrop open={true} />,
  },
);

export interface TabPanelProps {
  children?: ReactNode;
  index: number;
  value: number;
}

const ProductContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  marginTop: '24px',
  gap: '30px',

  [theme.breakpoints.down('sm')]: {
    margin: '0',
  },
}));

const ProductPage = ({
  product,
  categories,
  reviews,
  originUrl,
  store,
}: {
  product: Product;
  store: Store;
  categories: Category[];
  reviews: GetProductReviewsResponse | null;
  originUrl: string;
}) => {
  const params = useParams();
  const actualCurrency = useActualCurrency();
  const converter = useCurrencyConverter();

  const { wishlist } = useWishlist();
  const { addWishlist, removeWishlist } = useWishlistActions();
  const { profile, isLoading: isLoadingProfile } = useProfile();
  const [tab, setTab] = useState('0');
  const [isReporting, setIsReporting] = useState(false);
  const [isFirstReporting, setIsFirstReporting] = useState(false);
  const openAuth = useAuthModalStore((state) => state.open);

  const handleReportClick = () => {
    if (!profile) {
      openAuth('login');
    }
    if (profile?.role !== USER_ROLES.USER) {
      return;
    }
    setIsReporting(true);
    setIsFirstReporting(true);
  };

  const handleReportClose = () => {
    setIsReporting(false);
  };

  const productImages = useMemo(
    () =>
      product?.images.map((image, index) => ({
        url: image.url,
        title: `${product.name} Image ${index}`,
      })),
    [product],
  );
  const handleChangeTab = (_event: React.SyntheticEvent, newValue: string) => {
    setTab(newValue);
  };

  const addProductToViewedProducts = useCallback(async () => {
    const productId = params.id;

    if (profile) {
      try {
        await axiosAPI.post('/viewed-products', {
          productId: Number(productId),
        });

        mutate('/viewed-products'); // Update the viewed products data
      } catch (_) {
        //
      }
    } else {
      const viewedProducts = getStorageItem(StorageKeys.VIEWED_PRODUCTS) || [];
      const updatedViewedProducts: ViewedProduct[] = [
        { product, id: product.id, createdAt: new Date().toISOString() },
        ...viewedProducts.filter((old) => old.product.id !== product.id),
      ];
      setStorageItem(StorageKeys.VIEWED_PRODUCTS, updatedViewedProducts);
    }
  }, [params.id, product, profile]);

  useEffect(() => {
    if (isLoadingProfile) return;
    addProductToViewedProducts();
  }, [addProductToViewedProducts, isLoadingProfile]);

  const isWish = Boolean(wishlist?.[product.id]);

  return (
    <Box>
      <ProductJsonLd
        useAppDir
        productName={product.name}
        images={product.images.map((i) => i.url)}
        description={product.description}
        {...(product.rating && {
          aggregateRating: {
            ratingValue: product.rating,
            reviewCount: product.totalReviews,
          },
        })}
        reviews={
          reviews?.results.map((r) => ({
            author: [r.author.firstName, r.author.lastName].join(' '),
            datePublished: r.createdAt,
            reviewBody: r.comment,
            reviewRating: {
              ratingValue: r.rating,
            },
          })) ?? []
        }
        sku={product.sku}
        offers={[
          {
            availability: product.stock > 0 ? 'InStock' : 'OutOfStock',
            ...(product?.shipsTo?.length && {
              shippingDetails: product.shipsTo.map((s) => ({
                shippingRate: {
                  currency: actualCurrency,
                  value: converter(s.price, {
                    from: product.currency,
                    to: actualCurrency,
                  }),
                },
                deliveryTime: {
                  handlingTime: {
                    minValue: s.minProcessingDays,
                    maxValue: s.maxProcessingDays,
                    unitCode: 'DAY',
                  },
                  transitTime: {
                    minValue: s.minExpectedDays,
                    maxValue: s.maxExpectedDays,
                    unitCode: 'DAY',
                  },
                },
                ...(Boolean(!s.everywhere && s.iso2) && {
                  shippingDestination: {
                    addressCountry: s.iso2,
                  },
                }),
              })),
            }),
            seller: {
              name: product.store.name,
            },
            price: converter(
              calculatePrice({
                price: product.price,
                discount: product.discount,
              }).total,
              {
                from: product.currency,
                to: actualCurrency,
              },
            ),
            priceCurrency: actualCurrency,
          },
        ]}
      />
      <Box
        sx={{
          marginBottom: '35px',
          display: {
            xs: 'block',
            sm: 'none',
          },
        }}
      >
        <ProductMobileCarousel slides={productImages} />
      </Box>
      <CustomContainer>
        <Breadcrumbs
          sx={{
            display: {
              xs: 'none',
              sm: 'block',
            },
            margin: 0,
          }}
          links={[
            {
              name: 'Home',
              href: routes.INDEX,
            },
            ...categories.map((c, i) => ({
              name: c.name,
              href:
                i === 0 && !c.isProductType
                  ? routes.CATALOG.INFO(c.slug, c.id)
                  : routes.CATEGORIES.INFO(c.name),
            })),
            {
              name: product.name,
            },
          ]}
        />
        <Stack
          direction="row"
          spacing={{
            sm: 1,
            md: 2,
            lg: 4,
          }}
          sx={{
            paddingBlock: '18px',
            marginTop: '22px',
            display: {
              xs: 'none',
              sm: 'flex',
            },
          }}
        >
          <RatingContainer>
            <Rating
              readOnly
              value={product.rating}
              name="product-rating"
              icon={
                <Box
                  sx={{
                    color: 'warning.main',
                  }}
                >
                  <Star size={18} weight="fill" />
                </Box>
              }
              emptyIcon={
                <Box
                  sx={{
                    color: 'warning.main',
                  }}
                >
                  <Star size={18} />
                </Box>
              }
            />
            <ReviewContainer
              href={routes.PRODUCTS.REVIEWS(product.slug, product.id)}
            >
              {`${product.totalReviews ?? 0} ${
                product?.totalReviews === 1 ? 'Review' : 'Reviews'
              }`}
            </ReviewContainer>
          </RatingContainer>

          <Box
            component="span"
            sx={{
              display: 'flex',
              alignItems: 'center',
            }}
          >
            Seller:{' '}
            <Link
              legacyBehavior
              passHref
              href={routes.STORES.INFO(product.store.slug)}
            >
              <HeaderButton
                size="small"
                sx={{
                  fontWeight: 400,
                }}
              >
                {product.store.name}
              </HeaderButton>
            </Link>
          </Box>
          <HeaderButton
            size="small"
            startIcon={
              <Box
                sx={{
                  display: 'inline-flex',
                  ...(isWish && {
                    color: 'error.main',
                  }),
                }}
              >
                <Heart weight={isWish ? 'fill' : 'regular'} />
              </Box>
            }
            onClick={() =>
              isWish ? removeWishlist(product) : addWishlist(product)
            }
          >
            {isWish ? 'Remove from wishlist' : 'Add to wishlist'}
          </HeaderButton>
          <HeaderButton
            size="small"
            startIcon={<Warning />}
            onClick={handleReportClick}
          >
            Report this item
          </HeaderButton>
        </Stack>
        <Divider
          sx={{
            borderColor: '#EAECF4',
            display: {
              xs: 'none',
              sm: 'block',
            },
          }}
        />
        <ProductContainer>
          <Box
            sx={{
              display: {
                xs: 'none',
                sm: 'block',
              },
            }}
          >
            <ProductCarousel slides={productImages} />
          </Box>
          <ProductInfo
            store={store}
            product={product}
            isWish={isWish}
            onReportClick={handleReportClick}
            originUrl={originUrl}
          />
        </ProductContainer>
        <Box
          sx={{
            marginTop: {
              xs: '40px',
              sm: '70px',
            },
          }}
        >
          <Box
            sx={{
              borderBottom: 'none',
            }}
          >
            <TabContext value={tab}>
              <TabList onChange={handleChangeTab}>
                <Tab
                  label={
                    <span id="reviews">
                      {`Reviews (${product.totalReviews ?? 0})`}
                    </span>
                  }
                  value="0"
                  sx={{
                    fontSize: { xs: '16px', sm: '24px' },
                    lineHeight: { xs: '25.6px', md: '32px' },
                  }}
                />
              </TabList>

              <TabPanel value="0" sx={{ p: 0 }}>
                <ReviewsPanel product={product} />
              </TabPanel>
            </TabContext>
          </Box>

          {/* <TabPanel value={tab} index={0}> */}
          {/*   Here is the specifications */}
          {/* </TabPanel> */}
          <SimilarProductList productId={product.id} />
        </Box>
      </CustomContainer>
      {profile && isFirstReporting && (
        <ReportProductModal
          open={isReporting}
          onClose={handleReportClose}
          productId={product.id}
          // onSubmit={handleAddCard}
          // isLoading={isLoading}
        />
      )}
    </Box>
  );
};

export default ProductPage;
