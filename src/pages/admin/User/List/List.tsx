import { useQuery } from '@tanstack/react-query';
import isUndefined from 'lodash/isUndefined';
import omitBy from 'lodash/omitBy';
import moment from 'moment';
import { Fragment, useMemo } from 'react';
import { Link, createSearchParams, useNavigate } from 'react-router-dom';

import userApi from 'src/apis/user.api';
import fallbackAvatar from 'src/assets/images/fallback-avatar.jpg';
import Checkbox from 'src/components/Checkbox';
import RadioGroup from 'src/components/RadioGroup';
import Table from 'src/components/Table';
import TableAction from 'src/components/Table/TableAction/TableAction';
import { Gender, UserRole, UserStatus } from 'src/constants/enum';
import PATH from 'src/constants/path';
import UseQueryParams from 'src/hooks/useQueryParams';
import { GetUsersParams } from 'src/types/user.type';
import { convertMomentFromNowToVietnamese, getImageUrl } from 'src/utils/utils';
import { GENDERS, ROLES } from './constants';

export type QueryConfig = {
  [key in keyof GetUsersParams]: string;
};

const genders = {
  [Gender.Male]: 'Nam',
  [Gender.Female]: 'Nữ',
  [Gender.Other]: 'Khác'
};

const List = () => {
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

      <Table
        totalRows={getUsersQuery.data?.data.data.pagination.total || 0}
        data={users || []}
        columns={[
          {
            field: 'checkbox',
            headerName: <Checkbox />,
            width: 5
          },
          {
            field: 'name',
            headerName: 'Tên tài khoản',
            width: 5
          },
          {
            field: 'gender',
            headerName: 'Giới tính',
            width: 5
          },
          {
            field: 'type',
            headerName: 'Loại',
            width: 5
          },
          {
            field: 'status',
            headerName: 'Trạng thái',
            width: 5
          },
          {
            field: 'createdAt',
            headerName: 'Tạo lúc',
            width: 5
          },
          {
            field: 'updatedAt',
            headerName: 'Cập nhật',
            width: 5
          }
        ]}
        rows={
          users?.map((user) => ({
            checkbox: <Checkbox />,
            name: (
              <div className='flex items-center'>
                <img
                  src={user.avatar ? getImageUrl(user.avatar) : fallbackAvatar}
                  alt={user.email}
                  className='w-6 h-6 object-cover rounded-full'
                />
                <span className='ml-4'>{user.email}</span>
              </div>
            ),
            gender: genders[user.gender],
            type: user.role === UserRole.Customer ? 'Khách hàng' : 'Nhân viên',
            status: user.status === UserStatus.Active ? 'Hoạt động' : 'Đã khóa',
            createdAt: convertMomentFromNowToVietnamese(moment(user.created_at).fromNow()),
            updatedAt: convertMomentFromNowToVietnamese(moment(user.updated_at).fromNow()),
            actions: (
              <TableAction
                editPath={`${PATH.DASHBOARD_PRODUCT_UPDATE_WITHOUT_ID}/${user._id}`}
                deleteMethod={() => null}
              />
            )
          })) || []
        }
        tableFootLeft={<div></div>}
        pageSize={pageSize || 0}
      />
    </Fragment>
  );
};

export default List;
