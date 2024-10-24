import Box from '@mui/material/Box';

import { Button, Divider } from '@mui/material';
import { Address } from '@/types/address';
import AddressInfoBox from './AddressInfoBox';

type AddressCardProps = {
  email: string;
  address: Address;
  onEdit: (data: Address) => void;
  onSetDefault?: (id: Address['id']) => void;
} & (
  | {
      deletable?: true;
      onDelete: (id: Address['id']) => void;
    }
  | {
      deletable: false;
      onDelete?: never;
    }
);

const AddressCard = ({
  email,
  address,
  onEdit,
  onSetDefault,
  onDelete,
  deletable = true,
}: AddressCardProps): JSX.Element => {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        gap: '24px',
        border: address.default ? 2 : 1,
        borderColor: address.default ? 'primary.main' : 'grey.400',
        padding: '24px',
        borderRadius: '10px',
        minHeight: {
          sx: '256px',
          md: '298px',
        },
        width: '100%',
        maxWidth: '420px',
        filter:
          'drop-shadow(0px 4px 53px rgba(0, 0, 0, 0.04)) drop-shadow(0px 0.500862px 6.63642px rgba(0, 0, 0, 0.02))',
      }}
    >
      <AddressInfoBox address={address} email={email} />
      <Box
        sx={{
          display: 'flex',
          flexWrap: 'wrap',
          marginTop: 'auto',
          gap: '1rem',
        }}
      >
        <Button
          color="primary"
          size="small"
          sx={{
            paddingLeft: '0',
            justifyContent: 'flex-start',
            minWidth: 'auto',
          }}
          onClick={() => onEdit(address)}
        >
          Edit
        </Button>
        {address.default ? null : (
          <>
            <Divider orientation="vertical" flexItem />
            <Button
              color="primary"
              size="small"
              sx={{
                paddingLeft: '0',
                justifyContent: 'flex-start',
                minWidth: 'auto',
              }}
              onClick={() => onSetDefault && onSetDefault(address.id)}
            >
              Set As Default
            </Button>
          </>
        )}
        <Divider orientation="vertical" flexItem />
        {deletable ? (
          <Button
            color="error"
            size="small"
            sx={{
              paddingLeft: '0',
              justifyContent: 'flex-start',
              minWidth: 'auto',
            }}
            onClick={() => onDelete && onDelete(address.id)}
          >
            Delete
          </Button>
        ) : null}
      </Box>
    </Box>
  );
};

export default AddressCard;
