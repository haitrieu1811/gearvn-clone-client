import { ReactNode, useContext } from 'react';
import Tippy from '@tippyjs/react/headless';
import { Link } from 'react-router-dom';

import { BellIcon } from 'src/components/Icons';
import DashboardSidebar from '../components/DashboardSidebar';
import { AppContext } from 'src/contexts/app.context';
import fallbackAvatar from 'src/assets/images/fallback-avatar.jpg';
import { getImageUrl } from 'src/utils/utils';
import Wrapper from 'src/components/Wrapper';
import PATH from 'src/constants/path';

const DashboardLayout = ({ children }: { children: ReactNode }) => {
  const { profile } = useContext(AppContext);

  const renderMenuUser = () => (
    <Wrapper>
      <Link to={PATH.ACCOUNT_PROFILE} className='block py-2 px-4 text-sm text-slate-500 border-b'>
        Cập nhật tài khoản
      </Link>
      <Link to={PATH.ACCOUNT_PROFILE} className='block py-2 px-4 text-sm text-slate-500'>
        Đăng xuất
      </Link>
    </Wrapper>
  );

  return (
    <div className='bg-[#f8f8f8]'>
      {/* Header */}
      <header className='flex justify-end items-center sticky top-0 bg-white z-[999] py-2'>
        {profile && (
          <Tippy interactive placement='bottom-end' offset={[0, 5]} render={renderMenuUser}>
            <div className='flex items-center mr-10 cursor-pointer'>
              <img
                src={profile.avatar ? getImageUrl(profile.avatar) : fallbackAvatar}
                alt={profile.fullName}
                className='w-8 h-8 rounded-full object-cover flex-shrink-0'
              />
              <div className='ml-2'>
                <div className='text-sm font-semibold'>{profile.fullName}</div>
                <div className='text-slate-500 text-xs'>Admin</div>
              </div>
            </div>
          </Tippy>
        )}
        <button className='bg-slate-50 w-8 h-8 rounded-full flex justify-center items-center mr-4 relative'>
          <BellIcon className='w-5 h-5 fill-none' />
          <span className='absolute top-0 right-0  bg-red-500 text-[9px] text-white font-bold rounded-full w-4 h-4 flex justify-center items-center'>
            2
          </span>
        </button>
      </header>
      {/* Content */}
      <div className='flex'>
        <DashboardSidebar />
        <div className='flex-1 ml-[240px] min-h-screen p-4 pb-0'>{children}</div>
      </div>
    </div>
  );
};

export default DashboardLayout;
