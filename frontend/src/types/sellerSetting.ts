export interface SellerSettingForm {
  logo: File | string | null;
  banner: File | string | null;
  storeName: string;
  country: number;
  currency: string;
  firstName: string;
  lastName: string;
  phone: string;
  email: string;
  state: number;
  city: string;
  addressOne: string;
  addressTwo: string;
  zipCode: string;
  oldPassword: string;
  newPassword: string;
  newPasswordConfirmation: string;
}
