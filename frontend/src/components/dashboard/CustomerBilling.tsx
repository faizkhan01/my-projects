import { useState } from 'react';
import { Box, Typography } from '@mui/material';
import useAddresses from '@/hooks/queries/useAddresses';
import { ProfileData } from '@/types/user';
import AddressCard from '../address/AddressCard';
import AddressCardSkeleton from '../address/AddressCardSkeleton';
import { Address, AddressFormData, ADDRESS_TYPES_ENUM } from '@/types/address';
import { AddressModal } from '../modals/addresses/AddressModal';
import { useAddressActions } from '@/hooks/address/address.actions';
import { BackLinkButton } from '@/ui-kit/buttons';
import { AddItemCard } from '@/ui-kit/cards';
import { MobileHeading } from '@/ui-kit/typography';

interface CustomerBillingProps {
  profile: ProfileData;
}

const CustomerBilling = ({ profile }: CustomerBillingProps) => {
  const [open, setOpen] = useState(false);
  const openModal = () => setOpen(true);
  const closeModal = () => setOpen(false);
  const { loading, createAddress, updateAddress } = useAddressActions();
  const { addresses, mutate, isLoading } = useAddresses(
    ADDRESS_TYPES_ENUM.BILLING,
  );

  const [defaultValues, setDefaultValues] = useState<
    AddressFormData | undefined
  >(undefined);
  const [selectedAddress, setSelectedAddress] = useState<Address | undefined>(
    undefined,
  );

  const handleDefaultValues = (data: Address) => {
    enableEditMode(data);
    openModal();
  };

  const enableEditMode = async (data: Address) => {
    setSelectedAddress(data);
    setDefaultValues({
      ...data,
      country: data.country.id,
      state: data.state.id,
    });
  };

  const disableEditMode = () => {
    setSelectedAddress(undefined);
    setDefaultValues(undefined);
  };

  const handleSubmit = async (data: AddressFormData) => {
    const editMode = defaultValues && selectedAddress;
    let response;
    if (editMode) {
      response = await updateAddress(
        selectedAddress.id,
        data,
        ADDRESS_TYPES_ENUM.BILLING,
      );
    } else {
      response = await createAddress(data, ADDRESS_TYPES_ENUM.BILLING);
    }
    if (response && response.statusCode === 201) {
      mutate([response.data]);
      editMode ? disableEditMode() : null;
      closeModal();
    }
    return {
      message: response ? response.message : 'Something went wrong',
    };
  };

  return (
    <Box>
      <BackLinkButton />
      <MobileHeading title="Billing Addresses" />
      <Typography
        variant="h5"
        sx={{
          marginBottom: '24px',
          display: { xs: 'none', md: 'block' },
        }}
      >
        Billing Information
      </Typography>

      <Box
        sx={{
          display: 'flex',
          gap: {
            xs: '16px',
            md: '30px',
          },
          flexWrap: 'wrap',
        }}
      >
        {isLoading ? (
          <AddressCardSkeleton />
        ) : addresses?.[0] ? (
          <AddressCard
            address={{
              ...addresses?.[0],
              default: true,
            }}
            email={profile.email}
            onEdit={handleDefaultValues}
            deletable={false}
          />
        ) : null}

        {!isLoading && !addresses?.length && (
          <AddItemCard
            onClick={openModal}
            text="Add Address"
            className="min-h-[256px] max-w-[420px] md:min-h-[298px]"
          />
        )}
      </Box>
      <AddressModal
        open={open}
        closeModal={closeModal}
        loading={loading}
        handleSubmit={handleSubmit}
        defaultValues={defaultValues}
      />
    </Box>
  );
};

export default CustomerBilling;
