import { Pagination, SuccessResponse } from './utils.type';

export interface Conversation {
  _id: string;
  content: string;
  is_read: boolean;
  sender: {
    _id: string;
    email: string;
    fullName: string;
    avatar: string;
  };
  receiver: {
    _id: string;
    email: string;
    fullName: string;
    avatar: string;
  };
  created_at: string;
  updated_at: string;
}

export interface ConversationReceiver {
  _id: string;
  email: string;
  fullName: string;
  avatar: string;
  unread_count: number;
  last_message: string;
  updated_at: string;
}

// Response: Lấy danh sách tin nhắn
export type GetConversationsResponse = SuccessResponse<{
  conversations: Conversation[];
  pagination: Pagination;
}>;

// Response: Lấy danh sách người dùng đã chat
export type GetReceiversResponse = SuccessResponse<{
  receivers: ConversationReceiver[];
}>;
