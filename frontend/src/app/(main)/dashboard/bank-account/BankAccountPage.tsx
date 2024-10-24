import { SellerDashboardLayout } from '@/layouts/SellerDashboardLayout';
import SellerBankAccount from '@/components/sellerDashboard/BankAccount';
import { ProfileData } from '@/types/user';
import { STRIPE_EURO_COUNTRIES, StripeCountryCodes } from '@/constants/stripe';
import {
  ALL_WORLD_CURRENCIES_WITH_CODES,
  CurrencyCode,
} from '@/constants/world-currencies';
import { BankInfo } from '@/types/bank';

// NOTE: https://stripe.com/docs/connect/bank-debit-card-payouts
const stripeCountriesWithAvailableBankOptions = STRIPE_EURO_COUNTRIES.reduce(
  (a, c) => {
    // All euro countries accept other euro countries
    // with eur
    a[c] = STRIPE_EURO_COUNTRIES.reduce(
      (a, c) => {
        a[c] = [ALL_WORLD_CURRENCIES_WITH_CODES.EUR];
        return a;
      },
      {} as Record<StripeCountryCodes, CurrencyCode[]>,
    );

    // first try was with a push but was causing undefined
    a[c].LI = [...(a[c].LI ?? []), ALL_WORLD_CURRENCIES_WITH_CODES.CHF];
    a[c].CH = [...(a[c].CH ?? []), ALL_WORLD_CURRENCIES_WITH_CODES.CHF];

    a[c].DK = [...(a[c].DK ?? []), ALL_WORLD_CURRENCIES_WITH_CODES.DKK];

    a[c].GB = [...(a[c].GB ?? []), ALL_WORLD_CURRENCIES_WITH_CODES.GBP];
    a[c].GI = [...(a[c].GI ?? []), ALL_WORLD_CURRENCIES_WITH_CODES.GBP];

    a[c].NO = [...(a[c].NO ?? []), ALL_WORLD_CURRENCIES_WITH_CODES.NOK];

    a[c].SE = [...(a[c].SE ?? []), ALL_WORLD_CURRENCIES_WITH_CODES.SEK];

    a[c].US = [...(a[c].US ?? []), ALL_WORLD_CURRENCIES_WITH_CODES.USD];

    if (c === 'BG') {
      a[c].BG = [...(a[c].BG ?? []), ALL_WORLD_CURRENCIES_WITH_CODES.BGN];
    }
    if (c === 'CZ') {
      a[c].CZ = [...(a[c].CZ ?? []), ALL_WORLD_CURRENCIES_WITH_CODES.CZK];
    }

    if (c === 'HU') {
      a[c].HU = [...(a[c].HU ?? []), ALL_WORLD_CURRENCIES_WITH_CODES.HUF];
    }
    if (c === 'PL') {
      a[c].PL = [...(a[c].PL ?? []), ALL_WORLD_CURRENCIES_WITH_CODES.PLN];
    }

    if (c === 'RO') {
      a[c].RO = [...(a[c].RO ?? []), ALL_WORLD_CURRENCIES_WITH_CODES.RON];
    }

    return a;
  },
  {} as Record<StripeCountryCodes, Record<StripeCountryCodes, CurrencyCode[]>>,
);

// No european countries accept other currencies
stripeCountriesWithAvailableBankOptions['US'] = {
  ...stripeCountriesWithAvailableBankOptions['US'],
  US: [ALL_WORLD_CURRENCIES_WITH_CODES.USD],
};
stripeCountriesWithAvailableBankOptions['CA'] = {
  ...stripeCountriesWithAvailableBankOptions['CA'],
  US: [ALL_WORLD_CURRENCIES_WITH_CODES.USD],
  CA: [
    ALL_WORLD_CURRENCIES_WITH_CODES.CAD,
    ALL_WORLD_CURRENCIES_WITH_CODES.USD,
  ],
};
stripeCountriesWithAvailableBankOptions['NZ'] = {
  ...stripeCountriesWithAvailableBankOptions['NZ'],
  NZ: [ALL_WORLD_CURRENCIES_WITH_CODES.NZD],
};
stripeCountriesWithAvailableBankOptions['AU'] = {
  ...stripeCountriesWithAvailableBankOptions['AU'],
  AU: [ALL_WORLD_CURRENCIES_WITH_CODES.AUD],
};
stripeCountriesWithAvailableBankOptions['SG'] = {
  ...stripeCountriesWithAvailableBankOptions['SG'],
  SG: [ALL_WORLD_CURRENCIES_WITH_CODES.SGD],
};

const BankAccount = ({
  bankInfo,
  profile,
}: {
  bankInfo: BankInfo[];
  profile: ProfileData;
}) => {
  const title = 'Bank Account';
  const options = profile?.store?.country?.iso2
    ? stripeCountriesWithAvailableBankOptions[
        profile.store.country.iso2 as StripeCountryCodes
      ]
    : null;

  const defaultForProfile = bankInfo.find((b) =>
    Boolean(b.profile_default_for_currency),
  );
  const noDefaultForProfile = bankInfo.filter(
    (b) => !b.profile_default_for_currency,
  );

  noDefaultForProfile?.sort((a, b) => {
    if (a.default_for_currency) return -1;
    if (b.default_for_currency) return 1;
    return 0;
  });

  let sortedBanks: BankInfo[] = [];

  if (defaultForProfile) sortedBanks.push(defaultForProfile);
  sortedBanks = sortedBanks.concat(noDefaultForProfile);

  return (
    <SellerDashboardLayout title={title}>
      <SellerBankAccount
        bankInfo={sortedBanks}
        currenciesAndCountryOptions={options}
      />
    </SellerDashboardLayout>
  );
};

export default BankAccount;
