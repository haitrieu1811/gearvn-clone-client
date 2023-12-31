import { NotificationType } from 'src/constants/enum';
import { Pagination, SuccessResponse } from './utils.type';

// Type: Thông báo
export interface Notification {
  _id: string;
  type: NotificationType;
  title: string;
  content: string;
  is_read: boolean;
  path: string;
  sender: {
    _id: string;
    email: string;
    fullname: string;
    avatar: string;
    phone_number: string;
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
