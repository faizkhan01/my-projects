import { StorageKeys, getStorageItem } from '@/lib/localStorage';

export const getCartFromStorage = () => {
  return getStorageItem(StorageKeys.CART);
};
