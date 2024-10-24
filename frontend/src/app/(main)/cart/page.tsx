import { cookies } from 'next/headers';
import CartPage from './CartPage';
import { cookiesKeys } from '@/lib/cookies';
import { getCart } from '@/services/API/cart';
import { getWishlist } from '@/services/API/wishlist';

export const metadata = {
  title: 'Shopping Cart',
};

const Cart = async () => {
  const token = cookies().get(cookiesKeys.TOKEN)?.value;

  if (!token) {
    <CartPage />;
  }

  const [cart, wishlist] = await Promise.allSettled([
    getCart({ token }),
    getWishlist(token),
  ]);

  return (
    <CartPage
      cart={cart.status === 'fulfilled' ? cart.value : undefined}
      wishlist={wishlist.status === 'fulfilled' ? wishlist.value : undefined}
    />
  );
};

export default Cart;
