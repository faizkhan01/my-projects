import { useMemo } from 'react';
import type { Product, ProductWithQuantity } from '@/types/products';
import type { CartItem } from '@/types/cart';
import { calculatePrice, formatPrice } from '@/utils/currency';

export const usePriceCalculator = <
  T extends
    | {
        price: number;
        discount: number;
        quantity?: number;
      }
    | {
        product: Pick<Product, 'price' | 'discount' | 'shipsTo'>;
        quantity: number;
      },
>(
  products: T[],
  options: {
    currency?: string;
    exchangeRate?: number;
  } = {
    currency: 'USD',
    exchangeRate: 1,
  },
) => {
  const { price, discount } = useMemo(() => {
    let price = 0;
    let discount = 0;
    const rate = options?.exchangeRate || 1;

    products.forEach((item: Record<string, unknown>) => {
      if (!item?.product && !item?.quantity) {
        const product = item as unknown as Product;
        const prices = calculatePrice({
          price: product.price,
          exchangeRate: rate,
          discount: product.discount,
        });

        price += prices.subtotal;
        discount += prices.discounted;
      } else if (!item?.product) {
        const product = item as unknown as ProductWithQuantity;
        const prices = calculatePrice({
          price: product.price,
          exchangeRate: rate,
          discount: product.discount,
          quantity: product.quantity,
        });

        price += prices.subtotal;
        discount += prices.discounted;
      } else if (item?.product && item?.quantity) {
        const cartItem = item as unknown as CartItem;

        const prices = calculatePrice({
          price: cartItem.product.price,
          exchangeRate: rate,
          discount: cartItem.product.discount,
          quantity: cartItem.quantity,
        });

        price += prices.subtotal;
        discount += prices.discounted;
      }
    });

    return { price, discount };
  }, [options?.exchangeRate, products]);

  const total = price - discount;
  const isFree = price === 0;

  const priceFormatted = formatPrice(price, { currency: options?.currency });
  const discountFormatted = formatPrice(discount, {
    currency: options?.currency,
  });
  const totalFormatted = formatPrice(total, { currency: options?.currency });

  return {
    price,
    discount,
    total,
    priceFormatted,
    discountFormatted,
    totalFormatted,
    isFree,
  };
};
