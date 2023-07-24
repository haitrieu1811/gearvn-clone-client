import { useMutation } from '@tanstack/react-query';
import Tippy from '@tippyjs/react/headless';
import { useContext } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';

import authApi from 'src/apis/auth.api';
import logo from 'src/assets/images/logo-white.svg';
import {
  BarIcon,
  CartIcon,
  ChartPieIcon,
  HandIcon,
  HotlineIcon,
  LocationIcon,
  LogoutIcon,
  PurchaseIcon,
  SearchIcon,
  UserIcon,
  ViewedIcon
} from 'src/components/Icons';
import Wrapper from 'src/components/Wrapper';
import { UserRole } from 'src/constants/enum';
import PATH from 'src/constants/path';
import { AppContext } from 'src/contexts/app.context';
import HeaderAction from './HeaderAction';

const Header = () => {
  const { t } = useTranslation('pages');
  const { isAuthenticated, setIsAuthenticated, profile, setProfile } = useContext(AppContext);

  const renderUserMenu = () => {
    return (
      <Wrapper arrow>
        {!isAuthenticated ? (
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
        ) : (
          <div className='min-w-[300px]'>
            <Link to={PATH.ACCOUNT_PROFILE} className='px-5 py-4 flex hover:underline border-b'>
              <HandIcon className='w-5 h-5' />
              <span className='ml-4 text-sm font-semibold'>
                Xin chào, {profile?.fullName ? profile.fullName : profile?.email.split('@')[0]}
              </span>
            </Link>
            {profile?.role !== UserRole.Customer && (
              <Link to={PATH.DASHBOARD} className='px-5 py-3 flex hover:underline'>
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
    <header className='sticky top-0 left-0 right-0 z-[99999]'>
      <div className='bg-primary'>
        <nav className='container py-4 flex justify-between items-center'>
          <Link to={PATH.HOME} className='inline'>
            <img src={logo} alt='Logo' className='w-[140px]' />
          </Link>

          <div className='ml-4 h-[42px] bg-[#BE1529] px-2 py-1 flex items-center justify-center rounded cursor-pointer font-semibold'>
            <BarIcon />
            <span className='text-white text-sm ml-3'>Danh mục</span>
          </div>

          <div className='relative flex-1 ml-2'>
            <input
              type='text'
              placeholder='Bạn cần tìm gì'
              className='w-full py-2 pl-[15px] pr-[50px] rounded outline-none text-[15px]'
            />
            <button className='absolute top-0 right-0 h-full w-9 flex justify-center items-center'>
              <SearchIcon className='fill-white w-4 h-4' />
            </button>
          </div>

          <HeaderAction icon={<HotlineIcon className='w-[18px]' />} textAbove='Hotline' textBelow='1800.6975' />
          <HeaderAction icon={<LocationIcon className='w-[18px]' />} textAbove='Hệ thống' textBelow='Showroom' />
          <HeaderAction
            icon={<PurchaseIcon className='w-[18px] fill-white' />}
            textAbove='Tra cứu'
            textBelow='đơn hàng'
          />
          <HeaderAction
            icon={
              <div className='relative'>
                <CartIcon className='w-[18px]' />
                <span className='absolute -top-2 -right-2 bg-[#FDD835] text-[9px] w-4 h-4 rounded-full flex items-center justify-center font-bold border-[2px] border-white'>
                  2
                </span>
              </div>
            }
            textAbove='Giỏ'
            textBelow='hàng'
          />

          <Tippy placement='bottom-end' render={renderUserMenu} offset={[0, 15]} interactive>
            <div className='h-[42px] bg-[#BE1529] flex items-center justify-center p-2 rounded cursor-pointer ml-4'>
              <UserIcon className='w-5 h-5 flex-shrink-0 stroke-white' />
              {!isAuthenticated ? (
                <span className='text-[13px] text-white ml-3 leading-tight font-semibold'>
                  <div>Đăng</div>
                  <div>nhập</div>
                </span>
              ) : (
                <span className='text-[13px] text-white ml-3 leading-tight font-semibold'>
                  <div>Xin chào</div>
                  <div>{profile?.fullName ? profile.fullName : profile?.email.split('@')[0]}</div>
                </span>
              )}
            </div>
          </Tippy>
        </nav>
      </div>
    </header>
  );
};

export default Header;
