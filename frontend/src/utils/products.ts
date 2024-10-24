import { CartDeliveryTime } from '@/types/cart';
import { Product, ProductShipsTo } from '@/types/products';
import dayjs from 'dayjs';

export const isProductFreeShipping = (
  shippingCountry: string | null,
  item: Product,
): boolean => {
  if (!shippingCountry) return false;

  const found = getProductShipsTo(shippingCountry, item);

  return found?.price === 0;
};

export const getProductShipsTo = (
  country: string | null,
  item: Product,
): ProductShipsTo | undefined => {
  if (!country) return;

  return (
    item.shipsTo?.find((t) => t.iso2 == country || t.iso3 == country) ??
    item.shipsTo?.find((t) => t.everywhere)
  );
};

export const getProductDeliveryText = (
  deliveryTime: CartDeliveryTime | null,
): {
  text: string;
  canDeliver: boolean;
} => {
  if (deliveryTime?.deleted) {
    return {
      text: 'This product is no longer available for delivery.',
      canDeliver: false,
    };
  }

  if (deliveryTime?.outOfStock) {
    return {
      text: 'This product is out of stock.',
      canDeliver: false,
    };
  }

  if (deliveryTime?.canDeliver === false) {
    return {
      text: "This product can't be delivered to your location.",
      canDeliver: false,
    };
  }

  if (deliveryTime?.canDeliver === true) {
    let text = `${
      deliveryTime.minDays !== undefined
        ? dayjs().add(deliveryTime.minDays, 'day').format('MMMM D')
        : ''
    }`;
    if (
      deliveryTime.minDays !== undefined &&
      deliveryTime.maxDays !== undefined
    ) {
      text += ' - ';
    }
    text += `${
      deliveryTime.maxDays !== undefined
        ? dayjs().add(deliveryTime.maxDays, 'day').format('MMMM D')
        : ''
    }`;
    return {
      text,
      canDeliver: true,
    };
  }

  return {
    text: '',
    canDeliver: false,
  };
};
