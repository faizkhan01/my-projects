export interface Notification {
  createdAt: string;
  data: null;
  id: number;
  message: string;
  read: false;
  receiverId: number;
  title: string;
  type: string;
  updatedAt: string;
  url: string;
}

export interface NotificationsResponse {
  total: number;
  limit: number;
  offset: number;
  results: Notification[];
}
