import { GetConversationsResponse, GetReceiversResponse } from 'src/types/conversation.type';
import { OnlyMessageResponse } from 'src/types/utils.type';
import http from 'src/utils/http';

const conversationApi = {
  // Lấy danh sách tin nhắn
  getConversations({ receiverId, page, limit }: { receiverId: string; page?: number; limit?: number }) {
    return http.get<GetConversationsResponse>(`/conversations/receiver/${receiverId}`, { params: { page, limit } });
  },
  // Đọc tin nhắn
  readConversations(senderId: string) {
    return http.patch<OnlyMessageResponse>(`/conversations/read/sender/${senderId}`);
  },
  // Lấy danh sách người dùng đã chat
  getReceivers() {
    return http.get<GetReceiversResponse>('/conversations/receivers');
  }
};

export default conversationApi;
