import { useQuery } from '@tanstack/react-query';
import isUndefined from 'lodash/isUndefined';
import omitBy from 'lodash/omitBy';
import moment from 'moment';
import { Fragment, useMemo } from 'react';

import userApi from 'src/apis/user.api';
import fallbackAvatar from 'src/assets/images/fallback-avatar.jpg';
import Checkbox from 'src/components/Checkbox';
import Table from 'src/components/Table';
import { UserRole, UserStatus } from 'src/constants/enum';
import UseQueryParams from 'src/hooks/useQueryParams';
import { GetUsersParams } from 'src/types/user.type';
import { convertMomentFromNowToVietnamese, getImageUrl } from 'src/utils/utils';

export type QueryConfig = {
  [key in keyof GetUsersParams]: string;
};

const List = () => {
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

  // Query: Lấy danh sách tài khoản
  const getUsersQuery = useQuery({
    queryKey: ['users_list', queryConfig],
    queryFn: () => userApi.getList(queryConfig),
    keepPreviousData: true
  });

  // Danh sách tài khoản
  const users = useMemo(() => getUsersQuery.data?.data.data.users, [getUsersQuery.data]);

  // Số lượng tài khoản
  const pageSize = useMemo(() => getUsersQuery.data?.data.data.pagination.page_size, [getUsersQuery.data]);

  return (
    <Fragment>
      <Table
        tableName='Danh sách tài khoản'
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
            width: 35
          },
          {
            field: 'fullName',
            headerName: 'Họ tên',
            width: 20
          },
          {
            field: 'type',
            headerName: 'Loại',
            width: 10
          },
          {
            field: 'status',
            headerName: 'Trạng thái',
            width: 10
          },
          {
            field: 'createdAt',
            headerName: 'Tạo lúc',
            width: 10
          },
          {
            field: 'updatedAt',
            headerName: 'Cập nhật',
            width: 10
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
                  className='w-7 h-7 object-cover rounded-full'
                />
                <span className='ml-4'>{user.email}</span>
              </div>
            ),
            fullName: user.fullName,
            type: user.role === UserRole.Customer ? 'Khách hàng' : 'Nhân viên',
            status: user.status === UserStatus.Active ? 'Hoạt động' : 'Đã khóa',
            createdAt: convertMomentFromNowToVietnamese(moment(user.created_at).fromNow()),
            updatedAt: convertMomentFromNowToVietnamese(moment(user.updated_at).fromNow())
          })) || []
        }
        tableFootLeft={<div></div>}
        pageSize={pageSize || 0}
      />
    </Fragment>
  );
};

export default List;
