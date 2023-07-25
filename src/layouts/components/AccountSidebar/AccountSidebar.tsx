import classNames from 'classnames';
import { Fragment, useContext } from 'react';
import { NavLink } from 'react-router-dom';
import { useMutation } from '@tanstack/react-query';

import {
  DefaultUserIcon,
  EyeFillIcon,
  LocationFillIcon,
  LogoutFillIcon,
  OrderFillIcon,
  UserFillIcon
} from 'src/components/Icons';
import PATH from 'src/constants/path';
import authApi from 'src/apis/auth.api';
import { AppContext } from 'src/contexts/app.context';

const AccountSidebar = () => {
  const { setIsAuthenticated, setProfile } = useContext(AppContext);

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
    <Fragment>
      <div className='p-4 border-b border-[#cfcfcf] flex items-center mb-[6px]'>
        <DefaultUserIcon className='w-12 h-12' />
        <span className='ml-6 text-lg font-semibold'>Trần Hải Triều</span>
      </div>
      <div>
        <NavLink
          to={PATH.ACCOUNT_PROFILE}
          className={({ isActive }) =>
            classNames('flex items-center py-3 px-[20px]', {
              'text-primary font-semibold': isActive,
              'hover:text-primary': !isActive
            })
          }
        >
          <UserFillIcon className='w-[18px] h-[18px] mr-3' />
          <span>Thông tin tài khoản</span>
        </NavLink>
        <NavLink
          to={PATH.ACCOUNT_ADDRESS}
          className={({ isActive }) =>
            classNames('flex items-center py-3 px-[20px]', {
              'text-primary font-semibold': isActive,
              'hover:text-primary': !isActive
            })
          }
        >
          <LocationFillIcon className='w-[18px] h-[18px] mr-3' />
          <span>Sổ địa chỉ</span>
        </NavLink>
        <NavLink
          to={PATH.ACCOUNT_ORDER}
          className={({ isActive }) =>
            classNames('flex items-center py-3 px-[20px]', {
              'text-primary font-semibold': isActive,
              'hover:text-primary': !isActive
            })
          }
        >
          <OrderFillIcon className='w-[18px] h-[18px] mr-3' />
          <span>Quản lý đơn hàng</span>
        </NavLink>
        <NavLink
          to={PATH.ACCOUNT_VIEWED_PRODUCT}
          className={({ isActive }) =>
            classNames('flex items-center py-3 px-[20px]', {
              'text-primary font-semibold': isActive,
              'hover:text-primary': !isActive
            })
          }
        >
          <EyeFillIcon className='w-[18px] h-[18px] mr-3' />
          <span>Sản phẩm đã xem</span>
        </NavLink>
        <button className={classNames('flex items-center w-full py-3 px-[20px] hover:text-primary')} onClick={logout}>
          <LogoutFillIcon className='w-[18px] h-[18px] mr-3' />
          <span>Đăng xuất</span>
        </button>
      </div>
    </Fragment>
  );
};

export default AccountSidebar;
