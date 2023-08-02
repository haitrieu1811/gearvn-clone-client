import { useMutation } from '@tanstack/react-query';
import classNames from 'classnames';
import { Fragment, useContext, useMemo } from 'react';
import { NavLink } from 'react-router-dom';

import authApi from 'src/apis/auth.api';
import {
  DefaultUserIcon,
  EyeFillIcon,
  LocationFillIcon,
  LogoutFillIcon,
  OrderFillIcon,
  PencilIcon,
  UserFillIcon
} from 'src/components/Icons';
import InputFile from 'src/components/InputFile';
import PATH from 'src/constants/path';
import { AppContext } from 'src/contexts/app.context';
import { AccountContext } from 'src/pages/shop/Account/Account';
import { getImageUrl } from 'src/utils/utils';

const AccountSidebar = () => {
  const { setIsAuthenticated, setProfile } = useContext(AppContext);
  const { avatarFile, setAvatarFile, me } = useContext(AccountContext);

  const avatarPreview = useMemo(() => (avatarFile ? URL.createObjectURL(avatarFile[0]) : null), [avatarFile]);
  const avatar = useMemo(() => me?.avatar, [me]);

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

  // Xử lý khi đổi ảnh đại diện
  const handleChangeAvatar = (files?: File[]) => {
    setAvatarFile(files || null);
  };

  return (
    <Fragment>
      {me && (
        <form className='p-4 border-b border-[#cfcfcf] flex items-center mb-[6px]'>
          <div className='relative w-10 h-10 md:w-12 md:h-12 rounded-full overflow-hidden group flex-shrink-0'>
            {!avatar && !avatarPreview && <DefaultUserIcon className='w-full h-full' />}
            {(avatar || avatarPreview) && (
              <img
                src={avatarPreview || getImageUrl(avatar || '')}
                className='w-full h-full object-cover'
                alt={me.fullName}
              />
            )}
            <InputFile onChange={handleChangeAvatar}>
              <span className='absolute top-0 left-0 w-full h-full flex justify-center items-center bg-black/20 rounded-full opacity-0 pointer-events-none group-hover:opacity-100 group-hover:pointer-events-auto'>
                <PencilIcon className='w-4 h-4 stroke-white' />
              </span>
            </InputFile>
          </div>
          <span className='ml-3 md:ml-6 text-base md:text-lg font-semibold line-clamp-1 capitalize'>
            {me.fullName ? me.fullName : me.email.split('@')[0]}
          </span>
        </form>
      )}

      <div>
        <NavLink
          to={PATH.ACCOUNT_PROFILE}
          className={({ isActive }) =>
            classNames('flex items-center py-3 px-[20px] text-sm md:text-base', {
              'text-primary font-semibold groupactive': isActive,
              'hover:text-primary': !isActive
            })
          }
        >
          <UserFillIcon className='w-[14px] h-[14px] md:w-[18px] md:h-[18px] mr-3 fill-[#535353] group-[active]:fill-primary' />
          Thông tin tài khoản
        </NavLink>
        <NavLink
          to={PATH.ACCOUNT_ADDRESS}
          className={({ isActive }) =>
            classNames('flex items-center py-3 px-[20px] text-sm md:text-base', {
              'text-primary font-semibold groupactive': isActive,
              'hover:text-primary': !isActive
            })
          }
        >
          <LocationFillIcon className='w-[14px] h-[14px] md:w-[18px] md:h-[18px] mr-3 fill-[#535353] group-[active]:fill-primary group-[active]:' />
          Sổ địa chỉ
        </NavLink>
        <NavLink
          to={PATH.ACCOUNT_ORDER}
          className={({ isActive }) =>
            classNames('flex items-center py-3 px-[20px] text-sm md:text-base', {
              'text-primary font-semibold groupactive': isActive,
              'hover:text-primary': !isActive
            })
          }
        >
          <OrderFillIcon className='w-[14px] h-[14px] md:w-[18px] md:h-[18px] mr-3 fill-[#535353] group-[active]:fill-primary' />
          Quản lý đơn hàng
        </NavLink>
        <NavLink
          to={PATH.ACCOUNT_VIEWED_PRODUCT}
          className={({ isActive }) =>
            classNames('flex items-center py-3 px-[20px] text-sm md:text-base', {
              'text-primary font-semibold groupactive': isActive,
              'hover:text-primary': !isActive
            })
          }
        >
          <EyeFillIcon className='w-[14px] h-[14px] md:w-[18px] md:h-[18px] mr-3 fill-[#535353] group-[active]:fill-primary' />
          Sản phẩm đã xem
        </NavLink>
        <button
          className={classNames('flex items-center w-full py-3 px-[20px] text-sm md:text-base hover:text-primary')}
          onClick={logout}
        >
          <LogoutFillIcon className='w-[14px] h-[14px] md:w-[18px] md:h-[18px] mr-3' />
          Đăng xuất
        </button>
      </div>
    </Fragment>
  );
};

export default AccountSidebar;
