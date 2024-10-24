import { create } from 'zustand';
import { type SnackbarProps } from '@/ui-kit/snackbars/Snackbar';

// remove open because we already handle it with this store
interface GlobalSnackProps extends Omit<SnackbarProps, 'open'> {
  // the key is used to identify the snackbar
  // with this we can show a transition using the same Snackbar
  key?: number;
}

export interface GlobalSnackbarStore {
  isOpen: boolean;
  props: GlobalSnackProps;
  open: (props: SnackbarProps) => void;
  close: () => void;
}

const useGlobalSnackbar = create<GlobalSnackbarStore>()((set) => ({
  isOpen: false,
  props: {},
  close: () =>
    set({
      isOpen: false,
    }),
  open: (props: GlobalSnackProps) =>
    set({
      isOpen: true,
      props: {
        ...props,
        autoHideDuration: 5000,
        key: new Date().getTime(),
      },
    }),
}));

export const showErrorSnackbar = (message: string) => {
  useGlobalSnackbar.getState().open({
    message: message,
    severity: 'error',
  });
};

export const showSuccessSnackbar = (message: string) => {
  useGlobalSnackbar.getState().open({
    message: message,
    severity: 'success',
  });
};

export default useGlobalSnackbar;
