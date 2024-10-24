import MainLayout from '@/layouts/MainLayout';
import { Providers } from '@/components/Providers';
import { getCategories } from '@/services/API/categories';
import { CATEGORIES, EXCHANGE_RATES } from '@/constants/api';
import { getProfile } from '@/services/API/auth/profile';
import 'yet-another-react-lightbox/styles.css';
import 'yet-another-react-lightbox/plugins/thumbnails.css';
import 'yet-another-react-lightbox/plugins/captions.css';
import { WebSocketHandler } from '@/components/websocket/WebSocketHandler';
import { getExchangeRates } from '@/services/API/exchange-rates';
import { getLayoutBasicData } from '@/utils/layout';

export default async function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { token, deviceType, userPreferencies, currencyBase } =
    getLayoutBasicData();

  const [profile, categories, exchangeRates] = await Promise.allSettled([
    token ? getProfile(token) : Promise.resolve(null),
    getCategories(),
    getExchangeRates(currencyBase),
  ]);

  return (
    <Providers
      deviceType={deviceType}
      options={{
        swrProps: {
          fallback: {
            [CATEGORIES.LIST]:
              categories.status === 'fulfilled' ? categories?.value : [],
            [EXCHANGE_RATES.RATES('USD')]:
              exchangeRates.status === 'fulfilled'
                ? exchangeRates?.value
                : null,
          },
        },
        authProps: {
          token: token ?? null,
          profile: profile?.status === 'fulfilled' ? profile?.value : null,
        },
        preferencesProps: {
          country_code: userPreferencies?.country_code ?? null,
          currency_code: userPreferencies?.currency_code ?? null,
        },
        ...(exchangeRates.status === 'fulfilled' && {
          currencyConverterProps: {
            rates: exchangeRates.value.rates,
          },
        }),
      }}
    >
      <MainLayout>
        {children}
        <WebSocketHandler />
      </MainLayout>
    </Providers>
  );
}
