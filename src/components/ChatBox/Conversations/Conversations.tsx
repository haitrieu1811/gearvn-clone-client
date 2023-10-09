import { memo, useContext } from 'react';
import classNames from 'classnames';

import Image from 'src/components/Image';
import { ChatContext } from 'src/contexts/chat.context';
import { ConversationType } from 'src/types/conversation.type';
import Loading from 'src/components/Loading';

const Conversations = () => {
  const {
    conversations,
    currentConversation,
    setCurrentConversation,
    inputMessageRef,
    isLoadingConversations,
    setConversations
  } = useContext(ChatContext);

  // Chọn người để chat
  const handleSelectConversation = (conversation: ConversationType) => {
    if (conversation._id === currentConversation?._id) return;
    setCurrentConversation(conversation);
    setConversations((prevConversations) => {
      return prevConversations.map((prevConversation) => {
        if (prevConversation._id === conversation._id) {
          return {
            ...prevConversation,
            unread_message_count: 0
          };
        }
        return prevConversation;
      });
    });
    inputMessageRef?.current?.focus();
  };

  return (
    <div
      className={classNames(
        'absolute z-10 md:relative bottom-0 w-full md:w-1/3 bg-white border-r-0 md:border-r-slate-900 h-[500px] max-h-[500px] overflow-y-auto',
        {
          'hidden md:block': currentConversation
        }
      )}
    >
      {conversations.map((conversation) => (
        <div
          key={conversation._id}
          className={classNames('flex py-4 pl-4 pr-6 relative', {
            'hover:bg-slate-100': conversation._id !== currentConversation?._id,
            'bg-slate-100': conversation._id === currentConversation?._id
          })}
          aria-hidden='true'
          role='button'
          tabIndex={0}
          onClick={() => handleSelectConversation(conversation)}
        >
          <Image
            src={conversation.receiver.avatar}
            alt={conversation.receiver.fullname}
            className='w-10 h-10 rounded-full object-cover flex-shrink-0'
          />
          <div className='flex-1 ml-3'>
            <h3 className='font-semibold line-clamp-1 text-sm'>{conversation.receiver.fullname}</h3>
            <p className='text-sm text-slate-400 line-clamp-1'>
              {conversation.latest_message
                ? conversation.latest_message.content
                : `Bắt đầu trò chuyện với ${conversation.receiver.fullname}`}
            </p>
          </div>
          {conversation.unread_message_count > 0 && (
            <span className='absolute top-3 right-2 w-4 h-4 rounded-full bg-primary text-white text-[8px] flex justify-center items-center font-semibold'>
              {conversation.unread_message_count <= 9 ? conversation.unread_message_count : '9+'}
            </span>
          )}
        </div>
      ))}
      {/* Loading */}
      {isLoadingConversations && (
        <div className='absolute inset-0 bg-white/60 flex justify-center items-center'>
          <Loading />
        </div>
      )}
    </div>
  );
};

export default memo(Conversations);
