import Tippy from '@tippyjs/react/headless';
import { useContext } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useMutation } from '@tanstack/react-query';

import { UserIcon, HandIcon, ChartPieIcon, ViewedIcon, PurchaseIcon, LogoutIcon } from 'src/components/Icons';
import { AppContext } from 'src/contexts/app.context';
import Wrapper from 'src/components/Wrapper';
import PATH from 'src/constants/path';
import { UserRole } from 'src/constants/enum';
import authApi from 'src/apis/auth.api';

const Account = () => {
  const { t } = useTranslation('pages');
  const { isAuthenticated, setIsAuthenticated, profile, setProfile } = useContext(AppContext);

  // Render menu của người dùng
  const renderUserMenu = () => {
    return (
      <Wrapper arrow>
        {/* Khi chưa đăng nhập */}
        {!isAuthenticated && (
          <div className='p-5 min-w-[300px]'>
            <div className='flex mb-4'>
              <HandIcon className='w-5 h-5' />
              <span className='ml-3 text-sm font-medium'>{t('register_login.please_login')}</span>
            </div>
            <div className='flex'>
              <Link
                to={PATH.LOGIN}
                className='flex-1 bg-black text-white rounded flex justify-center items-center text-sm px-5 py-1'
              >
                {t('register_login.login')}
              </Link>
              <Link
                to={PATH.REGISTER}
                className='flex-1 text-black border-[2px] border-black rounded flex justify-center items-center text-sm px-5 py-1 ml-2'
              >
                {t('register_login.register')}
              </Link>
            </div>
          </div>
        )}

        {/* Khi đã đăng nhập */}
        {isAuthenticated && (
          <div className='min-w-[300px]'>
            <Link to={PATH.ACCOUNT_PROFILE} className='px-5 py-4 flex hover:underline border-b'>
              <HandIcon className='w-5 h-5' />
              <span className='ml-4 text-sm font-semibold'>
                Xin chào,{' '}
                <span className='capitalize font-semibold'>
                  {profile?.fullName ? profile.fullName : profile?.email.split('@')[0]}
                </span>
              </span>
            </Link>
            {profile?.role !== UserRole.Customer && (
              <Link to={PATH.DASHBOARD_PRODUCT} className='px-5 py-3 flex hover:underline'>
                <ChartPieIcon className='w-5 h-5' />
                <span className='ml-4 text-sm'>Dashboard</span>
              </Link>
            )}
            <Link to={PATH.ACCOUNT_ORDER} className='px-5 py-3 flex hover:underline'>
              <PurchaseIcon className='w-5 h-5 fill-black' />
              <span className='ml-4 text-sm'>Đơn hàng của tôi</span>
            </Link>
            <Link to={PATH.ACCOUNT_VIEWED_PRODUCT} className='px-5 py-3 flex hover:underline border-b'>
              <ViewedIcon className='w-5 h-5' />
              <span className='ml-4 text-sm'>Đã xem gần đây</span>
            </Link>
            <button onClick={logout} className='px-5 py-3 flex hover:underline w-full'>
              <LogoutIcon className='w-5 h-5' />
              <span className='ml-4 text-sm'>Đăng xuất</span>
            </button>
          </div>
        )}
      </Wrapper>
    );
  };

  // Đăng xuất
  const logoutMutation = useMutation({
    mutationFn: authApi.logout,
    onSuccess: () => {
      setIsAuthenticated(false);
      setProfile(null);
    }
  });
  const logout = () => {
    logoutMutation.mutate();
  };

  return (
    <Tippy placement='bottom-end' render={renderUserMenu} offset={[0, 15]} interactive={true}>
      <div className='h-[42px] bg-[#BE1529] flex items-center justify-center p-2 rounded cursor-pointer ml-4'>
        <UserIcon className='w-5 h-5 flex-shrink-0 stroke-white' />
        {!isAuthenticated ? (
          <span className='text-[13px] text-white ml-3 leading-tight'>
            <div className='font-semibold'>Đăng</div>
            <div className='font-semibold'>nhập</div>
          </span>
        ) : (
          <span className='text-[13px] text-white ml-3 leading-tight'>
            <div className='font-semibold'>Xin chào</div>
            <div className='capitalize font-semibold'>
              {profile?.fullName ? profile.fullName : profile?.email.split('@')[0]}
            </div>
          </span>
        )}
      </div>
    </Tippy>
  );
};

export default Account;
