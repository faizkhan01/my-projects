import { GetProductsParams } from '@/services/API/products';

const routes = {
  INDEX: '/',
  BLOG: {
    INDEX: '/blog',
    INFO: (slug: string) => `/blog/${slug}`,
  },
  CATEGORIES: {
    INFO: (name: string) => `/categories/${encodeURIComponent(name)}`,
  },
  CATALOG: {
    INFO: (slug: string, id: number) => `/catalog/${slug}/${id}`,
  },
  SEARCH: {
    INDEX: (
      params: Partial<
        GetProductsParams & {
          section?: string;
        }
      >,
    ): string => {
      const allParams: Partial<
        GetProductsParams & {
          price_min?: number;
          price_max?: number;
        }
      > = params;

      // Replace price params with price_min and price_max
      delete allParams.price;
      if (params.price && Boolean(params.price.lte || params.price.gte)) {
        allParams.price_min = params.price.gte;
        allParams.price_max = params.price.lte;
      }

      return `/search?${new URLSearchParams([
        ...Object.entries(allParams),
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      ] as any).toString()}`;
    },
  },
  PROMOTIONS: {
    INFO: (slug: string, id: number) => `/promotions/${slug}/${id}`,
  },
  LOGOUT: {
    INDEX: '/logout',
  },
  CHECKOUT: {
    INDEX: '/checkout',
  },
  AUTH: {
    INDEX: '/auth',
    CONFIRM_REGISTER: '/auth/register/confirm',
    CONFIRM_EMAIL: '/auth/update-email',
    RESET_PASSWORD: '/auth/reset-password',
  },
  SELL: {
    INDEX: '/sell-with-only-latest',
  },
  HELP_CENTER: '/help',
  DASHBOARD: {
    INDEX: '/dashboard',
    EDIT_PROFILE: '/dashboard/edit-profile',
    MESSAGES: {
      LIST: '/dashboard/messages',
      ONE: (id: number) => `/dashboard/messages/${id}`,
    },
    SHIPPING: '/dashboard/shipping-addresses',
    BILLING: '/dashboard/billing-addresses',
    PAYMENT_METHODS: '/dashboard/payment-methods',
    REFUND_RETURN: '/dashboard/refund-return',
    CREATE_REFUND_RETURN: (id: number) => {
      return `${routes.DASHBOARD.REFUND_RETURN}/create/${id}`;
    },
    NOTIFICATIONS: '/dashboard/notifications',
    MY_ORDERS: '/dashboard/my-orders',
    NEWS_LETTERS: '/dashboard/news-letters',
    FOLLOWING: '/dashboard/following',
  },
  SELLER_DASHBOARD: {
    INDEX: '/dashboard',
    TRANSACTIONS: '/dashboard/transactions',
    NOTIFICATION: '/dashboard/notifications',
    MESSAGES: '/dashboard/messages',
    CUSTOMERS: '/dashboard/customers',
    PRODUCTS: {
      LIST: '/dashboard/products',
      NEW: '/dashboard/products/new',
      UPDATE: (id: number) => `/dashboard/products/update/${id}`,
    },
    ORDERS: {
      LIST: '/dashboard/orders',
      INFO: (id: number) => `/dashboard/orders/${id}`,
      FULFILL: (id: number) => `/dashboard/orders/${id}/fulfill`,
      INVOICE: (id: number, paymentMethodId: string) =>
        `/orders/${id}/invoice?paymentMethodId=${paymentMethodId}`,
    },
    REFUND_RETURN: '/dashboard/refund-return',
    DISCOUNTER: '/dashboard/discounter',
    SHIPPING: {
      INDEX: '/dashboard/shipping',
      METHODS: {
        INDEX: '/dashboard/shipping/methods',
        NEW: '/dashboard/shipping/methods/new',
        UPDATE: (id: number) => `/dashboard/shipping/methods/update/${id}`,
      },
    },
    PAYPAL: '/dashboard/paypal',
    BANK_ACCOUNT: '/dashboard/bank-account',
    SETTING: '/dashboard/setting',
    ONBOARDING: {
      REFRESH: '/dashboard/onboarding/refresh',
      SUCCESS: '/dashboard/onboarding/success',
    },
  },
  WISHLIST: {
    INDEX: '/wishlist',
  },
  RECENTLY_VIEWED: {
    INDEX: '/wishlist/#recently-viewed',
  },
  STORES: {
    INDEX: '/stores',
    INFO: (slug: string) => `/stores/${encodeURIComponent(slug)}`,
  },
  CART: {
    INDEX: '/cart',
  },
  PRODUCTS: {
    INFO: (slug: string, id: number) => `/product/${slug}/${id}`,
    REVIEW: (slug: string, id: number, orderItemId: number) =>
      `/product/${slug}/${id}/review?orderItem=${orderItemId}`,
    REVIEWS: (slug: string, id: number) => `/product/${slug}/${id}#reviews`,
  },
  PRIVACY_POLICY: '/privacy-policy',
};

export default routes;
