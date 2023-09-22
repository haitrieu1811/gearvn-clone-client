import { useQuery } from '@tanstack/react-query';
import { Dispatch, SetStateAction, createContext, useMemo, useState } from 'react';
import { Outlet } from 'react-router-dom';

import userApi from 'src/apis/user.api';
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
  const [avatarFile, setAvatarFile] = useState<File[] | null>(null);

  // Query: Lấy thông tin tài khoản
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
        <div className='col-span-12 lg:col-span-3 bg-white rounded shadow-sm'>
          <SidebarAccount />
        </div>

        {/* Nội dung */}
        <div className='col-span-12 lg:col-span-9'>
          <Outlet />
        </div>
      </div>
    </AccountContext.Provider>
  );
};

export default Account;
