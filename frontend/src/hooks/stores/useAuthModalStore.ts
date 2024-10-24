import { create } from 'zustand';

type AuthModals =
  | 'login'
  | 'register'
  | 'forgotPassword'
  | 'resetPassword'
  | null;

export interface AuthModalStore {
  isOpen: boolean;
  open: (name: AuthModals) => void;
  close: () => void;
  modal: AuthModals;
}

const useAuthModalStore = create<AuthModalStore>((set) => ({
  isOpen: false,
  modal: null,
  open: (name) => set({ isOpen: true, modal: name }),
  close: () => set({ isOpen: false, modal: null }),
}));

export default useAuthModalStore;
