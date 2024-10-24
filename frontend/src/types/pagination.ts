export interface PaginatedResponse<T> {
  total: number;
  offset: number;
  limit: number;
  results: T;
}

export type PaginationQueryParams = Partial<{
  limit: number;
  offset: number;
}>;
