import {
  SignUpCustomerFormData,
  SignUpVendorFormData,
  LoginFormData,
} from '../types/auth';

export const SIGNUP_VENDOR_DEFAULT_VALUES: SignUpVendorFormData = {
  firstName: '',
  lastName: '',
  email: '',
  countryId: 0,
  storeName: '',
  password: '',
  passwordConfirmation: '',
  terms: false,
};

export const SIGNUP_CUSTOMER_DEFAULT_VALUES: SignUpCustomerFormData = {
  firstName: '',
  lastName: '',
  email: '',
  password: '',
  passwordConfirmation: '',
  terms: false,
};

export const LOGIN_DEFAULT_VALUES: LoginFormData = {
  email: '',
  password: '',
};

export enum USER_ROLES {
  USER = 'USER',
  SELLER = 'SELLER',
}
