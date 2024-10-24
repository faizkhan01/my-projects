export interface SignUpCustomerFormData {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  passwordConfirmation: string;
  terms: boolean;
}

export interface SignUpVendorFormData {
  firstName: string;
  lastName: string;
  email: string;
  countryId: number;
  storeName: string;
  password: string;
  passwordConfirmation: string;
  terms: boolean;
}

export interface LoginFormData {
  email: string;
  password: string;
}

export interface LoginBodyData extends LoginFormData {
  cart?: {
    productId: number;
    quantity: number;
  }[];
}
