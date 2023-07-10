import { useQuery } from '@tanstack/react-query';
import isUndefined from 'lodash/isUndefined';
import omitBy from 'lodash/omitBy';
import { useMemo } from 'react';
import moment from 'moment';

import userApi from 'src/apis/user.api';
import Badge from 'src/components/Badge';
import Checkbox from 'src/components/Checkbox';
import { PencilIcon, TrashIcon } from 'src/components/Icons';
import Pagination from 'src/components/Pagination';
import { UserRole, UserStatus } from 'src/constants/enum';
import UseQueryParams from 'src/hooks/useQueryParams';
import { GetUsersParams } from 'src/types/user.type';
import fallbackAvatar from 'src/assets/images/fallback-avatar.jpg';
import PATH from 'src/constants/path';

export type QueryConfig = {
  [key in keyof GetUsersParams]: string;
};

const User = () => {
  const queryParams: QueryConfig = UseQueryParams();
  const queryConfig: QueryConfig = omitBy(
    {
      page: queryParams.page || '1',
      limit: queryParams.limit || 10
    },
    isUndefined
  );

  const getUsersQuery = useQuery({
    queryKey: ['users_list', queryConfig],
    queryFn: () => userApi.getList(queryConfig),
    keepPreviousData: true
  });

  const users = useMemo(() => getUsersQuery.data?.data.data.users, [getUsersQuery.data?.data.data.users]);
  const pageSize = useMemo(
    () => getUsersQuery.data?.data.data.pagination.page_size,
    [getUsersQuery.data?.data.data.pagination.page_size]
  );

  return (
    <div>
      <div className='bg-white rounded-lg shadow-sm'>
        {/* Head */}
        <div className='grid grid-cols-12 font-semibold py-6 px-8 border-b'>
          <div className='col-span-1'>
            <Checkbox />
          </div>
          <div className='col-span-4'>Tài khoản</div>
          <div className='col-span-2'>Loại</div>
          <div className='col-span-2'>Trạng thái</div>
          <div className='col-span-2'>Cập nhật</div>
          <div className='col-span-1'>Thao tác</div>
        </div>
        {users?.map((user) => (
          <div
            key={user._id}
            className='grid grid-cols-12 py-4 px-8 border-b border-b-slate-100 text-slate-500 text-[15px]'
          >
            <div className='col-span-1 flex items-center'>
              <Checkbox />
            </div>
            <div className='col-span-4 flex items-center'>
              <img src={user.avatar || fallbackAvatar} alt={user.email} className='w-9 h-9 object-cover rounded-full' />
              <span className='ml-4'>{user.email}</span>
            </div>
            <div className='col-span-2 flex items-center'>
              {user.role === UserRole.Customer && <Badge name='Khách hàng' />}
              {user.role === UserRole.Seller && <Badge name='Nhân viên' type='Warning' />}
            </div>
            <div className='col-span-2 flex items-center'>
              {user.status === UserStatus.Active && <Badge name='Hoạt động' type='Success' />}
              {user.status === UserStatus.Banned && <Badge name='Đã khóa' type='Danger' />}
            </div>
            <div className='col-span-2 flex items-center'>{moment(user.updated_at).fromNow()}</div>
            <div className='col-span-1 flex items-center'>
              <button className='rounded hover:bg-slate-200/50 p-2'>
                <PencilIcon className='w-4 h-4 stroke-slate-500' />
              </button>
              <button className='rounded hover:bg-slate-200/50 p-2 ml-1'>
                <TrashIcon className='w-4 h-4 stroke-slate-500' />
              </button>
            </div>
          </div>
        ))}
        <Pagination pageSize={pageSize as number} queryConfig={queryConfig} path={PATH.DASHBOARD_USER} />
      </div>
    </div>
  );
};

export default User;
