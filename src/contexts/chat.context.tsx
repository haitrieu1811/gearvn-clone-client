import { useQuery } from '@tanstack/react-query';
import { Dispatch, ReactNode, SetStateAction, createContext, useContext, useMemo, useState } from 'react';

import conversationApi from 'src/apis/conversation.api';
import { Conversation, ConversationReceiver } from 'src/types/conversation.type';
import { AppContext } from './app.context';

interface ChatContextType {
  isOpenChat: boolean;
  setIsOpenChat: Dispatch<SetStateAction<boolean>>;
  receivers: ConversationReceiver[];
  unreadCount: number;
  isLoadingReceivers: boolean;
  refetchReceivers: () => void;
  currentReceiver: ConversationReceiver | null;
  setCurrentReceiver: Dispatch<SetStateAction<ConversationReceiver | null>>;
  conversations: Conversation[];
  setConversations: Dispatch<SetStateAction<Conversation[]>>;
  message: string;
  setMessage: Dispatch<SetStateAction<string>>;
  chatBodyHeight: number;
  setChatBodyHeight: Dispatch<SetStateAction<number>>;
}

const initialContext: ChatContextType = {
  isOpenChat: false,
  setIsOpenChat: () => null,
  receivers: [],
  unreadCount: 0,
  isLoadingReceivers: false,
  refetchReceivers: () => null,
  currentReceiver: null,
  setCurrentReceiver: () => null,
  conversations: [],
  setConversations: () => null,
  message: '',
  setMessage: () => null,
  chatBodyHeight: 0,
  setChatBodyHeight: () => null
};

export const ChatContext = createContext<ChatContextType>(initialContext);

const ChatProvider = ({ children }: { children: ReactNode }) => {
  const { profile } = useContext(AppContext);
  const [isOpenChat, setIsOpenChat] = useState<boolean>(initialContext.isOpenChat);
  const [currentReceiver, setCurrentReceiver] = useState<ConversationReceiver | null>(initialContext.currentReceiver);
  const [conversations, setConversations] = useState<Conversation[]>(initialContext.conversations);
  const [message, setMessage] = useState<string>(initialContext.message);
  const [chatBodyHeight, setChatBodyHeight] = useState<number>(initialContext.chatBodyHeight);

  // Query: Lấy dánh sách người đã nhắn tin với mình
  const getReceiversQuery = useQuery({
    queryKey: ['conversation_receivers', profile?._id],
    queryFn: () => conversationApi.getReceivers(),
    enabled: !!profile?._id
  });

  // Danh sách người đã nhắn tin với mình
  const conversationReceivers = useMemo(
    () => getReceiversQuery.data?.data.data.receivers || [],
    [getReceiversQuery.data?.data.data.receivers]
  );

  // Tổng số lượng tin nhắn chưa đọc
  const conversationUnreadCount = useMemo(
    () => conversationReceivers?.reduce((acc, receiver) => acc + receiver.unread_count, 0) || 0,
    [conversationReceivers]
  );

  return (
    <ChatContext.Provider
      value={{
        isOpenChat,
        setIsOpenChat,
        receivers: conversationReceivers,
        unreadCount: conversationUnreadCount,
        isLoadingReceivers: getReceiversQuery.isLoading,
        refetchReceivers: getReceiversQuery.refetch,
        currentReceiver,
        setCurrentReceiver,
        conversations,
        setConversations,
        message,
        setMessage,
        chatBodyHeight,
        setChatBodyHeight
      }}
    >
      {children}
    </ChatContext.Provider>
  );
};

export default ChatProvider;
