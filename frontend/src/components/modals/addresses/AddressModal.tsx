import { AddressFormData } from '@/types/address';
import { ModalCardContainer, ModalContainer } from '@/ui-kit/containers';
import AddressModalForm from './AddressModalForm';

interface Props {
  open: boolean;
  closeModal: () => void;
  loading: boolean;
  defaultValues?: AddressFormData;
  handleSubmit: (data: AddressFormData) => Promise<{ message: string }>;
}

export const AddressModal = ({
  open,
  closeModal,
  loading,
  defaultValues,
  handleSubmit,
}: Props) => {
  return (
    <ModalContainer open={open} onClose={closeModal}>
      <ModalCardContainer
        title={defaultValues ? 'Update Address' : 'Add a new address'}
        minWidth="370px"
        cardSx={{
          paddingLeft: { xs: '16px', md: '0px' },
          paddingRight: { xs: '16px', md: '0px' },
          marginRight: { xs: '0px', md: '200px' },
          marginLeft: { xs: '0px', md: '200px' },
        }}
      >
        <div className="mt-6">
          <AddressModalForm
            defaultValues={defaultValues}
            customHandleSubmit={handleSubmit}
            loading={loading}
            closeModal={closeModal}
          />
        </div>
      </ModalCardContainer>
    </ModalContainer>
  );
};
