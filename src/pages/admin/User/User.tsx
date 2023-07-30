import { useQuery } from '@tanstack/react-query';
import isUndefined from 'lodash/isUndefined';
import omitBy from 'lodash/omitBy';
import moment from 'moment';
import { Fragment, useMemo } from 'react';
import { Link, createSearchParams, useNavigate } from 'react-router-dom';

import userApi from 'src/apis/user.api';
import fallbackAvatar from 'src/assets/images/fallback-avatar.jpg';
import notFound from 'src/assets/images/not-found.jpg';
import Badge from 'src/components/Badge';
import Checkbox from 'src/components/Checkbox';
import { PencilIcon, TrashIcon } from 'src/components/Icons';
import Pagination from 'src/components/Pagination';
import RadioGroup from 'src/components/RadioGroup';
import Select from 'src/components/Select';
import CLASSES from 'src/constants/classes';
import { Gender, UserRole, UserStatus } from 'src/constants/enum';
import PATH from 'src/constants/path';
import UseQueryParams from 'src/hooks/useQueryParams';
import { GetUsersParams } from 'src/types/user.type';
import { getImageUrl } from 'src/utils/utils';
import { GENDERS, LIMIT_OPTIONS, ROLES } from './constants';

export type QueryConfig = {
  [key in keyof GetUsersParams]: string;
};

const User = () => {
  const navigate = useNavigate();
  const queryParams: QueryConfig = UseQueryParams();
  const queryConfig: QueryConfig = omitBy(
    {
      page: queryParams.page || '1',
      limit: queryParams.limit || 10,
      gender: queryParams.gender,
      status: queryParams.status,
      role: queryParams.role
    },
    isUndefined
  );

  const getUsersQuery = useQuery({
    queryKey: ['users_list', queryConfig],
    queryFn: () => userApi.getList(queryConfig),
    keepPreviousData: true
  });

  const users = useMemo(() => getUsersQuery.data?.data.data.users, [getUsersQuery.data]);
  const pageSize = useMemo(() => getUsersQuery.data?.data.data.pagination.page_size, [getUsersQuery.data]);

  const filterGender = (value: any) => {
    navigate({
      pathname: PATH.DASHBOARD_USER,
      search: createSearchParams({
        ...queryConfig,
        gender: value.toString()
      }).toString()
    });
  };

  const filterRole = (value: any) => {
    navigate({
      pathname: PATH.DASHBOARD_USER,
      search: createSearchParams({
        ...queryConfig,
        role: value.toString()
      }).toString()
    });
  };

  const handleChangeLimit = (limit: string) => {
    navigate({
      pathname: PATH.DASHBOARD_USER,
      search: createSearchParams({
        ...queryConfig,
        limit
      }).toString()
    });
  };

  return (
    <Fragment>
      <div className='flex justify-between items-center mb-4 bg-white p-4 rounded shadow-sm'>
        <div className='flex items-center'>
          <RadioGroup field='gender' onChange={filterGender} radios={GENDERS} />
          <RadioGroup field='role' classNameWrapper='ml-6' onChange={filterRole} radios={ROLES} />
        </div>
        <Link
          to={PATH.DASHBOARD_CATEGORY_CREATE}
          className='px-2 py-[6px] rounded bg-blue-600 flex justify-center items-center'
        >
          <span className='text-white text-sm font-medium'>Tạo mới</span>
        </Link>
      </div>
      {users && users.length > 0 && (
        <div className='bg-white rounded-lg shadow-sm overflow-hidden'>
          {/* Head */}
          <div className={CLASSES.TABLE_HEAD}>
            <div className='col-span-1'>
              <Checkbox />
            </div>
            <div className='col-span-5'>Tài khoản</div>
            <div className='col-span-1'>Giới tính</div>
            <div className='col-span-1'>Loại</div>
            <div className='col-span-1'>Trạng thái</div>
            <div className='col-span-1'>Tạo lúc</div>
            <div className='col-span-1'>Cập nhật</div>
            <div className='col-span-1'>Thao tác</div>
          </div>
          {users?.map((user) => (
            <div key={user._id} className={CLASSES.TABLE_BODY}>
              <div className='col-span-1 flex items-center'>
                <Checkbox />
              </div>
              <div className='col-span-5 flex items-center'>
                <img
                  src={getImageUrl(user.avatar) || fallbackAvatar}
                  alt={user.email}
                  className='w-7 h-7 object-cover rounded-sm'
                />
                <span className='ml-4'>{user.email}</span>
              </div>
              <div className='col-span-1 flex items-center'>
                {user.gender === Gender.Male && 'Nam'}
                {user.gender === Gender.Female && 'Nữ'}
                {user.gender === Gender.Other && 'Khác'}
              </div>
              <div className='col-span-1 flex items-center'>
                {user.role === UserRole.Customer && <Badge name='Khách hàng' />}
                {user.role === UserRole.Seller && <Badge name='Nhân viên' type='Warning' />}
              </div>
              <div className='col-span-1 flex items-center'>
                {user.status === UserStatus.Active && <Badge name='Hoạt động' type='Success' />}
                {user.status === UserStatus.Banned && <Badge name='Đã khóa' type='Danger' />}
              </div>
              <div className='col-span-1 flex items-center'>{moment(user.created_at).fromNow()}</div>
              <div className='col-span-1 flex items-center'>{moment(user.updated_at).fromNow()}</div>
              <div className='col-span-1 flex items-center'>
                <button className='p-1'>
                  <PencilIcon className='w-4 h-4 stroke-slate-500' />
                </button>
                <button className='p-1'>
                  <TrashIcon className='w-4 h-4 stroke-slate-500' />
                </button>
              </div>
            </div>
          ))}
          <div className={CLASSES.TABLE_FOOT}>
            <div></div>
            <div className='flex items-center'>
              <Select options={LIMIT_OPTIONS} classNameWrapper='mr-3' onChange={handleChangeLimit} />
              {pageSize && queryConfig && <Pagination pageSize={pageSize} />}
            </div>
          </div>
        </div>
      )}
      {users && users.length <= 0 && (
        <div className='bg-white min-h-screen rounded-lg flex justify-center items-center'>
          <img src={notFound} alt='404 Not Found' className='w-[40%]' />
        </div>
      )}
    </Fragment>
  );
};

export default User;
