export interface ReportCategory {
  id: number;
  name: string;
  reasons: ReportReason[];
}

export interface ReportReason {
  id: number;
  name: string;
}
