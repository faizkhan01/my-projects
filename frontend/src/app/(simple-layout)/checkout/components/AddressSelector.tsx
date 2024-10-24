import { RadioGroup, FormControl } from '@mui/material';
import AddressForm from './AddressForm';
import { useFormContext, useWatch } from 'react-hook-form';
import { CheckoutForm } from '../form';
import { RadioItemContainer, RadioItem } from './CheckoutRadioItem';
import { formatAddress } from '@/utils/formatters';
import useAddresses from '@/hooks/queries/useAddresses';
import { ADDRESS_TYPES_ENUM } from '@/types/address';
import useProfile from '@/hooks/queries/useProfile';

export const ShippingAddressSelector = () => {
  const { setValue, control } = useFormContext<CheckoutForm>();
  const { profile } = useProfile();
  const { addresses: shippingAddresses } = useAddresses(
    ADDRESS_TYPES_ENUM.SHIPPING,
    Boolean(profile),
  );
  const savedShipping = useWatch<CheckoutForm, 'savedShipping'>({
    name: 'savedShipping',
    control,
  });

  return (
    <FormControl className="w-full">
      <RadioGroup
        onChange={(e) => {
          const v = Number(e.target.value);

          if (isNaN(v)) {
            return setValue('savedShipping', null);
          }

          return setValue('savedShipping', v);
        }}
        className="flex flex-col gap-4"
      >
        {shippingAddresses?.map((address) => {
          const selected = savedShipping === address.id;
          return (
            <RadioItemContainer selected={selected} key={address.id}>
              <RadioItem
                text={formatAddress({
                  addressOne: address.addressOne,
                  city: address.city,
                  state: address.state?.name ?? '',
                  country: address.country?.name ?? '',
                  zipCode: address.zipCode,
                })}
                value={address.id?.toString() ?? ''}
                selected={selected}
              />
            </RadioItemContainer>
          );
        })}
        <RadioItemContainer selected={!savedShipping}>
          <RadioItem
            text="New address"
            value="new_address"
            selected={!savedShipping}
          />
          {!savedShipping && (
            <div className="p-4">
              <AddressForm prefix="shipping" />
            </div>
          )}
        </RadioItemContainer>
      </RadioGroup>
    </FormControl>
  );
};

export const BillingAddressSelector = () => {
  const { setValue, control } = useFormContext<CheckoutForm>();
  const [billingSameAsShipping, savedBilling] = useWatch<
    CheckoutForm,
    ['billingSameAsShipping', 'savedBilling']
  >({
    name: ['billingSameAsShipping', 'savedBilling'],
    control,
  });

  const isDifferentSelected = !billingSameAsShipping && !savedBilling;

  return (
    <FormControl className="w-full">
      <RadioGroup
        onChange={(e) => {
          const v = e.target.value;

          if (v === 'same_as_shipping') {
            setValue('savedBilling', null);
            return setValue('billingSameAsShipping', true);
          } else if (v === 'different_billing') {
            setValue('savedBilling', null);
            return setValue('billingSameAsShipping', false);
          }

          const numberValue = Number(v);

          setValue('billingSameAsShipping', false);
          setValue('savedBilling', isNaN(numberValue) ? null : numberValue);
        }}
        className="flex flex-col gap-4"
      >
        <RadioItemContainer selected={billingSameAsShipping}>
          <RadioItem
            text="Same as shipping address"
            value="same_as_shipping"
            selected={billingSameAsShipping}
          />
        </RadioItemContainer>
        <RadioItemContainer selected={isDifferentSelected}>
          <RadioItem
            text="Different billing address"
            value="different_billing"
            selected={isDifferentSelected}
          />
          {isDifferentSelected && (
            <div className="p-4">
              <AddressForm prefix="billing" />
            </div>
          )}
        </RadioItemContainer>
      </RadioGroup>
    </FormControl>
  );
};
