import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { AddressModal } from '../modals/addresses/AddressModal';
import { Address, AddressFormData, ADDRESS_TYPES_ENUM } from '@/types/address';
import { useState } from 'react';
import { useAddressActions } from '@/hooks/address/address.actions';
import { ProfileData } from '@/types/user';
import useAddresses from '@/hooks/queries/useAddresses';
import AddressCard from '../address/AddressCard';
import AddressCardSkeleton from '../address/AddressCardSkeleton';
import { BackLinkButton } from '@/ui-kit/buttons';
import { AddItemCard } from '@/ui-kit/cards';
import { MobileHeading } from '@/ui-kit/typography';

interface Props {
  profile: ProfileData;
}

const Shipping = ({ profile }: Props) => {
  const [open, setOpen] = useState(false);
  const openModal = () => setOpen(true);
  const closeModal = () => setOpen(false);

  const { loading, createAddress, updateAddress, deleteAddress } =
    useAddressActions();

  const [defaultValues, setDefaultValues] = useState<
    AddressFormData | undefined
  >(undefined);
  const [selectedAddress, setSelectedAddress] = useState<Address | undefined>(
    undefined,
  );

  const { addresses, mutate, isLoading } = useAddresses(
    ADDRESS_TYPES_ENUM.SHIPPING,
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
        ADDRESS_TYPES_ENUM.SHIPPING,
      );
    } else {
      response = await createAddress(data, ADDRESS_TYPES_ENUM.SHIPPING);
    }
    if (response && response.statusCode === 201) {
      const newData =
        addresses && Array.isArray(addresses)
          ? [...addresses, response.data]
          : [response.data];
      mutate(newData, { revalidate: Boolean(editMode) });
      editMode ? disableEditMode() : null;
      closeModal();
    }
    return {
      message: response ? response.message : 'Something went wrong',
    };
  };

  const handleDelete = async (id: number) => {
    try {
      await deleteAddress(id, ADDRESS_TYPES_ENUM.SHIPPING);
      mutate();
    } catch (error) {
      console.error(error);
    }
  };

  const handleSetDefault = async (id: number) => {
    try {
      await updateAddress(id, { default: true }, ADDRESS_TYPES_ENUM.SHIPPING);
      mutate();
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <Box>
      <BackLinkButton />
      <MobileHeading title="Shipping Adresses" />
      <Typography
        variant="h5"
        sx={{
          marginBottom: '24px',
          display: { xs: 'none', md: 'block' },
        }}
      >
        Shipping Information
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
          <>
            <AddressCardSkeleton />
            <AddressCardSkeleton />
          </>
        ) : (
          <>
            {Array.isArray(addresses) &&
              addresses?.map((item: Address) => (
                <AddressCard
                  key={item.id}
                  address={item}
                  email={item.email ? item.email : profile.email}
                  onEdit={handleDefaultValues}
                  onDelete={handleDelete}
                  onSetDefault={handleSetDefault}
                />
              ))}
          </>
        )}
        <AddItemCard
          onClick={() => {
            disableEditMode();
            openModal();
          }}
          text="Add Address"
          className="min-w-[256px] max-w-[420px] md:min-w-[298px]"
        />
        <AddressModal
          defaultValues={defaultValues}
          loading={loading}
          open={open}
          closeModal={closeModal}
          handleSubmit={handleSubmit}
        />
      </Box>
    </Box>
  );
};

export default Shipping;
