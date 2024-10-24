import { getCookie } from 'cookies-next';
import dayjs from 'dayjs';
import type { Country } from 'react-phone-number-input';

export const cookiesKeys = {
  TOKEN: 'token',
  USER_PREFERENCIES: 'user-prefs',
};

export interface UserPreferenciesCookie {
  country_code: Country;
  currency_code: string;
}

// cookies-next doesn't return any OptionsType but this way I can get the type from the function
type OptionsType = NonNullable<Parameters<typeof getCookie>['1']>;

export const getCookieExpiration = (key: keyof typeof cookiesKeys): Date => {
  const SIX_MONTHS: Date = dayjs().add(6, 'month').toDate();
  const ONE_MONTH: Date = dayjs().add(1, 'month').toDate();

  switch (key) {
    case 'TOKEN':
      return SIX_MONTHS;
    case 'USER_PREFERENCIES':
      return ONE_MONTH;
  }
};

export const getUserPreferencies = (
  options?: OptionsType,
): UserPreferenciesCookie | null => {
  const data = getCookie(cookiesKeys.USER_PREFERENCIES, options);

  return data ? (JSON.parse(data as string) as UserPreferenciesCookie) : null;
};
