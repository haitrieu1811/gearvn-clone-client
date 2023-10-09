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
    if (!message || !currentConversation || !profile) return;
    const newMessage: MessageType = {
      _id: new Date().getTime().toString(),
      conversation_id: currentConversation._id,
      content: message,
      is_read: false,
      sender: {
        _id: profile._id,
        fullname: profile.fullname,
        avatar: profile.avatar,
        email: profile.email
      },
      receiver: {
        _id: currentConversation.receiver._id,
        fullname: currentConversation.receiver.fullname,
        avatar: currentConversation.receiver.avatar,
        email: currentConversation.receiver.email
      },
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
    socket.emit('new_message', {
      payload: {
        conversation_id: currentConversation._id,
        receiver_id: currentConversation.receiver._id,
        sender_id: profile?._id,
        content: message
      }
    });
    setMessages((prev) => [newMessage, ...prev]);
    setMessage('');
    setConversations((prevConversations) => {
      const existedConversation = prevConversations.find(
        (conversation) => conversation._id === newMessage.conversation_id
      );
      if (!existedConversation) return prevConversations;
      existedConversation.latest_message = {
        _id: newMessage._id,
        content: newMessage.content,
        is_read: newMessage.is_read,
        created_at: newMessage.created_at,
        updated_at: newMessage.updated_at
      };
      return [
        existedConversation,
        ...prevConversations.filter((conversation) => conversation._id !== newMessage.conversation_id)
      ];
    });
  };

  return (
    <div className='flex-1 bg-[#f8f8f8] relative'>
      {/* Đã chọn người để chat */}
      {currentConversation && (
        <div className='h-full relative'>
          {/* Đã nhắn tin từ trước */}
          {messages.length > 0 && !isLoadingMessages && (
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
                  <Message key={message._id} message={message} isSender={message.sender._id === profile?._id} />
                ))}
              </InfiniteScroll>
            </div>
          )}
          {/* Chưa nhắn tin lần nào */}
          {messages.length === 0 && !isFetchingMessages && (
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
          {isFetchingMessages && (
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
