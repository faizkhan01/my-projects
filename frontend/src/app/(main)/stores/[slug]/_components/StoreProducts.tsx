'use client';
import { useSearchParams } from 'next/navigation';
import { useState, useRef, useMemo } from 'react';
import ProductsCardView from '@/components/productCard/ProductsCardView';

import { usePaginationFilters } from '@/hooks/pagination/usePaginationFilters';

import { styled } from '@mui/material/styles';
import { IconButton, Typography } from '@mui/material';
import { MagnifyingGlass } from '@phosphor-icons/react';
import { SortByMenu, type SortByMenuOption } from '@/ui-kit/menu';
import { Controller, useForm } from 'react-hook-form';
import useProducts from '@/hooks/queries/useProducts';
import { GetProductsParams } from '@/services/API/products';
import { DropdownPagination } from '@/ui-kit/pagination';
import { SearchInput } from '@/ui-kit/inputs';
import SearchDialog from '@/components/navbar/SearchDialog';
import { useRouteReplace } from '@/hooks/queries/useRouteReplace';

interface StoreProductsProps {
  storeSlug: string;
  storeName: string;
}

const SortbyDropdownContainer = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',

  [theme.breakpoints.down('sm')]: {},
}));

const SearchContainer = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  height: '40px',

  [theme.breakpoints.down('sm')]: {
    display: 'none',
  },
}));

const sortByOptions: SortByMenuOption[] = [
  {
    name: 'Name',
    value: 'name_asc',
  },
  {
    name: 'Newest',
    value: 'date_desc',
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

const defaultSort = sortByOptions[3];

export const StoreProducts = ({ storeSlug, storeName }: StoreProductsProps) => {
  const query = useSearchParams();
  const replacer = useRouteReplace();
  const [openSearchDialog, setOpenSearchDialog] = useState(false);
  const { page, perPage, q, offset, limit } = usePaginationFilters(null);
  const lasValue = useRef<string>(q);

  const sort_by = query?.get('sort_by');

  const [selected, setSelected] = useState(defaultSort);
  const { control, handleSubmit } = useForm<{ search: string }>({
    defaultValues: {
      search: q,
    },
  });

  const { products: results, isLoading: isLoadingProducts } = useProducts({
    q,
    limit,
    offset,
    store: storeName,
    withAggs: false,
    sort_by:
      (sort_by as GetProductsParams['sort_by']) ||
      (selected.value as GetProductsParams['sort_by']),
  });

  const [products, total] = useMemo(() => {
    const products = results?.results.results.map((p) => p._source) || [];
    const total = results?.total ?? 0;

    return [products, total];
  }, [results]);

  const changeRoute = (
    {
      newPage,
      newPerPage,
      newQ,
      newSortBy,
    }: {
      newPage?: number;
      newPerPage?: number;
      newQ?: string;
      newSortBy?: GetProductsParams['sort_by'];
    },
    replace = true,
  ) => {
    const query = {
      slug: storeSlug,
      q: newQ ?? q,
      page: newPage || page,
      perPage: newPerPage || perPage,
      sort_by: newSortBy || sort_by,
    };

    if (replace) return replacer.replace(query);

    return replacer.push(query);
  };

  const onSelect = (item: SortByMenuOption) => {
    setSelected(item);
    changeRoute({
      newPage: 1,
      newSortBy: item.value as GetProductsParams['sort_by'],
    });
  };

  const handlePageChange = (newPage: number) => {
    changeRoute({ newPage });
  };

  const handlePerPageChange = (newPerPage: number) => {
    changeRoute({ newPerPage });
  };

  const handleSearchSubmit = async ({ search }: { search: string }) => {
    if (search !== lasValue.current) {
      lasValue.current = search;
    } else {
      return;
    }

    changeRoute({ newQ: search });
  };

  const onSearchMobile = (value: string) => {
    changeRoute({ newQ: value }, false);
    onCloseSearchMobile();
  };

  const onCloseSearchMobile = () => setOpenSearchDialog(false);

  const isLoading = isLoadingProducts;

  return (
    <>
      <SearchDialog
        open={openSearchDialog}
        onClose={onCloseSearchMobile}
        onSearch={onSearchMobile}
        initialSearch={q}
      />
      <div className="flex flex-col gap-4 md:gap-[68px] md:gap-y-[22px]">
        <div className="flex flex-1 justify-between">
          <IconButton
            aria-label="Search products"
            className="text-primary-main sm:hidden"
            onClick={() => setOpenSearchDialog(true)}
          >
            <MagnifyingGlass size={24} />
          </IconButton>
          <SearchContainer>
            <form
              className="w-[470px]"
              onSubmit={handleSubmit(handleSearchSubmit)}
            >
              <Controller
                name="search"
                control={control}
                render={({ field }) => (
                  <SearchInput
                    placeholder={`Search ${storeName} item`}
                    label={`Search${storeName} item`}
                    {...field}
                  />
                )}
              />
            </form>
          </SearchContainer>
          <SortbyDropdownContainer>
            <SortByMenu
              setSelected={onSelect}
              selected={selected}
              options={sortByOptions}
            />
          </SortbyDropdownContainer>
        </div>
        <div>
          <ProductsCardView products={products} loading={isLoading} />
        </div>
        {!isLoading && products.length === 0 && (
          <div className="flex items-center justify-center p-10">
            <Typography variant="h5">
              This store don&apos;t have any products
            </Typography>
          </div>
        )}
        <div className="w-full">
          <DropdownPagination
            page={page}
            perPage={perPage}
            total={total}
            onPageChange={handlePageChange}
            onPerPageChange={handlePerPageChange}
            perPageOptions={[1, 2, 3, 4]}
          />
        </div>
      </div>
    </>
  );
};
