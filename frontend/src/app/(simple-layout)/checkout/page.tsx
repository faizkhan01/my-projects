import React from 'react';
import NewCheckoutPage from './NewCheckout';
import { Providers } from '@/components/Providers';
import { getProfile } from '@/services/API/auth/profile';
import { getAddresses } from '@/services/API/addresses';
import { getCart } from '@/services/API/cart';
import { ADDRESS_TYPES_ENUM } from '@/types/address';
import { redirect } from 'next/navigation';
import routes from '@/constants/routes';
import { CUSTOMER, ADDRESSES_CRUD_TYPES } from '@/constants/api';
import { unstable_serialize } from 'swr';
import { USER_ROLES } from '@/constants/auth';
import { getLayoutBasicData } from '@/utils/layout';
import { getExchangeRates } from '@/services/API/exchange-rates';

export const metadata = {
  title: 'Checkout',
};

const NewCheckout = async () => {
  const {
    token: accessToken,
    deviceType,
    userPreferencies: userPrefs,
    currencyBase,
  } = getLayoutBasicData();

  const [profile, shipping, billing, cart, exchangeRates] =
    await Promise.allSettled([
      accessToken ? getProfile(accessToken) : null,
      accessToken ? getAddresses(ADDRESS_TYPES_ENUM.SHIPPING, accessToken) : [],
      accessToken ? getAddresses(ADDRESS_TYPES_ENUM.BILLING, accessToken) : [],
      accessToken ? getCart({ token: accessToken, selected: true }) : null,
      getExchangeRates(currencyBase),
    ]);

  if (
    cart.status === 'fulfilled' &&
    !cart.value?.length &&
    profile?.status === 'fulfilled' &&
    profile?.value
  ) {
    return redirect(routes.CART.INDEX);
  }

  if (
    profile.status === 'fulfilled' &&
    profile.value?.role === USER_ROLES.SELLER
  ) {
    return redirect(routes.SELLER_DASHBOARD.INDEX);
  }

  return (
    <Providers
      deviceType={deviceType}
      options={{
        authProps: {
          token: accessToken ?? null,
          profile: profile?.status === 'fulfilled' ? profile?.value : null,
        },
        swrProps: {
          fallback: {
            [ADDRESSES_CRUD_TYPES.GET[ADDRESS_TYPES_ENUM.SHIPPING]]:
              shipping.status === 'fulfilled' ? shipping.value : undefined,
            [ADDRESSES_CRUD_TYPES.GET[ADDRESS_TYPES_ENUM.BILLING]]:
              billing.status === 'fulfilled' ? billing.value : undefined,

            [unstable_serialize([CUSTOMER.CART.LIST, true])]:
              cart.status === 'fulfilled' && cart.value
                ? cart.value
                : undefined,
          },
        },
        preferencesProps: {
          country_code: userPrefs?.country_code ?? null,
          currency_code: userPrefs?.currency_code ?? null,
        },
        ...(exchangeRates.status === 'fulfilled' && {
          currencyConverterProps: {
            rates: exchangeRates.value.rates,
          },
        }),
      }}
    >
      <NewCheckoutPage />
    </Providers>
  );
};

export default NewCheckout;
