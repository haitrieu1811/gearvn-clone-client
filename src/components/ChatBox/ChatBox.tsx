import { useMutation, useQuery } from '@tanstack/react-query';
import classNames from 'classnames';
import moment from 'moment';
import { FormEvent, Fragment, useContext, useEffect, useMemo, useState } from 'react';
import InfiniteScroll from 'react-infinite-scroll-component';

import conversationApi from 'src/apis/conversation.api';
import { AppContext } from 'src/contexts/app.context';
import { Conversation } from 'src/types/conversation.type';
import socket from 'src/utils/socket';
import { convertMomentFromNowToVietnamese } from 'src/utils/utils';
import { ChatIcon, ChevronDownIcon, ConversationIcon, LoadingIcon, SendMessageIcon } from '../Icons';
import Image from '../Image';

const CONVERSATION_LIMIT = 20;

const ChatBox = () => {
  const { profile } = useContext(AppContext);
  const [visible, setVisible] = useState<boolean>(false);
  const [currentReceiverId, setCurrentReceiverId] = useState<string | null>(null);
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [message, setMessage] = useState<string>('');
  const [pagination, setPagination] = useState<{ page: number; pageSize: number }>({
    page: 1,
    pageSize: 0
  });

  // Nhận tin nhắn từ socket server và hiển thị lên màn hình
  useEffect(() => {
    socket.on('receive_message', (newConversation) => {
      setConversations((prev) => [newConversation, ...prev]);
    });
  }, []);

  // Query: Lấy dánh sách người đã nhắn tin với mình
  const getReceiversQuery = useQuery({
    queryKey: ['conversation_receivers'],
    queryFn: () => conversationApi.getReceivers()
  });

  // Query: Lấy tin nhắn giữa mình và người nhận
  const getConversationsQuery = useQuery({
    queryKey: ['conversations', currentReceiverId, pagination.page],
    queryFn: () =>
      conversationApi.getConversations({
        receiverId: currentReceiverId as string,
        page: pagination.page,
        limit: CONVERSATION_LIMIT
      }),
    enabled: !!currentReceiverId,
    keepPreviousData: true
  });

  // Mutation: Đọc tin nhắn
  const readConversationsMutation = useMutation({
    mutationFn: conversationApi.readConversations,
    onSuccess: () => {
      getReceiversQuery.refetch();
    }
  });

  // Danh sách người đã nhắn tin với mình
  const receivers = useMemo(
    () => getReceiversQuery.data?.data.data.receivers,
    [getReceiversQuery.data?.data.data.receivers]
  );
  // Tổng số lượng tin nhắn chưa đọc
  const totalUnreadCount = useMemo(
    () => receivers?.reduce((acc, receiver) => acc + receiver.unread_count, 0) || 0,
    [receivers]
  );

  // Tải tin nhắn giữa mình và người nhận
  useEffect(() => {
    if (getConversationsQuery.data?.data) {
      const conversations = getConversationsQuery.data?.data.data.conversations;
      const page = getConversationsQuery.data?.data.data.pagination.page;
      const pageSize = getConversationsQuery.data?.data.data.pagination.page_size;
      setConversations((prev) => [...prev, ...conversations]);
      setPagination({ page, pageSize });
    }
  }, [getConversationsQuery.data?.data]);

  // Chọn người để chat
  const handleSelectReceiver = (receiverId: string) => {
    readConversationsMutation.mutate(receiverId);
    if (receiverId === currentReceiverId) {
      setCurrentReceiverId(null);
      return;
    }
    setConversations([]);
    setPagination((prev) => ({ ...prev, page: 1 }));
    setCurrentReceiverId(receiverId);
  };

  // Xử lý gửi tin nhắn
  const handleSendMessage = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!message || !currentReceiverId) return;
    socket.emit('send_message', { content: message, receiver_id: currentReceiverId, sender_id: profile?._id });
    setMessage('');
  };

  // Tải thêm tin nhắn
  const fetchMoreConversations = () => {
    if (pagination.page >= pagination.pageSize) return;
    setPagination((prev) => ({ ...prev, page: prev.page + 1 }));
  };

  return (
    <Fragment>
      {/* Nút mở chatbox */}
      <div
        onClick={() => setVisible(true)}
        className='fixed bottom-0 right-5 flex justify-center items-center bg-primary rounded-t px-4 py-2 cursor-pointer select-none z-[1]'
      >
        <ChatIcon className='w-6 h-6 text-white' />
        <span className='text-white text-lg font-semibold ml-3'>Chat</span>
        {totalUnreadCount > 0 && (
          <span className='absolute -top-3 -right-3 bg-primary text-white text-xs font-medium w-6 h-6 rounded-full flex justify-center items-center border-[2px]'>
            {totalUnreadCount <= 9 ? totalUnreadCount : '9+'}
          </span>
        )}
      </div>

      {/* Chatbox */}
      {visible && (
        <div className='fixed bottom-0 right-2 z-10 shadow-3xl rounded-t-lg overflow-hidden max-w-[95%] w-[640px]'>
          <div className='flex justify-between items-center py-2 pl-6 pr-3 border-b bg-white'>
            <div className='text-primary font-semibold text-lg flex items-center'>
              Chat {totalUnreadCount > 0 && <span className='text-xs font-normal ml-1'>({totalUnreadCount})</span>}
            </div>
            <div>
              <button className='py-1 px-2' onClick={() => setVisible(false)}>
                <ChevronDownIcon className='w-4 h-4' />
              </button>
            </div>
          </div>
          <div className='bg-white border-slate-900'>
            <div className='flex'>
              {/* Danh sách người đã nhắn tin với mình */}
              {receivers && (
                <div className='w-1/3 border-r h-[500px] max-h-[500px] overflow-y-auto'>
                  {receivers.map((receiver) => (
                    <div
                      key={receiver._id}
                      className={classNames('flex py-4 pl-4 pr-6 relative', {
                        'hover:bg-slate-100': currentReceiverId !== receiver._id,
                        'bg-slate-100': currentReceiverId === receiver._id
                      })}
                      aria-hidden='true'
                      role='button'
                      tabIndex={0}
                      onClick={() => handleSelectReceiver(receiver._id)}
                    >
                      <Image src={receiver.avatar} alt='' className='w-9 h-9 rounded object-cover flex-shrink-0' />
                      <div className='flex-1 ml-3'>
                        <h3 className='font-semibold line-clamp-1 text-sm'>
                          {receiver.fullName || `User#${receiver._id.slice(-4)}`}
                        </h3>
                        <p className='text-sm text-slate-500 line-clamp-1'>{receiver.last_message}</p>
                      </div>
                      {receiver.unread_count > 0 && (
                        <span className='absolute top-3 right-2 w-4 h-4 rounded-full bg-primary text-white text-[8px] flex justify-center items-center font-bold'>
                          {receiver.unread_count}
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              )}
              {/* Cửa sổ chat */}
              <div className='flex-1 bg-[#f8f8f8]'>
                {/* Đã chọn người để chat */}
                {currentReceiverId && (
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
                        next={fetchMoreConversations}
                        style={{ display: 'flex', flexDirection: 'column-reverse' }}
                        inverse={true} //
                        hasMore={pagination.page < pagination.pageSize}
                        height={450}
                        scrollThreshold={1}
                        loader={
                          <div className='flex justify-center pb-4'>
                            <LoadingIcon className='w-6 h-6' />
                          </div>
                        }
                        scrollableTarget='scrollableDiv'
                      >
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

                {/* Loading */}
                {/* {currentReceiverId && getConversationsQuery.isLoading && (
                  <div className='flex justify-center items-center h-full'>
                    <LoadingIcon className='w-8 h-8' />
                  </div>
                )} */}

                {/* Chưa chọn người để chat */}
                {!currentReceiverId && (
                  <div className='flex justify-center items-center flex-col h-full'>
                    <ConversationIcon className='w-28 h-2w-28 stroke-[0.3] stroke-slate-400' />
                    <div className='text-center text-slate-500 mt-4'>Welcome to Gearvn Clone chat</div>
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
