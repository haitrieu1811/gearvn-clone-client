import { useInfiniteQuery } from '@tanstack/react-query';
import classNames from 'classnames';
import { FormEvent, useCallback, useContext, useEffect, useRef, useState } from 'react';

import conversationApi from 'src/apis/conversation.api';
import { AppContext } from 'src/contexts/app.context';
import { Conversation, ConversationReceiver } from 'src/types/conversation.type';
import socket from 'src/utils/socket';
import { ChevronDownIcon, ChevronLeftIcon } from '../Icons';
import Image from '../Image';
import ChatWindow from './ChatWindow';
import Receivers from './Receivers';

interface ChatBoxProps {
  visible?: boolean;
  onClose?: () => void;
}

const ChatBox = ({ visible = true, onClose }: ChatBoxProps) => {
  const { profile, getConversationReceiversQuery, conversationReceivers, conversationUnreadCount } =
    useContext(AppContext);
  const [currentReceiver, setCurrentReceiver] = useState<ConversationReceiver | null>(null);
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [message, setMessage] = useState<string>('');
  const [chatBodyHeight, setChatBodyHeight] = useState<number>(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const chatBodyRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!chatBodyRef.current) return;
    setChatBodyHeight(chatBodyRef.current.offsetHeight);
  });

  // Nhận tin nhắn từ socket server và hiển thị lên màn hình
  useEffect(() => {
    socket.on('receive_message', (newConversation) => {
      getConversationReceiversQuery?.refetch();
      // Nếu đang ở một cuộc trò chuyện khác thì không hiển thị tin nhắn
      if (newConversation.sender._id !== currentReceiver?._id) return;
      setConversations((prev) => [newConversation, ...prev]);
    });
    return () => {
      socket.off('receive_message');
    };
  }, [currentReceiver?._id]);

  // Đóng chat box
  const handleClose = () => {
    onClose && onClose();
  };

  // Query: Lấy tin nhắn giữa mình và người nhận
  const getConversationsQuery = useInfiniteQuery({
    queryKey: ['conversations', currentReceiver?._id],
    queryFn: ({ pageParam = 1 }) =>
      conversationApi.getConversations({
        receiverId: currentReceiver?._id as string,
        page: pageParam,
        limit: '20'
      }),
    getNextPageParam: (lastPage) => {
      return lastPage.data.data.pagination.page < lastPage.data.data.pagination.page_size
        ? lastPage.data.data.pagination.page + 1
        : undefined;
    },
    enabled: !!currentReceiver?._id,
    keepPreviousData: true
  });

  // Tải tin nhắn giữa mình và người nhận lúc vừa vào cuộc trò chuyện
  useEffect(() => {
    if (!getConversationsQuery.data) return;
    const conversations = getConversationsQuery.data?.pages.map((page) => page.data.data.conversations).flat();
    setConversations(conversations);
  }, [getConversationsQuery.data]);

  // Chọn người để chat
  const handleSelectReceiver = useCallback(
    (receiver: ConversationReceiver) => {
      if (receiver._id === currentReceiver?._id) {
        setConversations([]);
        setCurrentReceiver(null);
        return;
      }
      setCurrentReceiver(receiver);
      inputRef.current?.focus();
    },
    [currentReceiver]
  );

  // Xử lý gửi tin nhắn
  const handleSendMessage = useCallback(
    (e: FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      if (!message || !currentReceiver || !profile || !conversationReceivers) return;
      const newConversation: Conversation = {
        _id: new Date().getTime().toString(),
        content: message,
        is_read: false,
        sender: {
          _id: profile._id,
          fullname: profile.fullname,
          avatar: profile.avatar,
          email: profile.email
        },
        receiver: {
          _id: currentReceiver._id,
          fullname: currentReceiver.fullname,
          avatar: currentReceiver.avatar,
          email: currentReceiver.email
        },
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };
      socket.emit('new_message', { content: message, receiver_id: currentReceiver._id, sender_id: profile?._id });
      setConversations((prev) => [newConversation, ...prev]);
      setMessage('');
      getConversationReceiversQuery?.refetch();
    },
    [currentReceiver, message, profile, conversationReceivers]
  );

  return (
    <div
      className={classNames(
        'bg-white fixed bottom-0 right-0 md:right-2 z-[999999] lg:z-[99] shadow-3xl rounded-t-lg h-[80vh] md:h-[550px] max-w-full w-full md:w-[640px] flex flex-col duration-300',
        {
          'opacity-0 pointer-events-none translate-y-14': !visible,
          'opacity-100 pointer-events-auto translate-x-0': visible
        }
      )}
    >
      {/* Heading */}
      <div className='flex-shrink-0 flex justify-between items-center h-[50px] pl-6 pr-3 border-b'>
        <div className='flex items-center'>
          {/* Trở về danh sách chat */}
          {currentReceiver && (
            <button className='md:hidden py-2 pr-4' onClick={() => setCurrentReceiver(null)}>
              <ChevronLeftIcon className='w-4 h-4' />
            </button>
          )}
          {/* Tiêu đề */}
          <div className='text-primary font-semibold text-lg hidden md:flex items-center'>
            Chat{' '}
            {conversationUnreadCount > 0 && (
              <span className='text-xs font-normal ml-1'>({conversationUnreadCount})</span>
            )}
          </div>
          {/* Người nhận hiện tại */}
          {currentReceiver && (
            <div className='flex md:hidden items-center'>
              <Image
                src={currentReceiver.avatar}
                alt={currentReceiver.fullname}
                className='w-8 h-8 rounded-full object-cover'
              />
              <span className='text-slate-600 text-[15px] ml-3 font-semibold'>{currentReceiver.fullname}</span>
            </div>
          )}
        </div>
        <button className='py-1 px-2' onClick={handleClose}>
          <ChevronDownIcon className='w-4 h-4' />
        </button>
      </div>
      {/* Body */}
      <div ref={chatBodyRef} className='flex-1 bg-white border-t-slate-900'>
        <div className='flex relative h-full'>
          {/* Danh sách người đã nhắn tin với mình */}
          <Receivers
            chatBodyHeight={chatBodyHeight}
            conversationReceivers={conversationReceivers}
            currentReceiver={currentReceiver}
            handleSelectReceiver={handleSelectReceiver}
          />
          {/* Cửa sổ chat */}
          <ChatWindow
            chatBodyHeight={chatBodyHeight}
            conversations={conversations}
            currentReceiver={currentReceiver}
            handleSendMessage={handleSendMessage}
            message={message}
            setMessage={setMessage}
          />
        </div>
      </div>
    </div>
  );
};

export default ChatBox;
