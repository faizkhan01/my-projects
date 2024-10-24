import type { Country } from './countries';
import type { Image } from './image';

export interface Store {
  id: number;
  createdAt: string;
  updatedAt: string;
  logo: Image | null;
  banner: Image | null;
  slug: string;
  name: string;
  country: Country;
  verified: boolean;
}

export interface FollowedStore {
  id: number;
  store: Pick<Store, 'id' | 'name' | 'slug' | 'logo'>;
  store_id: number;
  user_id: number;
}

export interface ValidateStoreName {
  reason: string;
  valid: boolean;
}
