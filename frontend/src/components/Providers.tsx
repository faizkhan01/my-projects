'use client';
import { loadStripe } from '@stripe/stripe-js';
import ThemeRegistry from './Theme/ThemeRegistry';
import { Elements } from '@stripe/react-stripe-js';
import { SWRConfig, SWRConfiguration } from 'swr';
import swrConfiguration from '@/lib/swr/config';
import { useAuthStore } from '@/hooks/stores/useAuthStore';
import { useUserPreferencesStore } from '@/hooks/stores/useUserPreferencesStore';
import { ProfileData } from '@/types/user';
import { theme as defaultTheme } from '@/lib/theme';
import mediaQuery from 'css-mediaquery';
import { Theme, createTheme } from '@mui/material/styles';
import { DeviceType } from '@/types/device-type';
import AuthModal from './modals/auth/AuthModal';
import GlobalSnackbar from './globalSnackbar/GlobalSnackbar';
import type { Country } from 'react-phone-number-input';
import { useCurrencyConverterStore } from '@/hooks/stores/useCurrencyConverterStore';

const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY,
);

export const Providers = ({
  children,
  options,
  deviceType,
}: {
  children: React.ReactNode;
  deviceType?: DeviceType;
  options?: {
    swrProps?: SWRConfiguration;
    authProps?: {
      token: string | null;
      profile: ProfileData | null;
    };
    preferencesProps?: {
      country_code: Country | null;
      currency_code: string | null;
    };
    currencyConverterProps?: {
      rates: Record<string, number>;
    };
  };
}) => {
  if (options?.authProps) {
    useAuthStore
      .getState()
      .setAuth(options?.authProps.token, options?.authProps.profile);
  }

  const prefState = useUserPreferencesStore.getState();
  if (options?.preferencesProps?.country_code) {
    prefState.setShippingCountry(options?.preferencesProps?.country_code);
  }
  if (options?.preferencesProps?.currency_code) {
    prefState.setCurrency(options?.preferencesProps?.currency_code);
  }

  if (options?.currencyConverterProps) {
    useCurrencyConverterStore
      .getState()
      .initialize(options?.currencyConverterProps.rates);
  }

  const theme = createTheme({
    ...defaultTheme,
    components: {
      ...defaultTheme.components,
      MuiUseMediaQuery: {
        defaultProps: {
          ssrMatchMedia: (query) => ({
            matches: mediaQuery.match(query, {
              // The estimated CSS width of the browser.
              width: deviceType === 'mobile' ? '0px' : '1024px',
            }),
          }),
        },
      },
    },
  });

  return (
    <ThemeProvider theme={theme}>
      <SWRProvider
        options={{
          ...swrConfiguration,
          ...options?.swrProps,
        }}
      >
        <Elements stripe={stripePromise}>
          {children}
          <AuthModal />
          <GlobalSnackbar />
        </Elements>
      </SWRProvider>
    </ThemeProvider>
  );
};

export const ThemeProvider = ({
  children,
  theme,
}: {
  children: React.ReactNode;
  theme?: Theme;
}) => {
  return (
    <ThemeRegistry theme={theme ?? defaultTheme}>{children}</ThemeRegistry>
  );
};

export const SWRProvider = ({
  options,
  children,
}: {
  options: SWRConfiguration;
  children: React.ReactNode;
}) => {
  return <SWRConfig value={options}>{children}</SWRConfig>;
};
