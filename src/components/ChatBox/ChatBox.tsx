import classNames from 'classnames';
import { Fragment, useContext, useEffect } from 'react';

import { AppContext } from 'src/contexts/app.context';
import { ChatContext } from 'src/contexts/chat.context';
import { MessageType } from 'src/types/conversation.type';
import { ChevronDownIcon, ChevronLeftIcon } from '../Icons';
import Image from '../Image';
import ChatWindow from './ChatWindow';
import Conversations from './Conversations';

interface ChatBoxProps {
  visible?: boolean;
  onClose?: () => void;
}

const ChatBox = ({ visible = true, onClose }: ChatBoxProps) => {
  const { socket } = useContext(AppContext);
  const {
    currentConversation,
    setCurrentConversation,
    setMessages,
    totalUnreadMessagesCount,
    setTotalUnreadMessagesCount,
    setConversations
  } = useContext(ChatContext);

  // Lắng nghe sự kiện khi có tin nhắn mới được gửi đến
  useEffect(() => {
    if (socket.hasListeners('receive_message')) return;
    socket.on('receive_message', (data) => {
      const { new_message } = data.payload;
      setTotalUnreadMessagesCount((prev) => prev + 1);
      setConversations((prevConversations) => {
        const existedConversation = prevConversations.find(
          (conversation) => conversation._id === new_message.conversation_id
        );
        if (!existedConversation) return prevConversations;
        existedConversation.latest_message = new_message;
        existedConversation.unread_message_count += 1;
        return [
          existedConversation,
          ...prevConversations.filter((conversation) => conversation._id !== new_message.conversation_id)
        ];
      });
      // Nếu đang ở một cuộc trò chuyện khác thì không hiển thị tin nhắn
      if ((new_message as MessageType).conversation_id !== currentConversation?._id) return;
      setMessages((prev) => [new_message, ...prev]);
    });
    return () => {
      socket.off('receive_message');
    };
  }, [currentConversation?._id]);

  // Đóng chat box
  const handleClose = () => {
    onClose && onClose();
  };

  return (
    <Fragment>
      {visible && (
        <div className='fixed bottom-0 right-0 md:right-2 z-[999999] lg:z-[99] shadow-3xl rounded-t-lg h-[550px] max-h-screen w-full md:w-[640px]'>
          {/* Chat heading */}
          <div className='flex justify-between items-center bg-white rounded-t-lg h-[50px] pl-6 pr-3 border-b relative z-10'>
            {/* Tiêu đề */}
            <div className='flex items-center'>
              {/* Trở về danh sách chat */}
              {currentConversation && (
                <button className='md:hidden py-2 pr-4' onClick={() => setCurrentConversation(null)}>
                  <ChevronLeftIcon className='w-4 h-4' />
                </button>
              )}
              {/* Tiêu đề */}
              <div
                className={classNames('text-primary font-semibold text-lg ', {
                  'hidden md:flex md:items-center': currentConversation
                })}
              >
                Chat{' '}
                {totalUnreadMessagesCount > 0 && (
                  <span className='text-xs font-normal ml-1'>({totalUnreadMessagesCount})</span>
                )}
              </div>
              {/* Người nhận hiện tại */}
              {currentConversation && (
                <div className='flex md:hidden items-center'>
                  <Image
                    src={currentConversation.receiver.avatar}
                    alt={currentConversation.receiver.fullname}
                    className='w-8 h-8 rounded-full object-cover'
                  />
                  <span className='text-slate-600 text-[15px] ml-3 font-semibold'>
                    {currentConversation.receiver.fullname}
                  </span>
                </div>
              )}
            </div>
            {/* Thao tác */}
            <button className='py-1 px-2' onClick={handleClose}>
              <ChevronDownIcon className='w-4 h-4' />
            </button>
          </div>
          {/* Chat body */}
          <div className='bg-white border-t-slate-900 flex h-full'>
            {/* Danh sách cuộc hội thoại */}
            <Conversations />
            {/* Cửa sổ chat */}
            <ChatWindow />
          </div>
        </div>
      )}
    </Fragment>
  );
};

export default ChatBox;
