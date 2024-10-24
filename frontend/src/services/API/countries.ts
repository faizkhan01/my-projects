import { AxiosResponse } from 'axios';
import { axiosAPI } from '@/lib/axios';
import { type Country, CountryWithStates } from '@/types/countries';
import { COUNTRIES } from '@/constants/api';

export interface CountriesResponse extends AxiosResponse {
  data: Country[];
}

export const getCountries = async () => {
  const { data }: CountriesResponse = await axiosAPI.get(COUNTRIES.LIST);
  return data;
};

export const getSellerCountries = async () => {
  const { data }: CountriesResponse = await axiosAPI.get(
    COUNTRIES.LIST_ONLY_SELLERS,
  );
  return data;
};

export interface CountryWithStatesResponse extends AxiosResponse {
  data: CountryWithStates[];
}

export const getCountryStates = async (id: number) => {
  const { data }: CountryWithStatesResponse = await axiosAPI.get(
    COUNTRIES.STATES(id),
  );
  return data;
};
