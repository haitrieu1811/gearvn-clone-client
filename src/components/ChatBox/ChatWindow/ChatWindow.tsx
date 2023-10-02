import { useInfiniteQuery } from '@tanstack/react-query';
import classNames from 'classnames';
import moment from 'moment';
import { Dispatch, FormEvent, Fragment, SetStateAction, useContext, useRef, memo } from 'react';
import InfiniteScroll from 'react-infinite-scroll-component';

import conversationApi from 'src/apis/conversation.api';
import { ConversationIcon, SendMessageIcon, SpinnerIcon } from 'src/components/Icons';
import Image from 'src/components/Image';
import { AppContext } from 'src/contexts/app.context';
import { Conversation, ConversationReceiver } from 'src/types/conversation.type';
import { convertMomentFromNowToVietnamese } from 'src/utils/utils';

interface ChatWindowProps {
  currentReceiver: ConversationReceiver | null;
  conversations: Conversation[];
  handleSendMessage: (e: FormEvent<HTMLFormElement>) => void;
  message: string;
  setMessage: Dispatch<SetStateAction<string>>;
  chatBodyHeight: number;
}

const ChatWindow = ({
  currentReceiver,
  conversations,
  handleSendMessage,
  message,
  setMessage,
  chatBodyHeight
}: ChatWindowProps) => {
  const { profile } = useContext(AppContext);
  const inputRef = useRef<HTMLInputElement>(null);

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

  return (
    <div className='flex-1 bg-[#f8f8f8]'>
      {/* Đã chọn người để chat */}
      {currentReceiver && (
        <div className='h-full relative'>
          {/* Đã nhắn tin từ trước */}
          {conversations.length > 0 && !getConversationsQuery.isLoading && (
            <div
              id='scrollableDiv'
              style={{
                display: 'flex',
                flexDirection: 'column-reverse',
                overflowY: 'auto',
                height: `${chatBodyHeight}px`,
                maxHeight: `${chatBodyHeight}px`,
                paddingBottom: '50px'
              }}
            >
              <InfiniteScroll
                className='p-4'
                dataLength={conversations.length}
                next={getConversationsQuery.fetchNextPage}
                style={{ display: 'flex', flexDirection: 'column-reverse' }}
                inverse={true}
                hasMore={!!getConversationsQuery.hasNextPage}
                scrollableTarget='scrollableDiv'
                loader={
                  <div className='flex justify-center pb-4'>
                    <SpinnerIcon className='w-6 h-6' />
                  </div>
                }
              >
                {conversations.map((conversation) => {
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
          )}

          {/* Chưa nhắn tin lần nào */}
          {conversations.length === 0 && (
            <div className='h-full flex flex-col justify-center items-center'>
              {!getConversationsQuery.isFetching && (
                <Fragment>
                  <Image src={currentReceiver.avatar} className='w-20 h-20 rounded-full object-cover' />
                  <div className='mt-6 text-slate-600'>
                    Bắt đầu trò chuyện với{' '}
                    <span className='font-semibold text-black'>
                      {currentReceiver.fullname || `User#${currentReceiver._id.slice(-4)}`}
                    </span>
                  </div>
                </Fragment>
              )}
            </div>
          )}

          {/* Nhập chat */}
          <form
            className='bg-white border-t flex h-[50px] absolute bottom-0 left-0 right-0'
            onSubmit={handleSendMessage}
          >
            <input
              ref={inputRef}
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
      {!currentReceiver && (
        <div className='flex justify-center items-center flex-col h-full'>
          <ConversationIcon className='w-28 h-2w-28 stroke-[0.5] stroke-slate-500' />
          <div className='text-center text-slate-600 mt-4'>Welcome to Gearvn Clone chat</div>
        </div>
      )}
    </div>
  );
};

export default memo(ChatWindow);
