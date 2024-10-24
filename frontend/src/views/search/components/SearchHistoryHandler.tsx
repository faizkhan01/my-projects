'use client';
import { SEARCH_HISTORY } from '@/constants/api';
import useProfile from '@/hooks/queries/useProfile';
import {
  getStorageItem,
  StorageKeys,
  setStorageItem,
} from '@/lib/localStorage';
import { addToSearchHistory } from '@/services/API/search-history';
import { Product } from '@/types/products';
import { useCallback, useEffect } from 'react';
import { mutate } from 'swr';

const SearchHistoryHandler = ({
  keyword,
  products,
}: {
  keyword: string | null;
  products: Product[];
}) => {
  const { profile } = useProfile();

  const handleSearchHistory = useCallback(async () => {
    const term = keyword?.trim();
    if (!term || products?.length === undefined) return;

    if (profile) {
      await addToSearchHistory({
        keyword: term,
        resultsCount: products?.length,
      });
    } else {
      const oldItems = getStorageItem(StorageKeys.SEARCH_HISTORY) || [];
      const isExist = oldItems.find((i) => i.keyword === term);

      if (!isExist) {
        setStorageItem(StorageKeys.SEARCH_HISTORY, [
          ...oldItems,
          {
            keyword: term,
            id: Math.random() * 100000,
            createdAt: new Date().toISOString(),
            user: null,
            resultsCount: products?.length,
          },
        ]);
      }
    }

    mutate(SEARCH_HISTORY.LIST);
  }, [products?.length, profile, keyword]);

  useEffect(() => {
    handleSearchHistory();
  }, [handleSearchHistory]);

  return null;
};

export default SearchHistoryHandler;
