import { useMutation, useQuery } from '@tanstack/react-query';
import isUndefined from 'lodash/isUndefined';
import keyBy from 'lodash/keyBy';
import omitBy from 'lodash/omitBy';
import moment from 'moment';
import { useContext, useEffect, useMemo } from 'react';
import { toast } from 'react-toastify';

import userApi from 'src/apis/user.api';
import fallbackAvatar from 'src/assets/images/fallback-avatar.jpg';
import Table from 'src/components/Table';
import { UserStatus } from 'src/constants/enum';
import { AppContext } from 'src/contexts/app.context';
import UseQueryParams from 'src/hooks/useQueryParams';
import { PaginationRequestParams } from 'src/types/utils.type';
import { convertMomentFromNowToVietnamese, formatCurrency, getImageUrl } from 'src/utils/utils';

export type QueryConfig = {
  [key in keyof PaginationRequestParams]: string;
};

const CustomerList = () => {
  const { extendedCustomers, setExtendedCustomers } = useContext(AppContext);
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

  // Set giá trị mặc định cho extendedCustomers
  useEffect(() => {
    if (!customers) return;
    setExtendedCustomers((prevState) => {
      const extendedUsersObj = keyBy(prevState, '_id');
      return customers.map((customer) => ({
        ...customer,
        checked: !!extendedUsersObj[customer._id]?.checked
      }));
    });
  }, [customers]);

  // Số lượng trang của danh sách khách hàng
  const pageSize = useMemo(
    () => getCustomersQuery.data?.data.data.pagination.page_size || 0,
    [getCustomersQuery.data?.data.data.pagination.page_size]
  );

  // Mutation: Xóa người dùng
  const deleteUsersMutation = useMutation({
    mutationFn: userApi.deleteUsers,
    onSuccess: (data) => {
      toast.success(data.data.message);
      getCustomersQuery.refetch();
    }
  });

  // Cột của bảng
  const columns = useMemo(
    () => [
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
    ],
    []
  );

  // Dữ liệu của bảng
  const dataSource = useMemo(() => {
    return extendedCustomers.map((customer) => ({
      _id: customer._id,
      checked: customer.checked,
      name: (
        <div className='flex items-center'>
          <img
            src={customer.avatar ? getImageUrl(customer.avatar) : fallbackAvatar}
            alt={customer.email}
            className='w-7 h-7 object-cover rounded-full'
          />
          <span className='ml-4'>{customer.fullname}</span>
        </div>
      ),
      addressesCount: `${customer.addresses_count} địa chỉ`,
      status: customer.status === UserStatus.Active ? 'Hoạt động' : 'Đã khóa',
      succeedOrdersTotal: `${formatCurrency(customer.succeed_orders_total)}`,
      ordersCount: `${customer.orders_count} đơn hàng`,
      createdAt: convertMomentFromNowToVietnamese(moment(customer.created_at).fromNow()),
      updatedAt: convertMomentFromNowToVietnamese(moment(customer.updated_at).fromNow())
    }));
  }, [extendedCustomers]);

  return (
    <Table
      data={extendedCustomers}
      setData={setExtendedCustomers}
      columns={columns}
      dataSource={dataSource}
      pageSize={pageSize}
      isLoading={getCustomersQuery.isLoading}
      onDelete={(userIds) => deleteUsersMutation.mutate({ user_ids: userIds })}
    />
  );
};

export default CustomerList;
