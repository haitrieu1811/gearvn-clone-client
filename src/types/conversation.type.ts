import { User } from './user.type';
import { Pagination, PaginationRequestParams, SuccessResponse } from './utils.type';

// Type: Cuộc trò chuyện
export interface ConversationType {
  _id: string;
  message_count: number;
  unread_message_count: number;
  receiver: User;
  latest_message: {
    _id: string;
    content: string;
    is_read: boolean;
    created_at: string;
    updated_at: string;
  } | null;
  created_at: string;
  updated_at: string;
}

// Type: Tin nhắn
export interface MessageType {
  _id: string;
  conversation_id: string;
  sender_id: string;
  receiver_id: string;
  content: string;
  is_read: boolean;
  is_sender: boolean;
  created_at: string;
  updated_at: string;
}

// Request: Lấy danh sách tin nhắn
export interface GetMessagesRequestParams extends PaginationRequestParams {
  conversationId: string;
}

// Response: Lấy danh sách cuộc trò chuyện
export type GetConversationsResponse = SuccessResponse<{
  conversations: ConversationType[];
  pagination: Pagination;
}>;

// Response: Lấy danh sách tin nhắn
export type GetMessagesResponse = SuccessResponse<{
  messages: MessageType[];
  pagination: Pagination;
}>;
