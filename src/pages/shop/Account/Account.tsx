import { useQuery } from '@tanstack/react-query';
import { Dispatch, Fragment, SetStateAction, createContext, useMemo, useState } from 'react';
import { useMediaQuery } from 'react-responsive';
import { Outlet } from 'react-router-dom';

import userApi from 'src/apis/user.api';
import Drawer from 'src/components/Drawer';
import { BarIcon } from 'src/components/Icons';
import CONFIG from 'src/constants/config';
import SidebarAccount from 'src/layouts/components/SidebarAccount';
import { User } from 'src/types/user.type';

interface AccountContext {
  avatarFile: File[] | null;
  setAvatarFile: Dispatch<SetStateAction<File[] | null>>;
  getMeQuery: ReturnType<typeof useQuery> | undefined;
  me: User | undefined;
}

export const AccountContext = createContext<AccountContext>({
  avatarFile: [],
  setAvatarFile: () => null,
  getMeQuery: undefined,
  me: undefined
});

const Account = () => {
  const isTablet = useMediaQuery({ maxWidth: CONFIG.TABLET_SCREEN_SIZE });
  const [avatarFile, setAvatarFile] = useState<File[] | null>(null);
  const [showAccountMenu, setShowAccountMenu] = useState<boolean>(false);

  // Lấy thông tin tài khoản
  const getMeQuery = useQuery({
    queryKey: ['me'],
    queryFn: () => userApi.getMe()
  });

  // Thông tin tài khoản
  const me = useMemo(() => getMeQuery.data?.data.data.user, [getMeQuery.data?.data.data.user]);

  return (
    <AccountContext.Provider
      value={{
        avatarFile,
        setAvatarFile,
        getMeQuery,
        me
      }}
    >
      <div className='lg:container my-2 lg:my-4 grid grid-cols-12 gap-2 lg:gap-4'>
        {isTablet && (
          <div className='col-span-12 flex justify-end'>
            <button
              onClick={() => setShowAccountMenu(true)}
              className='px-2 py-2 rounded border text-xs flex items-center bg-white'
            >
              <BarIcon className='w-2 h-2 mr-2' />
              Menu
            </button>
          </div>
        )}
        {!isTablet && (
          <div className='col-span-12 lg:col-span-3 bg-white rounded shadow-sm'>
            <SidebarAccount />
          </div>
        )}
        <div className='col-span-12 lg:col-span-9'>
          <Outlet />
        </div>
        {isTablet && (
          <Fragment>
            <Drawer isShow={showAccountMenu} onCancel={() => setShowAccountMenu(false)}>
              <SidebarAccount />
            </Drawer>
          </Fragment>
        )}
      </div>
    </AccountContext.Provider>
  );
};

export default Account;
