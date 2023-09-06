import { NotificationType } from 'src/constants/enum';
import { Pagination, SuccessResponse } from './utils.type';

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

// Request: Thêm một thông báo mới đến những người dùng có quyền quản trị
export interface AddNotificationRequestBody {
  type: NotificationType;
  title: string;
  content: string;
  path?: string;
}

// Response: Lấy danh sách thông báo
export type GetNotificationsResponse = SuccessResponse<{
  unread_count: number;
  notifications: Notification[];
  pagination: Pagination;
}>;
