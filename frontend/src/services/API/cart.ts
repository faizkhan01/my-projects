import { CUSTOMER } from '@/constants/api';
import { axiosAPI } from '@/lib/axios';
import { AxiosResponse } from 'axios';
import type { Cart, CartDeliveryTime, CartItem } from '@/types/cart';
import { CookieValueTypes } from 'cookies-next';

interface CartResponse extends AxiosResponse {
  data: Cart;
}

interface AddToCartResponse extends AxiosResponse {
  data: {
    message: string;
    statusCode: number;
    data: CartItem;
  };
}

type UpdateCartItemResponse = AddToCartResponse;

interface RemoveFromCartResponse extends AxiosResponse {
  data: {
    message: string;
    statusCode: number;
  };
}

interface GetCartPricePrices {
  subtotal: number;
  shipping: number;
  total: number;
  tax: number;
  discounted: number;
}

interface GetCartPriceResponse {
  items: {
    id: number;
    prices: GetCartPricePrices;
  }[];
  prices: GetCartPricePrices;
}

type GetCartDeliveryTimeResponse = CartDeliveryTime[];

export const getCart = async ({
  token,
  selected = false,
}: {
  token?: CookieValueTypes;
  selected?: boolean;
}) => {
  const response: CartResponse = await axiosAPI.get(CUSTOMER.CART.LIST, {
    params: {
      selected,
    },
    headers: token
      ? {
          Authorization: `Bearer ${token}`,
        }
      : {},
  });
  return response.data;
};

export const addToCart = async (productId: number, quantity = 1) => {
  const response: AddToCartResponse = await axiosAPI.post(
    CUSTOMER.CART.ADD(productId),
    {
      quantity,
    },
  );

  return response.data;
};

export const removeFromCart = async (productId: number) => {
  const response: RemoveFromCartResponse = await axiosAPI.delete(
    CUSTOMER.CART.REMOVE(productId),
  );

  return response.data;
};

export const updateCartItem = async (
  productId: number,
  data: { quantity?: number; selected?: boolean },
) => {
  const response: UpdateCartItemResponse = await axiosAPI.put(
    CUSTOMER.CART.UPDATE(productId),
    {
      quantity: data.quantity,
      selected: data.selected,
    },
  );

  return response.data;
};

export const getCartPrice = async (data: {
  products: { id: number; quantity: number }[];
  country?: string;
  currency?: string;
}) => {
  const res = await axiosAPI.post<GetCartPriceResponse>(
    CUSTOMER.CART.PRICE,
    data,
  );

  return res.data;
};

export const getCartDeliveryTime = async (data: {
  productIds: number[];
  country?: string;
}) => {
  const res = await axiosAPI.post<GetCartDeliveryTimeResponse>(
    CUSTOMER.CART.DELIVERY_TIME,
    data,
  );

  return res.data;
};
