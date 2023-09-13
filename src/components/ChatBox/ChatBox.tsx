import { useInfiniteQuery } from '@tanstack/react-query';
import classNames from 'classnames';
import moment from 'moment';
import { FormEvent, Fragment, useContext, useEffect, useState } from 'react';
import InfiniteScroll from 'react-infinite-scroll-component';

import conversationApi from 'src/apis/conversation.api';
import { AppContext } from 'src/contexts/app.context';
import { Conversation, ConversationReceiver } from 'src/types/conversation.type';
import socket from 'src/utils/socket';
import { convertMomentFromNowToVietnamese } from 'src/utils/utils';
import { ChevronDownIcon, ChevronLeftIcon, ConversationIcon, LoadingIcon, SendMessageIcon } from '../Icons';
import Image from '../Image';

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
    if (getConversationsQuery.data) {
      const conversations = getConversationsQuery.data?.pages.map((page) => page.data.data.conversations).flat();
      setConversations(conversations);
    }
  }, [getConversationsQuery.data]);

  // Chọn người để chat
  const handleSelectReceiver = (receiver: ConversationReceiver) => {
    if (receiver._id === currentReceiver?._id) {
      setConversations([]);
      setCurrentReceiver(null);
      return;
    }
    setCurrentReceiver(receiver);
  };

  // Xử lý gửi tin nhắn
  const handleSendMessage = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!message || !currentReceiver || !profile || !conversationReceivers) return;
    const newConversation: Conversation = {
      _id: new Date().getTime().toString(),
      content: message,
      is_read: false,
      sender: {
        _id: profile._id,
        fullName: profile.fullName,
        avatar: profile.avatar,
        email: profile.email
      },
      receiver: {
        _id: currentReceiver._id,
        fullName: currentReceiver.fullName,
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
  };

  return (
    <Fragment>
      {visible && (
        <div className='bg-white fixed bottom-0 right-0 md:right-2 z-[999999] md:z-[99] shadow-3xl rounded-t-lg max-h-screen h-[550px] max-w-full w-[640px]'>
          {/* Heading */}
          <div className='flex justify-between items-center h-[50px] pl-6 pr-3 border-b'>
            <div className='flex items-center'>
              {currentReceiver && (
                <button className='md:hidden py-2 pr-4' onClick={() => setCurrentReceiver(null)}>
                  <ChevronLeftIcon className='w-4 h-4' />
                </button>
              )}
              <div className='text-primary font-semibold text-lg hidden md:flex items-center'>
                Chat{' '}
                {conversationUnreadCount > 0 && (
                  <span className='text-xs font-normal ml-1'>({conversationUnreadCount})</span>
                )}
              </div>
              {currentReceiver && (
                <div className='flex md:hidden items-center'>
                  <Image
                    src={currentReceiver.avatar}
                    alt={currentReceiver.fullName}
                    className='w-8 h-8 rounded-full object-cover'
                  />
                  <span className='text-slate-600 text-[15px] ml-3 font-semibold'>{currentReceiver.fullName}</span>
                </div>
              )}
            </div>
            <button className='py-1 px-2' onClick={handleClose}>
              <ChevronDownIcon className='w-4 h-4' />
            </button>
          </div>
          {/* Body */}
          <div className='bg-white border-t-slate-900 h-[500px]'>
            <div className='flex relative'>
              {/* Danh sách người đã nhắn tin với mình */}
              {conversationReceivers && (
                <div
                  className={classNames(
                    'absolute md:relative bottom-0 top-0 w-full md:w-1/3 bg-white border-r-0 md:border-r-slate-900 h-[500px] max-h-[500px] overflow-y-auto',
                    {
                      'hidden md:block': currentReceiver
                    }
                  )}
                >
                  {conversationReceivers.map((receiver) => (
                    <div
                      key={receiver._id}
                      className={classNames('flex py-4 pl-4 pr-6 relative', {
                        'hover:bg-slate-100': currentReceiver?._id !== receiver._id,
                        'bg-slate-100': currentReceiver?._id === receiver._id
                      })}
                      aria-hidden='true'
                      role='button'
                      tabIndex={0}
                      onClick={() => handleSelectReceiver(receiver)}
                    >
                      <Image
                        src={receiver.avatar}
                        alt={receiver.fullName}
                        className='w-10 h-10 rounded-full object-cover flex-shrink-0'
                      />
                      <div className='flex-1 ml-3'>
                        <h3 className='font-semibold line-clamp-1 text-sm'>
                          {receiver.fullName || `User#${receiver._id.slice(-4)}`}
                        </h3>
                        <p className='text-sm text-slate-400 line-clamp-1'>
                          {receiver.last_message && receiver.last_message.content}
                        </p>
                      </div>
                      {receiver.unread_count > 0 && (
                        <span className='absolute top-3 right-2 w-4 h-4 rounded-full bg-primary text-white text-[8px] flex justify-center items-center font-semibold'>
                          {receiver.unread_count <= 9 ? receiver.unread_count : '9+'}
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              )}

              {/* Cửa sổ chat */}
              <div className='flex-1 bg-[#f8f8f8]'>
                {/* Đã chọn người để chat */}
                {currentReceiver && (
                  <Fragment>
                    {/* Tin nhắn */}
                    <div
                      id='scrollableDiv'
                      style={{
                        display: 'flex',
                        flexDirection: 'column-reverse'
                      }}
                    >
                      <InfiniteScroll
                        className='p-4'
                        dataLength={conversations.length}
                        next={getConversationsQuery.fetchNextPage}
                        style={{ display: 'flex', flexDirection: 'column-reverse' }}
                        inverse={true}
                        hasMore={!!getConversationsQuery.hasNextPage}
                        height={450}
                        loader={
                          <div className='flex justify-center pb-4'>
                            <LoadingIcon className='w-6 h-6' />
                          </div>
                        }
                        scrollableTarget='scrollableDiv'
                      >
                        {/* Đã nhắn tin trước đó */}
                        {conversations.length > 0 &&
                          conversations.map((conversation) => {
                            const isSender = conversation.sender._id === profile?._id;
                            return (
                              <div
                                key={conversation._id}
                                className={classNames('flex mb-4 first:mb-0', {
                                  'justify-end': isSender
                                })}
                              >
                                <div
                                  className={classNames(' rounded-lg shadow py-2 px-4 max-w-[80%]', {
                                    'bg-white': !isSender,
                                    'bg-[#d7f7ef]': isSender
                                  })}
                                >
                                  <div className='text-slate-800 text-[15px]'>{conversation.content}</div>
                                  <div className='text-right text-xs text-slate-400 mt-1'>
                                    {convertMomentFromNowToVietnamese(moment(conversation.created_at).fromNow())}
                                  </div>
                                </div>
                              </div>
                            );
                          })}

                        {/* Chưa nhắn tin lần nào */}
                        {conversations.length <= 0 && !getConversationsQuery.isFetching && (
                          <div className='h-full flex justify-center items-center flex-col'>
                            <Image src={currentReceiver.avatar} className='w-20 h-20 rounded-full  object-cover' />
                            <div className='mt-6 text-slate-600 text-sm'>
                              Bắt đầu trò chuyện với{' '}
                              <span className='font-semibold text-black'>
                                {currentReceiver.fullName || `User#${currentReceiver._id.slice(-4)}`}
                              </span>
                            </div>
                          </div>
                        )}
                      </InfiniteScroll>
                    </div>
                    {/* Nhập chat */}
                    <form className='bg-white border-t flex h-[50px]' onSubmit={handleSendMessage}>
                      <input
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
                  </Fragment>
                )}

                {/* Chưa chọn người để chat */}
                {!currentReceiver?._id && (
                  <div className='flex justify-center items-center flex-col h-[500px]'>
                    <ConversationIcon className='w-28 h-2w-28 stroke-[0.5] stroke-slate-500' />
                    <div className='text-center text-slate-600 mt-4'>Welcome to Gearvn Clone chat</div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </Fragment>
  );
};

export default ChatBox;
