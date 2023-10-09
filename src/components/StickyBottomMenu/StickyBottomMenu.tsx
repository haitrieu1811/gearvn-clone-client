import classNames from 'classnames';
import { Fragment, useContext } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';

import { CategoryIcon, ChatIcon, HomeIcon, NewspaperIcon, UserIcon } from 'src/components/Icons';
import PATH from 'src/constants/path';
import { AppContext } from 'src/contexts/app.context';
import { ChatContext } from 'src/contexts/chat.context';
import ChatBox from '../ChatBox';

const StickyBottomMenu = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useContext(AppContext);
  const { isOpenChat, setIsOpenChat, resetChat, totalUnreadMessagesCount } = useContext(ChatContext);

  // Mở chatbox
  const handleOpenChat = () => {
    if (isAuthenticated) setIsOpenChat(true);
    else navigate(PATH.LOGIN);
  };

  return (
    <Fragment>
      <div className='block md:hidden sticky bg-white bottom-0 left-0 right-0 border-t-[2px] border-t-primary'>
        <div className='flex'>
          <NavLink
            to={PATH.HOME}
            className={({ isActive }) =>
              classNames('flex-1 flex justify-center items-center flex-col py-[10px]', {
                groupactive: isActive
              })
            }
          >
            <HomeIcon className='w-5 h-5 mb-[6px] stroke-[#333333] group-[active]:text-primary' />
            <span className='text-[10px] text-[#333333] group-[active]:text-primary'>Trang chủ</span>
          </NavLink>
          <NavLink
            to={PATH.ACCOUNT_ORDER}
            className={({ isActive }) =>
              classNames('flex-1 flex justify-center items-center flex-col py-[10px]', {
                groupactive: isActive
              })
            }
          >
            <CategoryIcon className='w-5 h-5 mb-[6px] group-[active]:text-primary' />
            <span className='text-[10px] text-[#333333] group-[active]:text-primary'>Đơn hàng</span>
          </NavLink>
          <NavLink
            to={PATH.BLOG}
            className={({ isActive }) =>
              classNames('flex-1 flex justify-center items-center flex-col py-[10px]', {
                groupactive: isActive
              })
            }
          >
            <NewspaperIcon className='w-5 h-5 mb-[6px] stroke-[#333333] group-[active]:text-primary' />
            <span className='text-[10px] text-[#333333] group-[active]:text-primary'>Tin công nghệ</span>
          </NavLink>
          <button
            onClick={handleOpenChat}
            className='relative flex-1 flex justify-center items-center flex-col py-[10px]'
          >
            <ChatIcon className='w-5 h-5 mb-[6px] stroke-[#333333]' />
            <span className='text-[10px] text-[#333333]'>Chat</span>
            {totalUnreadMessagesCount > 0 && (
              <span className='absolute top-2 right-1 text-[8px] w-4 h-4 bg-red-600 text-white rounded-full flex justify-center items-center'>
                {totalUnreadMessagesCount <= 9 ? totalUnreadMessagesCount : '9+'}
              </span>
            )}
          </button>
          <NavLink
            to={PATH.ACCOUNT_PROFILE}
            className={({ isActive }) =>
              classNames('flex-1 flex justify-center items-center flex-col py-[10px]', {
                groupactive: isActive
              })
            }
          >
            <UserIcon className='w-5 h-5 mb-[6px] stroke-[#333333] group-[active]:stroke-primary' />
            <span className='text-[10px] text-[#333333] group-[active]:text-primary'>Tài khoản</span>
          </NavLink>
        </div>
      </div>
      <ChatBox visible={isOpenChat} onClose={resetChat} />
    </Fragment>
  );
};

export default StickyBottomMenu;
