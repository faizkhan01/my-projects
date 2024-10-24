'use client';
import { useCallback, useMemo } from 'react';
import { styled } from '@mui/material/styles';
import { Box, Stack, Typography } from '@mui/material';
import type { Wishlist } from '@/types/wishlist';
import useWishlist from '@/hooks/queries/customer/useWishlist';
import useProfile from '@/hooks/queries/useProfile';
import ProductsCardView from '@/components/productCard/ProductsCardView';
import { useViewedProducts } from '@/hooks/wishlist/useViewedProducts';
import { useRouter, useSearchParams } from 'next/navigation';
import { Product } from '@/types/products';
import { ProductGridCarousel } from '@/components/carousel/ProductGridCarousel';
import { SortByMenu, SortByMenuOption } from '@/ui-kit/menu';
import { CustomContainer, SectionContainer } from '@/ui-kit/containers';
import { BackLinkButton, FilterButton } from '@/ui-kit/buttons';
import { MobileHeading } from '@/ui-kit/typography';
import { stringify } from 'querystring';
import { ViewedProduct } from '@/types/viewedProducts';

const MainHeading = styled('h1')(({ theme }) => ({
  fontWeight: '600',
  fontSize: '40px',
  color: theme.palette.text.primary,
  fontStyle: 'normal',

  [theme.breakpoints.down('sm')]: {
    fontSize: '24px',
  },
}));

const SortContainer = styled(Box)(() => ({
  margin: '32px 0 24px 0',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  flexWrap: 'wrap',
}));

const sortOptions: SortByMenuOption[] = [
  {
    name: 'Name',
    value: 'name',
  },
  {
    name: 'Newest',
    value: 'newest',
  },
  {
    name: 'Price - Low to High',
    value: 'price_asc',
  },
  {
    name: 'Price - High to Low',
    value: 'price_desc',
  },
];

const FilterButtons = ({
  filter,
  setFilter,
}: {
  filter: FilterTypes;
  setFilter: (filter: FilterTypes) => void;
}) => (
  <Stack
    sx={{
      width: '100%',
      '& > button': {
        minWidth: 'auto',
        width: {
          xs: '100%',
          sm: 'auto',
        },
        fontSize: {
          xs: '14px',
          sm: '16px',
        },
      },
    }}
    spacing={{
      xs: '13px',
      sm: '16px',
    }}
    direction="row"
  >
    <FilterButton selected={filter === 'all'} onClick={() => setFilter('all')}>
      All Items
    </FilterButton>
    <FilterButton
      selected={filter === 'available'}
      onClick={() => setFilter('available')}
    >
      Available
    </FilterButton>
    <FilterButton
      selected={filter === 'unavailable'}
      onClick={() => setFilter('unavailable')}
    >
      Not Available
    </FilterButton>
  </Stack>
);

export type FilterTypes = 'all' | 'available' | 'unavailable';

type ProductSortType = (
  list: Wishlist | ViewedProduct[],
) => Wishlist | ViewedProduct[];

const sortCallbacks: Record<string, ProductSortType> = {
  name: (list) => {
    return list.sort((a, b) => {
      return a.product.name.localeCompare(b.product.name);
    });
  },
  price_asc: (list) => {
    return list.sort((a, b) => {
      const totalA =
        a.product.price - a.product.price * (a.product.discount / 100);
      const totalB =
        b.product.price - b.product.price * (b.product.discount / 100);
      return totalA - totalB;
    });
  },
  price_desc: (list) => {
    return list.sort((a, b) => {
      const totalA =
        a.product.price - a.product.price * (a.product.discount / 100);
      const totalB =
        b.product.price - b.product.price * (b.product.discount / 100);
      return totalB - totalA;
    });
  },
  newest: (list) => {
    return list.sort((a, b) => {
      if (a?.createdAt && b?.createdAt) {
        const aDate = new Date(a.createdAt);
        const bDate = new Date(b.createdAt);
        return bDate.getTime() - aDate.getTime();
      }
      return b.id - a.id;
    });
  },
};

