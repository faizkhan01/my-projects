import {
  addToCart as addToCartAPI,
  removeFromCart as removeFromCartAPI,
  updateCartItem,
} from '@/services/API/cart';
import { useSWRConfig } from 'swr';
import type { Cart, CartItem } from '@/types/cart';
import {
  getStorageItem,
  setStorageItem,
  StorageKeys,
} from '@/lib/localStorage';
import { Product } from '@/types/products';
import { USER_ROLES } from '@/constants/auth';
import { useRouter } from 'next/navigation';
import routes from '@/constants/routes';
import { getUseCartMutateKey } from '../queries/customer/useCart';
import { useAuthStore } from '../stores/useAuthStore';
import { shallow } from 'zustand/shallow';

export const useCartActions = () => {
  const { mutate } = useSWRConfig();
  const { profile, isLoggedIn } = useAuthStore(
    (state) => ({
      profile: state.profile,
      isLoggedIn: state.isLoggedIn,
    }),
    shallow,
  );
  const { push } = useRouter();

  const checkIsLogged = (): boolean => {
    return Boolean(isLoggedIn);
  };

  const checkIsCustomer = () => {
    return profile?.role === USER_ROLES.USER;
  };

  const goToCart = () => {
    push(routes.CART.INDEX);
  };

  // if the user is logged, it will save the product in the sever, if no, then in localStorage
  const addToCart = async (product: Product, quantity = 1) => {
    if (!checkIsLogged()) {
      const oldItems = getStorageItem(StorageKeys.CART) || [];
      setStorageItem(StorageKeys.CART, [
        ...oldItems,
        {
          product_id: product.id,
          quantity,
          product,
          id: Math.random(),
          selected: true,
        },
      ]);

      mutate(getUseCartMutateKey);
      goToCart();
      return;
    } else if (!checkIsCustomer()) {
      return;
    }

    await addToCartAPI(product.id, quantity);
    mutate(getUseCartMutateKey);
    goToCart();
  };

  // if the user is logged, it will delete the product from the sever, if no, then from localStorage
  const removeFromCart = async (productId: number) => {
    if (!checkIsLogged()) {
      const oldItems = getStorageItem(StorageKeys.CART) || [];
      const newItems = oldItems.filter(
        (item: CartItem) => item.product_id !== productId,
      );

      setStorageItem(StorageKeys.CART, newItems);

      mutate(getUseCartMutateKey);
      return;
    } else if (!checkIsCustomer()) {
      return;
    }

    mutate(getUseCartMutateKey, removeFromCartAPI(productId), {
      optimisticData: (current: Cart) => {
        return current?.filter((item) => item.product_id !== productId);
      },
      rollbackOnError: true,
      populateCache: false,
    });
  };

  // This only works for the local storage
  const removeManyFromCart = async (productIds: number[]) => {
    if (checkIsLogged()) {
      return;
    }

    const oldItems = getStorageItem(StorageKeys.CART) || [];
    const newItems = oldItems.filter(
      (item: CartItem) => !productIds.includes(item.product_id),
    );

    setStorageItem(StorageKeys.CART, newItems);

    mutate(getUseCartMutateKey);
    return;
  };

  const updateItem = async (
    productId: number,
    data: {
      quantity?: number;
      selected?: boolean;
    },
  ) => {
    if (!checkIsLogged()) {
      const oldItems = getStorageItem(StorageKeys.CART) || [];
      const newItems = oldItems.map((item) => {
        if (item.product_id !== productId) {
          return item;
        }
        return {
          ...item,
          quantity: data.quantity ?? item.quantity,
        };
      });

      setStorageItem(StorageKeys.CART, newItems);

      mutate(getUseCartMutateKey);
      return;
    } else if (!checkIsCustomer()) {
      return;
    }

    mutate(
      getUseCartMutateKey,
      updateCartItem(productId, {
        quantity: data.quantity,
        selected: data.selected,
      }),
      {
        optimisticData: (current: Cart) => {
          return current?.map((item) => {
            if (item.product_id !== productId) {
              return item;
            }
            return {
              ...item,
              quantity: data.quantity ?? item.quantity,
              selected: data.selected ?? item.selected,
            };
          });
        },
        rollbackOnError: true,
        populateCache: false,
      },
    );
  };

  const updateItems = async (
    items: {
      productId: number;
      data: {
        quantity?: number;
        selected?: boolean;
      };
    }[],
  ) => {
    if (!checkIsLogged()) {
      const oldItems = getStorageItem(StorageKeys.CART) || [];
      const newItems = oldItems.map((item) => {
        const data = items.find((p) => p.productId === item.product_id)?.data;
        if (!data) {
          return item;
        }

        return {
          ...item,
          quantity: data.quantity ?? item.quantity,
          selected: data.selected ?? item.selected,
        };
      });

      setStorageItem(StorageKeys.CART, newItems);

      mutate(getUseCartMutateKey);
      return;
    } else if (!checkIsCustomer()) {
      return;
    }

    mutate(
      getUseCartMutateKey,
      () => Promise.all(items.map((i) => updateCartItem(i.productId, i.data))),
      {
        optimisticData: (current: Cart) => {
          return current?.map((item) => {
            const data = items.find((p) => p.productId === item.product_id)
              ?.data;
            if (!data) {
              return item;
            }
            const newData = {
              ...item,
              quantity: data.quantity ?? item.quantity,
              selected: data.selected ?? item.selected,
            };

            return newData;
          });
        },
        rollbackOnError: true,
        populateCache: false,
      },
    );
  };

  return {
    addToCart,
    removeFromCart,
    removeManyFromCart,
    updateItem,
    updateItems,
  };
};
