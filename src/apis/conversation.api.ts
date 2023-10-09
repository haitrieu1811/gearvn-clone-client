import { GetConversationsResponse, GetMessagesResponse, GetMessagesRequestParams } from 'src/types/conversation.type';
import { OnlyMessageResponse, PaginationRequestParams } from 'src/types/utils.type';
import http from 'src/utils/http';

const conversationApi = {
  // Lấy danh sách cuộc trò chuyện
  getConversations(params?: PaginationRequestParams) {
    return http.get<GetConversationsResponse>('/conversations', { params });
  },

  // Tạo một cuộc trò chuyện mới
  createConversation(receiver_id: string) {
    return http.post<OnlyMessageResponse>('/conversations', { receiver_id });
  },

  // Lấy danh sách tin nhắn của một cuộc trò chuyện
  getMessages({ conversationId, page, limit }: GetMessagesRequestParams) {
    return http.get<GetMessagesResponse>(`/conversations/${conversationId}/messages`, { params: { page, limit } });
  }
};

export default conversationApi;
