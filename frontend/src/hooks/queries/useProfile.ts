import { useAuthStore } from '../stores/useAuthStore';
import { shallow } from 'zustand/shallow';

const useProfile = () => {
  const { profile, isLoading, isLoggedIn } = useAuthStore(
    (state) => ({
      profile: state.profile,
      isLoading: state.isLoading,
      isLoggedIn: state.isLoggedIn,
    }),
    shallow,
  );

  return {
    isLoading,
    profile,
    isLoggedIn,
  };
};

export const useSellerCurrency = () => {
  const { profile } = useProfile();
  return profile?.store?.currency || 'USD';
};

export default useProfile;
