import { useQuery } from '@tanstack/react-query';
import isUndefined from 'lodash/isUndefined';
import omitBy from 'lodash/omitBy';
import moment from 'moment';
import { Fragment, useMemo } from 'react';

import userApi from 'src/apis/user.api';
import fallbackAvatar from 'src/assets/images/fallback-avatar.jpg';
import Checkbox from 'src/components/Checkbox';
import Table from 'src/components/Table';
import { UserStatus } from 'src/constants/enum';
import UseQueryParams from 'src/hooks/useQueryParams';
import { PaginationRequestParams } from 'src/types/utils.type';
import { convertMomentFromNowToVietnamese, formatCurrency, getImageUrl } from 'src/utils/utils';

export type QueryConfig = {
  [key in keyof PaginationRequestParams]: string;
};

const List = () => {
  const queryParams: QueryConfig = UseQueryParams();
  const queryConfig: QueryConfig = omitBy(
    {
      page: queryParams.page || '1',
      limit: queryParams.limit || '10'
    },
    isUndefined
  );

  // Query: Lấy danh sách khách hàng
  const getCustomersQuery = useQuery({
    queryKey: ['customers', queryConfig],
    queryFn: () => userApi.getCustomers(queryConfig),
    keepPreviousData: true
  });

  // Danh sách khách hàng
  const customers = useMemo(() => getCustomersQuery.data?.data.data.customers || [], [getCustomersQuery.data]);

  // Số lượng trang của danh sách khách hàng
  const pageSize = useMemo(() => getCustomersQuery.data?.data.data.pagination.page_size || 0, [getCustomersQuery.data]);

  // Tổng số lượng khách hàng
  const customersTotal = useMemo(
    () => getCustomersQuery.data?.data.data.pagination.total || 0,
    [getCustomersQuery.data]
  );

  return (
    <Fragment>
      <Table
        tableName='Danh sách khách hàng'
        totalRows={customersTotal}
        data={customers}
        columns={[
          {
            field: 'checkbox',
            headerName: <Checkbox />,
            width: 5
          },
          {
            field: 'name',
            headerName: 'Khách hàng',
            width: 25
          },
          {
            field: 'ordersCount',
            headerName: 'Tổng đơn hàng',
            width: 15
          },
          {
            field: 'succeedOrdersTotal',
            headerName: 'Đã thanh toán',
            width: 15
          },
          {
            field: 'addressesCount',
            headerName: 'Số địa chỉ',
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
          customers.map((customers) => ({
            checkbox: <Checkbox />,
            name: (
              <div className='flex items-center'>
                <img
                  src={customers.avatar ? getImageUrl(customers.avatar) : fallbackAvatar}
                  alt={customers.email}
                  className='w-7 h-7 object-cover rounded-full'
                />
                <span className='ml-4'>{customers.fullname}</span>
              </div>
            ),
            addressesCount: `${customers.addresses_count} địa chỉ`,
            status: customers.status === UserStatus.Active ? 'Hoạt động' : 'Đã khóa',
            succeedOrdersTotal: `${formatCurrency(customers.succeed_orders_total)}`,
            ordersCount: `${customers.orders_count} đơn hàng`,
            createdAt: convertMomentFromNowToVietnamese(moment(customers.created_at).fromNow()),
            updatedAt: convertMomentFromNowToVietnamese(moment(customers.updated_at).fromNow())
          })) || []
        }
        tableFootLeft={<div></div>}
        pageSize={pageSize}
      />
    </Fragment>
  );
};

export default List;
