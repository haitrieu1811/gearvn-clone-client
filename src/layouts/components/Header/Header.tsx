import { useMutation } from '@tanstack/react-query';
import Tippy from '@tippyjs/react/headless';
import { useContext } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';

import authApi from 'src/apis/auth.api';
import logo from 'src/assets/images/logo-white.svg';
import { HandIcon, LogoutIcon, PurchaseIcon, UserIcon, ViewedIcon } from 'src/components/Icons';
import Wrapper from 'src/components/Wrapper';
import PATH from 'src/constants/path';
import { AppContext } from 'src/contexts/app.context';

const Header = () => {
  const { t } = useTranslation('pages');
  const { isAuthenticated, setIsAuthenticated, profile, setProfile } = useContext(AppContext);

  const renderUserMenu = () => {
    return (
      <Wrapper>
        {!isAuthenticated ? (
          <div className='p-5 min-w-[300px]'>
            <div className='flex mb-4'>
              <HandIcon className='w-5 h-5' />
              <span className='ml-3 text-sm'>{t('register_login.please_login')}</span>
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
        ) : (
          <div className='min-w-[300px]'>
            <Link to={PATH.PROFILE} className='px-5 py-4 flex hover:underline border-b'>
              <HandIcon className='w-5 h-5' />
              <span className='ml-4 text-sm font-medium'>
                Xin chào, {profile?.fullName ? profile.fullName : profile?.email.split('@')[0]}
              </span>
            </Link>
            <Link to={PATH.HOME} className='px-5 py-3 flex hover:underline'>
              <PurchaseIcon className='w-5 h-5' />
              <span className='ml-4 text-sm'>Đơn hàng của tôi</span>
            </Link>
            <Link to={PATH.HOME} className='px-5 py-3 flex hover:underline border-b'>
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
    <header className='bg-primary'>
      <nav className='container py-4 flex justify-between items-center'>
        <Link to={PATH.HOME} className='inline'>
          <img src={logo} alt='Logo' className='w-[140px]' />
        </Link>
        <Tippy placement='bottom-end' render={renderUserMenu} offset={[0, 0]} interactive>
          <div className='h-[42px] bg-[#BE1529] flex items-center justify-center p-2 rounded cursor-pointer'>
            <UserIcon className='w-5 h-5 flex-shrink-0' />
            {!isAuthenticated ? (
              <span className='text-[13px] text-white ml-3 leading-tight'>{t('register_login.login')}</span>
            ) : (
              <span className='text-[13px] text-white ml-3 leading-tight'>
                <div>Xin chào</div>
                <div>{profile?.fullName ? profile.fullName : profile?.email.split('@')[0]}</div>
              </span>
            )}
          </div>
        </Tippy>
      </nav>
    </header>
  );
};

export default Header;
