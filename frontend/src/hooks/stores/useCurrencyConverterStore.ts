import { Rates } from '@/types/exchange-rate';
import { Cashify } from 'cashify';
import { mapKeys } from 'lodash';
import { create } from 'zustand';

const upperRateKeys = (rates: Rates) =>
  mapKeys(rates, (_, key) => key.toUpperCase());

export const BASE_CURRENCY = 'USD';

export const createCurrencyConverter = (rates: Rates) => {
  const myBase = BASE_CURRENCY.toUpperCase();
  const myRates = upperRateKeys(rates);

  const instance = new Cashify({ base: myBase, rates: myRates });

  return function converter(
    amount: number,
    { from, to }: { from: string | null; to: string | null },
  ) {
    const myFrom = from?.toUpperCase();
    const myTo = to?.toUpperCase();

    if (Object.keys(myRates).length === 0) return amount;

    return instance.convert(amount, {
      from: myFrom || BASE_CURRENCY,
      to: myTo || BASE_CURRENCY, // without assigning default value, it will throw error
    });
  };
};

interface State {
  base: string;
  rates: Rates | null;
  converter: ReturnType<typeof createCurrencyConverter>;
}

interface Actions {
  initialize: (rates: Rates | null) => void;
}

export const useCurrencyConverterStore = create<State & Actions>((set) => ({
  base: BASE_CURRENCY,
  rates: null,
  converter: createCurrencyConverter({}),

  initialize: (rates) => {
    const result = createCurrencyConverter(rates || {});

    set({
      rates,
      converter: result,
    });
  },
}));

export const useCurrencyConverter = () =>
  useCurrencyConverterStore((state) => state.converter);
