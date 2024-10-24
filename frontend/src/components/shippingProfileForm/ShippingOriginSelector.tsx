import { Control } from 'react-hook-form';
import ControlledCountrySelector from '../hookForm/ControlledCountrySelector';

const ShippingOriginSelector = ({
  prefix = '',
  control,
}: {
  prefix?: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  control: Control<any>;
}) => (
  <ControlledCountrySelector
    name={`${prefix}countryId`}
    control={control}
    label="Shipping origin"
    placeholder="Select country"
    loadingOnOpen={false}
    helperText="The country where the orders will be shipped from"
  />
);

export default ShippingOriginSelector;