const Wishlist = () => {
  const { isLoggedIn, isLoading: isLoadingProfile } = useProfile();
  const { wishlistArray, isLoading } = useWishlist();
  const { viewedProducts } = useViewedProducts();

  const products = useMemo(
    () => viewedProducts?.map((viewed) => viewed.product) || [],
    [viewedProducts],
  );

  const router = useRouter();
  const query = useSearchParams();
  const filter = (query.get('filter_by') as FilterTypes) || 'all';
  const sort = query.get('sort_by') || 'newest';
  const sortBy =
    sortOptions.find((option) => option.value === sort) || sortOptions[1];

  const replace = useCallback(
    (filter_by: FilterTypes, sortBy: SortByMenuOption) =>
      router.replace(
        `/wishlist?${stringify({
          filter_by: filter_by,
          sort_by: sortBy.value,
        })}`,
      ),
    [router],
  );

  const onSelect = (option: SortByMenuOption) => {
    replace(filter, option);
  };

  const changeFilter = (filter: FilterTypes) => {
    replace(filter, sortBy);
  };

  const filteredProducts = useMemo(() => {
    if (!wishlistArray) return [];

    const itemsMap: Product[] =
      sortCallbacks[sortBy.value]?.(wishlistArray).map(
        (wish) => wish.product,
      ) || [];

    const filteredItems = itemsMap.filter((item) => {
      if (filter === 'unavailable') {
        return item.stock <= 0;
      } else if (filter === 'available') {
        return item.stock > 0;
      }
      return true;
    });

    return filteredItems;
  }, [wishlistArray, filter, sortBy.value]);

  const filteredRecentProducts = useMemo(() => {
    if (!viewedProducts) return [];

    const sortedProducts: Product[] =
      sortCallbacks[sortBy.value]?.(viewedProducts).map(
        (wish) => wish.product,
      ) || [];

    return sortedProducts.filter((item) => {
      if (filter === 'unavailable') {
        return item.stock <= 0;
      } else if (filter === 'available') {
        return item.stock > 0;
      }
      return true;
    });
  }, [viewedProducts, sortBy.value, filter]);

  return (
    <Box>
      <CustomContainer>
        <BackLinkButton />
        <MobileHeading title="Wishlist" />
        <MainHeading
          sx={{
            marginTop: '20px',
            display: { md: 'block', xs: 'none' },
          }}
        >
          Wishlist
        </MainHeading>
        <SortContainer
          sx={{
            rowGap: '22px',
          }}
        >
          <Box
            sx={{
              width: {
                xs: '100%',
                sm: 'auto',
              },
              display: {
                xs: 'none',
                md: 'block',
              },
            }}
          >
            <FilterButtons filter={filter} setFilter={changeFilter} />
          </Box>
          <SortByMenu
            options={sortOptions}
            selected={sortBy}
            setSelected={onSelect}
          />
          <Box
            sx={{
              width: {
                xs: '100%',
                sm: 'auto',
              },
              display: {
                xs: 'block',
                md: 'none',
              },
            }}
          >
            <FilterButtons filter={filter} setFilter={changeFilter} />
          </Box>
        </SortContainer>
        <ProductsCardView products={filteredProducts} loading={isLoading} />

        {!wishlistArray?.length && !isLoading && isLoggedIn && (
          <Typography variant="h5" component="h2">
            You haven&apos;t added any products to your Wish List
          </Typography>
        )}

        {!isLoggedIn && !isLoadingProfile && (
          <Typography variant="h5" component="h2">
            Please Log In to add products in the wishlist
          </Typography>
        )}

        {!!products?.length && (
          <Box
            sx={{
              marginTop: '96px',
            }}
          >
            <SectionContainer
              title="Recently Viewed Items"
              typographyProps={{
                id: 'recently-viewed',
              }}
            >
              <ProductGridCarousel products={filteredRecentProducts} />
            </SectionContainer>
          </Box>
        )}
      </CustomContainer>
    </Box>
  );
};

export default Wishlist;
