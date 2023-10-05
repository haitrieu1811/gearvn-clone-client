import classNames from 'classnames';
import { memo } from 'react';

import Image from 'src/components/Image';
import { ConversationReceiver } from 'src/types/conversation.type';

interface ReceiversProps {
  receivers: ConversationReceiver[];
  currentReceiver: ConversationReceiver | null;
  handleSelectReceiver: (receiver: any) => void;
  chatBodyHeight: number;
}

const Receivers = ({ receivers, currentReceiver, handleSelectReceiver, chatBodyHeight }: ReceiversProps) => {
  return (
    <div
      style={{
        height: `${chatBodyHeight}px`,
        maxHeight: `${chatBodyHeight}px`
      }}
      className={classNames(
        'absolute md:relative bottom-0 top-0 w-full md:w-1/3 bg-white border-r-0 md:border-r-slate-900 h-full overflow-y-auto',
        {
          'hidden md:block': currentReceiver
        }
      )}
    >
      {receivers.map((receiver) => (
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
            alt={receiver.fullname}
            className='w-10 h-10 rounded-full object-cover flex-shrink-0'
          />
          <div className='flex-1 ml-3'>
            <h3 className='font-semibold line-clamp-1 text-sm'>
              {receiver.fullname || `User#${receiver._id.slice(-4)}`}
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
  );
};

export default memo(Receivers);
