export interface BankInfo {
  id: string;
  profile_default_for_currency?: boolean;
  object: string;
  account: string;
  account_holder_name: string;
  account_holder_type: string;
  account_type: null;
  available_payout_methods: string[];
  default_for_currency: boolean;
  bank_name: string;
  country: string;
  currency: string;
  fingerprint: string;
  last4: string;
  routing_number: string;
  status: 'new' | 'errored' | 'verification_failed';
}
