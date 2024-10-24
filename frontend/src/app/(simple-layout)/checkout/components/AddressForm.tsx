import ControlledCountrySelector from '@/components/hookForm/ControlledCountrySelector';
import ControlledFormInput from '@/components/hookForm/ControlledFormInput';
import { ControlledNumber } from '@/components/hookForm/ControlledNumber';
import ControlledStateSelector from '@/components/hookForm/ControlledStateSelector';
import useCountries from '@/hooks/queries/useCountries';
import { CheckoutForm } from '../form';
import { Grid } from '@mui/material';
import React, { useMemo } from 'react';
import { FieldPath, useFormContext, useWatch } from 'react-hook-form';
import { Country } from 'react-phone-number-input';
import { getCountryFromList } from '@/utils/countries';

const AddressForm = ({ prefix }: { prefix: FieldPath<CheckoutForm> }) => {
  const { control } = useFormContext();
  const country = useWatch({
    name: `${prefix}.country`,
    control,
  });
  const { countries } = useCountries();

  const foundCountry = useMemo(
    () => getCountryFromList(countries ?? [], country),
    [country, countries],
  );

  return (
    <Grid container spacing={2}>
      <Grid item xs={12}>
        <ControlledCountrySelector
          id={`${prefix}.country`}
          name={`${prefix}.country`}
          control={control}
          label="Country"
          placeholder="Country"
        />
      </Grid>
      <Grid container item spacing={3.8} direction={'row'}>
        <Grid item md={6} xs={12}>
          <ControlledFormInput
            id={`${prefix}.firstName`}
            name={`${prefix}.firstName`}
            control={control}
            label="First Name"
            placeholder="Your first name"
            InputProps={{
              autoComplete: 'given-name',
            }}
          />
        </Grid>
        <Grid item md={6} xs={12}>
          <ControlledFormInput
            id={`${prefix}.lastName`}
            name={`${prefix}.lastName`}
            control={control}
            label="Last Name"
            placeholder="Your Last Name"
            InputProps={{
              autoComplete: 'family-name',
            }}
          />
        </Grid>
      </Grid>

      <Grid container item spacing={3.8} direction={'row'}>
        <Grid item lg={8} xs={12}>
          <ControlledFormInput
            id={`${prefix}.addressOne`}
            name={`${prefix}.addressOne`}
            control={control}
            label="Address"
            placeholder="Your Address"
            InputProps={{
              autoComplete: 'street-address',
            }}
          />
        </Grid>
        <Grid item lg={4} xs={12}>
          <ControlledFormInput
            id={`${prefix}.addressTwo`}
            name={`${prefix}.addressTwo`}
            control={control}
            label="Apartment (Optional)"
            placeholder="Your apartment"
          />
        </Grid>
      </Grid>

      <Grid container item spacing={3.8} direction={'row'}>
        <Grid item md={6} lg={4} xs={12}>
          <ControlledFormInput
            id={`${prefix}.city`}
            name={`${prefix}.city`}
            control={control}
            label="City"
            placeholder="Your City"
          />
        </Grid>
        <Grid item md={6} lg={4} xs={12}>
          <ControlledStateSelector
            id={`${prefix}.state`}
            name={`${prefix}.state`}
            control={control}
            label="State"
            placeholder="State"
            countryId={foundCountry?.id ?? null}
          />
        </Grid>
        <Grid item md={12} lg={4} xs={12}>
          <ControlledFormInput
            name={`${prefix}.zipCode`}
            id={`${prefix}.zipCode`}
            control={control}
            label="Zip Code"
            placeholder="Your zip code"
            InputProps={{
              autoComplete: 'postal-code',
            }}
          />
        </Grid>
      </Grid>

      <Grid item md={12} xs={12}>
        <ControlledNumber
          id={`${prefix}.phone`}
          name={`${prefix}.phone`}
          control={control}
          label="Phone Number"
          placeholder="409 757 5013"
          country={(foundCountry?.iso2 as Country) ?? 'US'}
          international
        />
      </Grid>
    </Grid>
  );
};

export default AddressForm;
