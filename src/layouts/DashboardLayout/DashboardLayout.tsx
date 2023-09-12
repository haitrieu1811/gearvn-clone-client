import Tippy from '@tippyjs/react/headless';
import { ReactNode, useContext } from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';

import fallbackAvatar from 'src/assets/images/fallback-avatar.jpg';
import Back from 'src/components/Back';
import Notification from 'src/components/Notification';
import PATH from 'src/constants/path';
import { AppContext } from 'src/contexts/app.context';
import { getImageUrl } from 'src/utils/utils';
import DashboardSidebar from '../components/DashboardSidebar';

const DashboardLayout = ({ children }: { children: ReactNode }) => {
  const { profile } = useContext(AppContext);

  return (
    <div className='bg-[#f8f8f8] flex'>
      <DashboardSidebar />
      <div className='flex-1'>
        {/* Header */}
        <header className='flex justify-between items-center bg-white sticky top-0 white z-[999] h-14 px-4 border-b'>
          <Back />
          <div className='flex items-center'>
            {profile && (
              <Tippy
                interactive
                trigger='click'
                placement='bottom-end'
                offset={[0, 5]}
                render={() => (
                  <div className='bg-white rounded shadow-lg'>
                    <Link
                      to={PATH.ACCOUNT_PROFILE}
                      className='block py-2 pl-5 pr-16 text-sm text-slate-500 hover:bg-slate-50 border-b'
                    >
                      Cập nhật tài khoản
                    </Link>
                    <Link
                      to={PATH.ACCOUNT_PROFILE}
                      className='block py-2 pl-5 pr-16 text-sm text-slate-500 hover:bg-slate-50'
                    >
                      Đăng xuất
                    </Link>
                  </div>
                )}
              >
                <div className='flex items-center mr-10 cursor-pointer select-none'>
                  <img
                    src={profile.avatar ? getImageUrl(profile.avatar) : fallbackAvatar}
                    alt={profile.fullName}
                    className='w-9 h-9 rounded-full object-cover flex-shrink-0'
                  />
                  <div className='ml-2'>
                    <div className='text-sm font-semibold text-black'>{profile.fullName}</div>
                    <div className='text-slate-500 text-xs'>Admin</div>
                  </div>
                </div>
              </Tippy>
            )}
            <Notification />
          </div>
        </header>
        <div className='min-h-screen p-4 pb-0'>
          <div className='bg-white rounded'>{children}</div>
        </div>
      </div>
    </div>
  );
};

DashboardLayout.propTypes = {
  children: PropTypes.node.isRequired
};

export default DashboardLayout;
