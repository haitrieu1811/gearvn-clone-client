import Tippy from '@tippyjs/react/headless';
import { Fragment, useContext } from 'react';
import { Link } from 'react-router-dom';

import Back from 'src/components/Back';
import { ChatIcon } from 'src/components/Icons';
import Image from 'src/components/Image';
import Notification from 'src/components/Notification';
import PATH from 'src/constants/path';
import { AppContext } from 'src/contexts/app.context';
import { ChatContext } from 'src/contexts/chat.context';

const HeaderDashboard = () => {
  const { profile, logout } = useContext(AppContext);
  const { setIsOpenChat, totalUnreadMessagesCount } = useContext(ChatContext);
  return (
    <Fragment>
      <header className='flex justify-between items-center bg-white sticky top-0 white z-[999] h-14 px-4 border-b'>
        <div className='flex items-center'>
          <Back />
        </div>
        <div className='flex items-center'>
          <button
            onClick={() => setIsOpenChat((prev) => !prev)}
            className='bg-slate-100 w-9 h-9 rounded-full flex justify-center items-center mr-4 relative'
          >
            <ChatIcon className='w-5 h-5 fill-none' />
            {totalUnreadMessagesCount > 0 && (
              <span className='absolute -top-1 -right-1  bg-red-500 text-[10px] text-white font-bold rounded-full w-5 h-5 flex justify-center items-center'>
                {totalUnreadMessagesCount <= 9 ? totalUnreadMessagesCount : '9+'}
              </span>
            )}
          </button>
          <Notification />
          {profile && (
            <Tippy
              interactive
              trigger='click'
              placement='bottom-end'
              offset={[0, 5]}
              render={() => (
                <div className='bg-white rounded-lg border shadow-2xl'>
                  <div className='flex items-center p-5 border-b'>
                    <Image src={profile.avatar} className='w-14 h-14 rounded-full object-cover' />
                    <div className='flex-1 ml-4'>
                      <div className='font-semibold'>{profile.fullname}</div>
                      <div className='text-sm text-slate-500'>Admin</div>
                    </div>
                  </div>
                  <div className='pb-2'>
                    <Link
                      to={PATH.ACCOUNT_PROFILE}
                      className='block py-2 pl-7 pr-20 text-sm text-slate-500 hover:text-slate-600'
                    >
                      Cập nhật tài khoản
                    </Link>
                    <Link
                      to={PATH.ACCOUNT_CHANGE_PASSWORD}
                      className='block py-2 pl-7 pr-20 text-sm text-slate-500 hover:text-slate-600'
                    >
                      Đổi mật khẩu
                    </Link>
                    <button
                      onClick={logout}
                      className='block w-full text-left py-2 pl-7 pr-20 text-sm text-slate-500 hover:text-slate-600'
                    >
                      Đăng xuất
                    </button>
                  </div>
                </div>
              )}
            >
              <div className='ml-3 cursor-pointer select-none'>
                <Image
                  src={profile.avatar}
                  alt={profile.fullname}
                  className='w-9 h-9 rounded-full object-cover flex-shrink-0'
                />
              </div>
            </Tippy>
          )}
        </div>
      </header>
    </Fragment>
  );
};

export default HeaderDashboard;
