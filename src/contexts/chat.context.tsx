import { useInfiniteQuery, useQuery } from '@tanstack/react-query';
import PropTypes from 'prop-types';
import {
  Dispatch,
  ReactNode,
  RefObject,
  SetStateAction,
  createContext,
  useContext,
  useEffect,
  useRef,
  useState
} from 'react';

import conversationApi from 'src/apis/conversation.api';
import { ConversationType, MessageType } from 'src/types/conversation.type';
import { AppContext } from './app.context';

interface ChatContextType {
  resetChat: () => void;
  isOpenChat: boolean;
  setIsOpenChat: Dispatch<SetStateAction<boolean>>;
  conversations: ConversationType[];
  setConversations: Dispatch<SetStateAction<ConversationType[]>>;
  messages: MessageType[];
  setMessages: Dispatch<SetStateAction<MessageType[]>>;
  currentConversation: ConversationType | null;
  setCurrentConversation: Dispatch<SetStateAction<ConversationType | null>>;
  message: string;
  setMessage: Dispatch<SetStateAction<string>>;
  totalUnreadMessagesCount: number;
  setTotalUnreadMessagesCount: Dispatch<SetStateAction<number>>;
  inputMessageRef: RefObject<HTMLInputElement> | null;

  fetchNextPageMessages: () => void;
  hasNextPageMessages: boolean;
  isLoadingMessages: boolean;
  isFetchingMessages: boolean;
  isLoadingConversations: boolean;
}

const initialContext: ChatContextType = {
  resetChat: () => null,
  isOpenChat: false,
  setIsOpenChat: () => null,
  conversations: [],
  setConversations: () => null,
  messages: [],
  setMessages: () => null,
  currentConversation: null,
  setCurrentConversation: () => null,
  message: '',
  setMessage: () => null,
  inputMessageRef: null,
  totalUnreadMessagesCount: 0,
  setTotalUnreadMessagesCount: () => null,

  fetchNextPageMessages: () => null,
  hasNextPageMessages: false,
  isLoadingMessages: false,
  isFetchingMessages: false,
  isLoadingConversations: false
};

export const ChatContext = createContext<ChatContextType>(initialContext);

interface ChatProviderProps {
  children: ReactNode;
}

const ChatProvider = ({ children }: ChatProviderProps) => {
  const { profile } = useContext(AppContext);
  const [isOpenChat, setIsOpenChat] = useState<boolean>(initialContext.isOpenChat);
  const [conversations, setConversations] = useState<ConversationType[]>(initialContext.conversations);
  const [messages, setMessages] = useState<MessageType[]>(initialContext.messages);
  const [currentConversation, setCurrentConversation] = useState<ConversationType | null>(
    initialContext.currentConversation
  );
  const [message, setMessage] = useState<string>(initialContext.message);
  const [totalUnreadMessagesCount, setTotalUnreadMessagesCount] = useState<number>(
    initialContext.totalUnreadMessagesCount
  );
  const inputMessageRef = useRef<HTMLInputElement>(null);

  // Reset chat (khi đăng xuất)
  const resetChat = () => {
    setIsOpenChat(false);
    setCurrentConversation(null);
    setMessages([]);
    setMessage('');
  };

  // Query: Lấy danh sách cuộc trò chuyện
  const getConversationsQuery = useQuery({
    queryKey: ['conversations', profile?._id],
    queryFn: () => conversationApi.getConversations(),
    enabled: !!profile && isOpenChat
  });

  // Tải danh sách cuộc trò chuyện
  useEffect(() => {
    if (!getConversationsQuery.data) return;
    setConversations(getConversationsQuery.data?.data.data.conversations);
  }, [getConversationsQuery.data]);

  // Query: Lấy tin nhắn giữa mình và người nhận
  const getMessagesQuery = useInfiniteQuery({
    queryKey: ['messages', currentConversation?._id],
    queryFn: ({ pageParam = 1 }) =>
      conversationApi.getMessages({
        conversationId: (currentConversation as ConversationType)._id,
        page: pageParam,
        limit: '20'
      }),
    getNextPageParam: (lastPage) => {
      return lastPage.data.data.pagination.page < lastPage.data.data.pagination.page_size
        ? lastPage.data.data.pagination.page + 1
        : undefined;
    },
    enabled: !!currentConversation,
    keepPreviousData: true
  });

  // Tải tin nhắn giữa mình và người nhận
  useEffect(() => {
    if (!getMessagesQuery.data) return;
    const messages = getMessagesQuery.data?.pages.map((page) => page.data.data.messages).flat();
    setMessages(messages);
  }, [getMessagesQuery.data]);

  // Tổng số tin nhắn chưa đọc
  useEffect(() => {
    if (conversations.length === 0) return;
    setTotalUnreadMessagesCount(
      conversations.reduce((acc, conversation) => acc + conversation.unread_message_count, 0)
    );
  }, [conversations]);

  return (
    <ChatContext.Provider
      value={{
        resetChat,
        isOpenChat,
        setIsOpenChat,
        conversations,
        setConversations,
        messages,
        setMessages,
        currentConversation,
        setCurrentConversation,
        message,
        setMessage,
        totalUnreadMessagesCount,
        setTotalUnreadMessagesCount,
        inputMessageRef,

        fetchNextPageMessages: getMessagesQuery.fetchNextPage,
        hasNextPageMessages: !!getMessagesQuery.hasNextPage,
        isLoadingMessages: getMessagesQuery.isLoading,
        isFetchingMessages: getMessagesQuery.isFetching,
        isLoadingConversations: getConversationsQuery.isLoading
      }}
    >
      {children}
    </ChatContext.Provider>
  );
};

ChatProvider.propTypes = {
  children: PropTypes.node.isRequired
};

export default ChatProvider;
