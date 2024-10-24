import routes from './routes';

export const blockedRoutes = {
  unverifiedSeller: [
    routes.SELLER_DASHBOARD.ORDERS.LIST,
    routes.SELLER_DASHBOARD.REFUND_RETURN,
    routes.SELLER_DASHBOARD.TRANSACTIONS,
    routes.SELLER_DASHBOARD.PRODUCTS.LIST,
    routes.SELLER_DASHBOARD.CUSTOMERS,
    routes.SELLER_DASHBOARD.SHIPPING.INDEX,
    routes.SELLER_DASHBOARD.MESSAGES,
  ],
};
