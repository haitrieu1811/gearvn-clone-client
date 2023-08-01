import { UseQueryResult, useQuery } from '@tanstack/react-query';
import { AxiosResponse } from 'axios';
import { Dispatch, SetStateAction, createContext, useMemo, useState } from 'react';
import { Outlet } from 'react-router-dom';

import userApi from 'src/apis/user.api';
import AccountSidebar from 'src/layouts/components/AccountSidebar';
import { GetMeResponse, User } from 'src/types/user.type';

interface AccountContext {
  avatarFile: File[] | null;
  setAvatarFile: Dispatch<SetStateAction<File[] | null>>;
  getMeQuery: UseQueryResult<AxiosResponse<GetMeResponse, any>, unknown> | undefined;
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

  // Lấy thông tin tài khoản
  const getMeQuery = useQuery({
    queryKey: ['me'],
    queryFn: () => userApi.getMe()
  });

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
          <AccountSidebar />
        </div>
        <div className='col-span-12 lg:col-span-9'>
          <Outlet />
        </div>
      </div>
    </AccountContext.Provider>
  );
};

export default Account;
