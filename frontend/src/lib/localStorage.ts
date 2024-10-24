import { Cart } from '@/types/cart';
import { SearchHistory } from '@/types/searchHistory';
import { ViewedProduct } from '@/types/viewedProducts';

export enum StorageKeys {
  CART = 'cart',
  VIEWED_PRODUCTS = 'viewedProducts',
  SEARCH_HISTORY = 'searchHistory',
}

interface StorageValues {
  [StorageKeys.CART]: Cart;
  [StorageKeys.VIEWED_PRODUCTS]: ViewedProduct[];
  [StorageKeys.SEARCH_HISTORY]: SearchHistory[];
}

export const getStorageItem = <T extends StorageKeys>(
  key: T,
): StorageValues[T] | null => {
  const item = localStorage.getItem(key);
  return item ? JSON.parse(item) : null;
};

export const setStorageItem = <T extends StorageKeys>(
  key: T,
  value: StorageValues[T],
): void => {
  localStorage.setItem(key, JSON.stringify(value));
};

export const removeStorageItem = <T extends StorageKeys>(key: T): void => {
  localStorage.removeItem(key);
};
