import { useEffect, useCallback, useMemo } from 'react';
import { useForm, SubmitHandler, useWatch } from 'react-hook-form';
import { Box } from '@mui/material';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { ContainedButton, OutlinedButton } from '@/ui-kit/buttons';
import { handleAxiosError } from '@/lib/axios';
import useGlobalSnackbar from '@/hooks/stores/useGlobalSnackbar';
import ControlledFormInput from '@/components/hookForm/ControlledFormInput';
import ControlledCountrySelector from '@/components/hookForm/ControlledCountrySelector';
import ControlledStateSelector from '@/components/hookForm/ControlledStateSelector';
import { ControlledNumber } from '@/components/hookForm/ControlledNumber';
import { AddressFormData } from '@/types/address';
import { postalCodeSchema } from '@/utils/yupValidations';
import useCountries from '@/hooks/queries/useCountries';
import { Country } from 'react-phone-number-input';
import { getCountryFromList } from '@/utils/countries';
import { phoneSchema } from '@/utils/yupValidations/phoneSchema';

const formSchema = yup.object().shape({
  firstName: yup.string().required('First Name is required'),
  lastName: yup.string().required('Last Name is required'),
  phone: phoneSchema,
  country: yup
    .number()
    .positive('Country is required')
    .required('Country is required'),
  state: yup
    .number()
    .positive('State is required')
    .required('State is required'),
  city: yup.string().required('City is required'),
  addressOne: yup.string().required('Address is required'),
  addressTwo: yup.string(),
  zipCode: postalCodeSchema.required('Invalid postal code'),
});

interface Props {
  closeModal: () => void;
  loading: boolean;
  defaultValues?: AddressFormData;
  customHandleSubmit: (data: AddressFormData) => Promise<{
    message: string;
  }>;
}

const createDefaultValues: AddressFormData = {
  country: -1,
  firstName: '',
  lastName: '',
  phone: '',
  state: -1,
  city: '',
  addressOne: '',
  addressTwo: '',
  zipCode: '',
};

const AddressModalForm = ({
  closeModal,
  customHandleSubmit,
  loading,
  defaultValues,
}: Props) => {
  const { control, handleSubmit, setValue } = useForm<AddressFormData>({
    defaultValues: defaultValues ? defaultValues : createDefaultValues,
    mode: 'onSubmit',
    resolver: yupResolver(formSchema),
  });

  const country = useWatch({
    name: 'country',
    control,
  });

  const { countries } = useCountries();
  const foundCountry = useMemo(
    () => getCountryFromList(countries ?? [], country),
    [country, countries],
  );

  const resetStateValue = useCallback(() => setValue('state', -1), [setValue]);
  const openSnack = useGlobalSnackbar((state) => state.open);

  const onSubmit: SubmitHandler<AddressFormData> = async (data) => {
    try {
      const response = await customHandleSubmit(data);
      openSnack({
        severity: 'success',
        message: response.message,
      });
      resetStateValue();
    } catch (error) {
      handleAxiosError(error);
    }
  };

  useEffect(() => {
    if (defaultValues?.country !== country) resetStateValue();
  }, [country, resetStateValue, defaultValues?.country]);

  return (
    <Box
      component="form"
      sx={{
        display: 'grid',
        gap: '24px 0px',
      }}
      onSubmit={handleSubmit(onSubmit)}
    >
      <ControlledCountrySelector
        id="country"
        name="country"
        control={control}
        label="Country"
        placeholder="Select a country"
      />
      <Box
        sx={{
          display: 'flex',
          flexDirection: { xs: 'column', md: 'row' },
          gap: '24px',
        }}
      >
        <ControlledFormInput
          id="firstName"
          name="firstName"
          control={control}
          label="First Name"
          placeholder="First Name"
        />
        <ControlledFormInput
          id="lastName"
          name="lastName"
          control={control}
          label="Last Name"
          placeholder="Last Name"
        />
      </Box>
      <ControlledNumber
        id="phone"
        name="phone"
        control={control}
        label="Phone Number"
        placeholder="409 757 5013"
        country={(foundCountry?.iso2 as Country) ?? 'US'}
        international
      />

      <ControlledStateSelector
        id="state"
        name="state"
        control={control}
        label="State"
        placeholder="Select a state"
        countryId={foundCountry?.id ?? null}
      />

      <ControlledFormInput
        id="city"
        name="city"
        control={control}
        label="City"
        placeholder="City"
      />
      <ControlledFormInput
        id="address"
        name="addressOne"
        control={control}
        label="Address"
        placeholder="Address"
      />
      <ControlledFormInput
        id="addressTwo"
        name="addressTwo"
        control={control}
        type="text"
        label="Apt, suite, unit, building, floor, etc. (Optional)"
        placeholder="Address (Optional)"
      />
      <ControlledFormInput
        id="zipCode"
        name="zipCode"
        control={control}
        label="Zip Code"
        placeholder="Zip Code"
        type="text"
      />
      <div className="flex flex-col justify-between gap-4 md:flex-row">
        <ContainedButton
          type="submit"
          loading={loading}
          size="large"
          fullWidth
          className="md:w-[173px]"
        >
          {defaultValues ? 'Update' : 'Save'}
        </ContainedButton>
        <OutlinedButton
          onClick={closeModal}
          type="button"
          size="large"
          fullWidth
          className="md:w-[173px]"
        >
          Cancel
        </OutlinedButton>
      </div>
    </Box>
  );
};

export default AddressModalForm;
