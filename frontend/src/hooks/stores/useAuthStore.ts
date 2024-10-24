import { getProfile } from '@/services/API/auth/profile';
import { ProfileData } from '@/types/user';
import axios from 'axios';
import routes from '@/constants/routes';
import { create } from 'zustand';

interface State {
  token: string | null;
  profile: ProfileData | null;
  isLoggedIn: boolean;
  isLoading: boolean;
}

interface Actions {
  setToken: (token: string | null) => void;
  setAuth: (token: string | null, profile: ProfileData | null) => void;
  logout: () => void;
  initialize: () => void;
}

export const useAuthStore = create<State & Actions>((set, get) => ({
  token: null,
  profile: null,
  isLoggedIn: false,
  isLoading: true,

  logout: () => {
    if (typeof window !== 'undefined') {
      window.location.pathname = routes.LOGOUT.INDEX;
    }

    set({ token: null, isLoggedIn: false, profile: null });
  },

  initialize: async () => {
    const token = get().token;

    if (!token) {
      set({ isLoading: false, isLoggedIn: false });
      return;
    }

    try {
      const res = await getProfile(token);

      set({
        profile: res,
        isLoading: false,
        token: token,
        isLoggedIn: true,
      });
    } catch (error) {
      if (axios.isAxiosError(error)) {
        if (error.response?.status === 401) {
          get().logout();
        }
      } else {
        console.error(error);
      }
    }
  },
  setToken: (token) => {
    if (token) {
      set({ token, isLoggedIn: true });
    } else {
      set({ token: null, isLoggedIn: false });
    }
  },
  setAuth: (token, profile) => {
    set({ token, profile, isLoading: false, isLoggedIn: Boolean(profile) });
  },
}));
