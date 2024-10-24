import { Country } from 'react-phone-number-input';
import { create } from 'zustand';

interface State {
  shippingCountry: Country | null;
  currency: string | null;
}

interface Actions {
  setShippingCountry: (country: Country) => void;
  setCurrency: (currency: string) => void;
}

const defaultState: State = {
  shippingCountry: null,
  currency: null,
};

export const useUserPreferencesStore = create<State & Actions>((set) => ({
  ...defaultState,
  setCurrency: (currency) => {
    return set({
      currency,
    });
  },
  setShippingCountry: (country) => {
    return set({
      shippingCountry: country,
    });
  },
}));

export const useActualCurrency = () =>
  useUserPreferencesStore((state) => state.currency);
