import classNames from 'classnames';
import moment from 'moment';
import PropTypes from 'prop-types';
import { memo } from 'react';

import { MessageType } from 'src/types/conversation.type';
import { convertMomentFromNowToVietnamese } from 'src/utils/utils';

interface MessageProps {
  message: MessageType;
  isSender: boolean;
}

const Message = ({ message, isSender }: MessageProps) => {
  return (
    <div
      key={message._id}
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
        <div className='text-slate-800 text-[15px]'>{message.content}</div>
        <div className='text-right text-xs text-slate-400 mt-1'>
          {convertMomentFromNowToVietnamese(moment(message.created_at).fromNow())}
        </div>
      </div>
    </div>
  );
};

Message.propTypes = {
  message: PropTypes.object.isRequired,
  isSender: PropTypes.bool.isRequired
};

export default memo(Message);
