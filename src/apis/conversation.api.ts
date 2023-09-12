import {
  GetConversationsRequestParams,
  GetConversationsResponse,
  GetReceiversResponse
} from 'src/types/conversation.type';
import http from 'src/utils/http';

const conversationApi = {
  // Lấy danh sách tin nhắn
  getConversations({ receiverId, page, limit }: GetConversationsRequestParams) {
    return http.get<GetConversationsResponse>(`/conversations/receiver/${receiverId}`, { params: { page, limit } });
  },
  // Lấy danh sách người dùng đã chat
  getReceivers() {
    return http.get<GetReceiversResponse>('/conversations/receivers');
  }
};

export default conversationApi;
