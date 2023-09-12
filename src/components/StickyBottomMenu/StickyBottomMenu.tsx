import classNames from 'classnames';
import { Fragment, useContext } from 'react';
import { NavLink } from 'react-router-dom';

import { CategoryIcon, ChatIcon, DiscountIcon, HomeIcon, UserIcon } from 'src/components/Icons';
import PATH from 'src/constants/path';
import { AppContext } from 'src/contexts/app.context';
import ChatBox from '../ChatBox';

const StickyBottomMenu = () => {
  const { isOpenChat, setIsOpenChat } = useContext(AppContext);

  return (
    <Fragment>
      <div className='sticky bg-white bottom-0 left-0 right-0 border-t-[2px] border-t-primary'>
        <div className='flex'>
          <NavLink
            to={PATH.HOME}
            className={({ isActive }) =>
              classNames('flex-1 flex justify-center items-center flex-col py-[10px]', {
                groupactive: isActive
              })
            }
          >
            <HomeIcon className='w-5 h-5 mb-[6px] stroke-[#333333] group-[active]:fill-primary' />
            <span className='text-[10px] text-[#333333] group-[active]:text-primary'>Trang chủ</span>
          </NavLink>
          <NavLink
            to={PATH.HOME}
            className={({ isActive }) =>
              classNames('flex-1 flex justify-center items-center flex-col py-[10px]', {
                groupactive: isActive
              })
            }
          >
            <CategoryIcon className='w-5 h-5 mb-[6px] group-[active]:stroke-primary' />
            <span className='text-[10px] text-[#333333]'>Danh mục</span>
          </NavLink>
          <NavLink
            to={PATH.HOME}
            className={({ isActive }) =>
              classNames('flex-1 flex justify-center items-center flex-col py-[10px]', {
                groupactive: isActive
              })
            }
          >
            <DiscountIcon className='w-5 h-5 mb-[6px] group-[active]:stroke-primary' />
            <span className='text-[10px] text-[#333333]'>Khuyến mãi</span>
          </NavLink>
          <button
            onClick={() => setIsOpenChat(true)}
            className='flex-1 flex justify-center items-center flex-col py-[10px]'
          >
            <ChatIcon className='w-5 h-5 mb-[6px] stroke-[#333333]' />
            <span className='text-[10px] text-[#333333]'>Chat</span>
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

      <ChatBox visible={isOpenChat} onClose={() => setIsOpenChat(false)} />
      {isOpenChat && <div className='fixed inset-0 bg-black/80 z-[99999]' onClick={() => setIsOpenChat(false)} />}
    </Fragment>
  );
};

export default StickyBottomMenu;
