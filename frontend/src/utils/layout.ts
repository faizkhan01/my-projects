import parser from 'ua-parser-js';
import { cookiesKeys, UserPreferenciesCookie } from '@/lib/cookies';
import { DeviceType } from '@/types/device-type';
import { cookies, headers } from 'next/headers';
import { BASE_CURRENCY } from '@/hooks/stores/useCurrencyConverterStore';

export const getLayoutBasicData = () => {
  const store = cookies();
  const token = store.get(cookiesKeys.TOKEN)?.value;
  const userPreferenciesCookie = store.get(cookiesKeys.USER_PREFERENCIES)
    ?.value;
  const userPreferencies = userPreferenciesCookie
    ? (JSON.parse(userPreferenciesCookie) as UserPreferenciesCookie)
    : null;

  const userAgent = headers().get('user-agent');
  const deviceType: DeviceType =
    (parser(userAgent ?? undefined).device.type as DeviceType | undefined) ||
    'desktop';

  const currencyBase = BASE_CURRENCY;

  return {
    currencyBase,
    deviceType,
    userPreferencies,
    token,
  };
};
