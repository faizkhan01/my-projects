import { Skeleton } from '@mui/material';

const AddressCardSkeleton = () => (
  <Skeleton
    variant="rectangular"
    width={420}
    height={298}
    sx={{
      filter:
        'drop-shadow(0px 4px 53px rgba(0, 0, 0, 0.04)) drop-shadow(0px 0.500862px 6.63642px rgba(0, 0, 0, 0.02))',
      border: 1,
      borderColor: 'grey.400',
    }}
  />
);

export default AddressCardSkeleton;
