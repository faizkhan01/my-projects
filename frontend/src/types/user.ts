import { USER_ROLES } from '@/constants/auth';
import { Image } from './image';

export interface ProfileData {
  id: number;
  avatar: Image | null;
  firstName: string;
  lastName: string;
  email: string;
  role: USER_ROLES;
  notificationsCount: number;
  store?: {
    id: string;
    name: string;
    slug: string;
    verified: boolean;
    currency: string;
    country: {
      id: number;
      iso2: string;
    };
    logo: {
      url: string;
    };
  };
}

export interface UserSettingsData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
}

export interface EditProfileData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  avatar: File | null | string | undefined;
  oldPassword: string;
  newPassword: string;
  newPasswordConfirmation: string;
}
