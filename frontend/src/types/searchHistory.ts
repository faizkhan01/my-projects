export interface SearchHistory {
  id: number;
  createdAt: string;
  keyword: string;
  resultsCount: number;
  user: {
    avatar: string;
    email: string;
    emailVerifiedAt: string;
    firstName: string;
    id: number;
    isBlocked: boolean;
    lastName: string;
    phone?: number;
    registrationCode?: number;
    role: string;
    stripe_account_id: string;
  } | null;
}
