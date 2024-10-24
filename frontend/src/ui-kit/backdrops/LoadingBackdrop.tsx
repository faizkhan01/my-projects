import { Backdrop, BackdropProps } from '@mui/material';
import { Loader } from '../adornments/Loader';

type LoadingBackdropProps = BackdropProps;

export const LoadingBackdrop = ({ ...props }: LoadingBackdropProps) => {
  return (
    <Backdrop
      {...props}
      sx={{
        color: 'common.white',
        backgroundColor: 'rgba(51,62,92,0.7)',

        ...props?.sx,
      }}
    >
      <Loader size={54} />
    </Backdrop>
  );
};
