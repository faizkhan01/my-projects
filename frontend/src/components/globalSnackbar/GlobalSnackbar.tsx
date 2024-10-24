import { shallow } from 'zustand/shallow';
import { Snackbar } from '@/ui-kit/snackbars';
import useGlobalSnackbar from '@/hooks/stores/useGlobalSnackbar';
import { SnackbarCloseReason } from '@mui/material';

const GlobalSnackbar = () => {
  const { isOpen, props, close } = useGlobalSnackbar(
    (state) => ({
      isOpen: state.isOpen,
      props: state.props,
      close: state.close,
    }),
    shallow,
  );

  const { onClose } = props;

  const handleClose = (
    event: React.SyntheticEvent | Event,
    reason: SnackbarCloseReason,
  ) => {
    if (reason === 'clickaway') {
      return;
    }
    close();
    onClose && onClose(event, reason);
  };

  return (
    <Snackbar open={isOpen} {...props} key={props?.key} onClose={handleClose} />
  );
};

export default GlobalSnackbar;
