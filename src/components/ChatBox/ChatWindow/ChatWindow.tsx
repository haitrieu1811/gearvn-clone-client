import { FormEvent, Fragment, useContext } from 'react';
import InfiniteScroll from 'react-infinite-scroll-component';

import { ComputerIcon, SendMessageIcon, SpinnerIcon } from 'src/components/Icons';
import Image from 'src/components/Image';
import Loading from 'src/components/Loading';
import { AppContext } from 'src/contexts/app.context';
import { ChatContext } from 'src/contexts/chat.context';
import { MessageType } from 'src/types/conversation.type';
import Message from '../Message';

const ChatWindow = () => {
  const { profile, socket } = useContext(AppContext);
  const {
    messages,
    setMessages,
    message,
    setMessage,
    fetchNextPageMessages,
    hasNextPageMessages,
    isLoadingMessages,
    isFetchingMessages,
    currentConversation,
    inputMessageRef,
    setConversations
  } = useContext(ChatContext);

  // Xử lý gửi tin nhắn
  const handleSendMessage = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // Nếu chưa nhập gì, chưa chọn người để chat hoặc chưa đăng nhập thì không gửi tin nhắn
    if (!message.trim() || !currentConversation || !profile) return;
    const new_message: MessageType = {
      _id: new Date().getTime().toString(),
      conversation_id: currentConversation._id,
      sender_id: profile._id,
      receiver_id: currentConversation.receiver._id,
      content: message,
      is_read: false,
      is_sender: true,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
    // Gửi tin nhắn lên server
    socket.emit('new_message', {
      payload: {
        new_message
      }
    });
    setConversations((prevConversations) => {
      const existedConversation = prevConversations.find(
        (conversation) => conversation._id === new_message.conversation_id
      );
      if (!existedConversation) return prevConversations;
      existedConversation.latest_message = {
        _id: new_message._id,
        content: new_message.content,
        is_read: new_message.is_read,
        created_at: new_message.created_at,
        updated_at: new_message.updated_at
      };
      return [
        existedConversation,
        ...prevConversations.filter((conversation) => conversation._id !== new_message.conversation_id)
      ];
    });
    setMessages((prev) => [new_message, ...prev]);
    setMessage('');
  };

  return (
    <div className='flex-1 bg-[#f8f8f8] relative'>
      {/* Đã chọn người để chat */}
      {currentConversation && (
        <div className='h-full relative'>
          {/* Đã nhắn tin từ trước */}
          {currentConversation && currentConversation.message_count > 0 && !isLoadingMessages && (
            <div
              id='scrollableDiv'
              style={{
                display: 'flex',
                flexDirection: 'column-reverse'
              }}
            >
              <InfiniteScroll
                className='p-4 overflow-y-auto'
                dataLength={messages.length}
                next={fetchNextPageMessages}
                style={{ display: 'flex', flexDirection: 'column-reverse' }}
                inverse={true}
                hasMore={hasNextPageMessages}
                scrollableTarget='scrollableDiv'
                height={450}
                loader={
                  <div className='flex justify-center pb-4'>
                    <SpinnerIcon className='w-6 h-6' />
                  </div>
                }
              >
                {/* Danh sách tin nhắn */}
                {messages.map((message) => (
                  <Message key={message._id} message={message} isSender={message.is_sender} />
                ))}
              </InfiniteScroll>
            </div>
          )}
          {/* Chưa nhắn tin lần nào */}
          {currentConversation && currentConversation.message_count === 0 && !isLoadingMessages && (
            <div className='h-[450px] flex flex-col justify-center items-center'>
              {!isFetchingMessages && (
                <Fragment>
                  <Image src={currentConversation.receiver.avatar} className='w-20 h-20 rounded-full object-cover' />
                  <div className='mt-6 text-slate-600'>
                    Bắt đầu trò chuyện với{' '}
                    <span className='font-semibold text-black'>{currentConversation.receiver.fullname}</span>
                  </div>
                </Fragment>
              )}
            </div>
          )}
          {/* Loading */}
          {isLoadingMessages && (
            <div className='absolute inset-0 flex justify-center items-center bg-white'>
              <Loading />
            </div>
          )}
          {/* Nhập chat */}
          <form className='bg-white border-t flex h-[50px]' onSubmit={handleSendMessage}>
            <input
              ref={inputMessageRef}
              type='text'
              placeholder='Nhập nội dung tin nhắn'
              className='w-full py-3 pl-4 pr-1 outline-none text-slate-600'
              value={message}
              onChange={(e) => setMessage(e.target.value)}
            />
            <button className='w-12 flex justify-center items-center'>
              <SendMessageIcon className='w-4 h-4 stroke-slate-600' />
            </button>
          </form>
        </div>
      )}
      {/* Chưa chọn người để chat */}
      {!currentConversation && (
        <div className='hidden md:flex justify-center items-center flex-col h-full'>
          <ComputerIcon className='w-28 h-2w-28 stroke-[0.5] stroke-slate-500' />
          <div className='text-center text-slate-600 mt-4'>Welcome to Gearvn Clone chat</div>
        </div>
      )}
    </div>
  );
};

export default ChatWindow;
