import { stringify } from 'querystring';

export const COUNTRIES = {
  LIST: '/countries',
  LIST_ONLY_SELLERS: '/countries/sellers',
  STATES: (id: number) => `/countries/${id}/states`,
};

export const EXCHANGE_RATES = {
  RATES: (currency: string) => `/exchange-rates?currency=${currency}`,
};

export const AUTH = {
  RESET_PASSWORD: '/auth/forget-password',
  RESET_PASSWORD_CONFIRM: '/auth/forget-password/confirm',
  CONFIRM_REGISTRATION: '/auth/register/confirm',
  CONFIRM_EMAIL: '/auth/update-email/confirm',
  PROFILE: '/auth/profile',
  REGISTER: '/auth/register',
  LOGIN: '/auth/login',
};

export const BLOG = {
  POSTS: {
    LIST: '/blog/posts',
    ONE: (idOrSlug: number | string) => `/blog/posts/${idOrSlug}`,
  },
  CATEGORIES: {
    LIST: '/blog/categories',
  },
};

export const CATEGORIES = {
  LIST: '/categories',
};

export const CUSTOMER = {
  SETTINGS: '/users/customers/settings',
  SHIPPING_ADDRESS: '/addresses/customers/shipping',
  BILLING_ADDRESSES: '/addresses/customers/billing',
  ORDER_ITEMS: {
    ACTIONS: (orderItemId: number) =>
      `/users/customers/order-items/${orderItemId}/actions`,
  },
  WISHLIST: '/users/customers/wishlists',
  CART: {
    LIST: '/users/customers/cart',
    ADD: (productId: number) => `/users/customers/cart/${productId}`,
    REMOVE: (productId: number) => `/users/customers/cart/${productId}`,
    UPDATE: (productId: number) => `/users/customers/cart/${productId}`,
    PRICE: '/users/customers/cart/price',
    DELIVERY_TIME: '/users/customers/cart/delivery',
  },
  VIEWED_PRODUCTS: '/users/customers/cart',
  CARDS: '/users/customers/cards',
  FOLLOWING: '/users/customers/following',
};

export const STORES = {
  VALIDATE_STORE_NAME: '/stores/validate',
  STORES: '/stores',
  PATHS: '/stores/slugs',
};

export const ORDERS = {
  FULFILL: (orderId: number) => `/orders/${orderId}/fulfill`,
  INVOICE: (orderId: number) => `/orders/${orderId}/invoice`,
};

export const SELLER = {
  SETTINGS: '/users/sellers/settings',
  ONBOARDING: '/users/sellers/onboarding',
  REQUIREMENTS: '/users/sellers/requirements',
  CLOSE_STORE: '/users/sellers/close-store',
  BANK_ACCOUNT: {
    LIST: `/users/sellers/bank-account`,
    CREATE: '/users/sellers/bank-account',
    UPDATE: (id: string) => `/users/sellers/bank-account/${id}`,
    DELETE: (id: string) => `/users/sellers/bank-account/${id}`,
  },
  SHIPPING_PROFILES: {
    LIST: '/shipping-profiles',
    ONE: (id: number) => `/shipping-profiles/${id}`,
    CREATE: '/shipping-profiles',
  },
  PRODUCTS: {
    LIST: '/users/sellers/products',
    ONE: (id: number) => `/users/sellers/products/${id}`,
  },
};

export const PRODUCTS = {
  LIST: '/products',
  RATING: (id: number) => `/products/${id}/rating`,
  ONE: (id: number) => `/products/${id}`,
  REVIEWS: (id: number) => `/products/${id}/reviews`,
  SIMILARS: (id: number) => `/products/${id}/similars`,
};

export const CHATS = {
  LIST: '/chats',
  MESSAGES: (chatId: number, paginate: { offset: number; limit: number }) =>
    `/chats/${chatId}/messages?${new URLSearchParams([
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      ...(Object.entries(paginate) as any),
    ])}`,
};

export const PROMOTIONS = {
  LIST: '/promotions',
  ONE: (id: number) => `/promotions/${id}`,
};

export const SEARCH_HISTORY = {
  LIST: ({ limit }: { limit?: number }) => {
    return `/search-history?${stringify({
      limit,
    })}`;
  },
  CREATE: '/search-history',
};

export const ADDRESSES_CRUD_TYPES = {
  GET: {
    shipping: CUSTOMER.SHIPPING_ADDRESS,
    billing: CUSTOMER.BILLING_ADDRESSES,
  },
  PUT: {
    shipping: CUSTOMER.SHIPPING_ADDRESS,
    billing: CUSTOMER.BILLING_ADDRESSES,
  },
  POST: {
    shipping: CUSTOMER.SHIPPING_ADDRESS,
    billing: CUSTOMER.BILLING_ADDRESSES,
  },
};
