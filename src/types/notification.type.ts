import { Pagination, SuccessResponse } from './utils.type';

// Type: Thông báo
export interface Notification {
  _id: string;
  type: number;
  title: string;
  content: string;
  is_read: boolean;
  path: string;
  sender: {
    _id: string;
    email: string;
    fullName: string;
    avatar: string;
    phoneNumber: string;
  };
  created_at: string;
  updated_at: string;
}

// Request: Lấy danh sách thông báo
export interface GetNotificationsRequestParams {
  page?: number;
  limit?: number;
}

// Response: Lấy danh sách thông báo
export type GetNotificationsResponse = SuccessResponse<{
  unread_count: number;
  notifications: Notification[];
  pagination: Pagination;
}>;
