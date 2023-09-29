import { useMutation, useQuery } from '@tanstack/react-query';
import isUndefined from 'lodash/isUndefined';
import keyBy from 'lodash/keyBy';
import omitBy from 'lodash/omitBy';
import moment from 'moment';
import { Fragment, useContext, useEffect, useMemo } from 'react';
import { toast } from 'react-toastify';

import orderApi from 'src/apis/order.api';
import Badge from 'src/components/Badge/Badge';
import Table from 'src/components/Table';
import { OrderStatus } from 'src/constants/enum';
import PATH from 'src/constants/path';
import { AppContext } from 'src/contexts/app.context';
import UseQueryParams from 'src/hooks/useQueryParams';
import { GetOrdersRequestParams } from 'src/types/order.type';
import { convertMomentFromNowToVietnamese } from 'src/utils/utils';

type QueryConfig = {
  [key in keyof GetOrdersRequestParams]: string;
};

export const orderStatus = {
  [OrderStatus.All]: <Badge name='Tất cả' />,
  [OrderStatus.New]: <Badge name='Mới' type='Primary' />,
  [OrderStatus.Processing]: <Badge name='Đang xử lý' type='Secondary' />,
  [OrderStatus.Delivering]: <Badge name='Đang giao' type='Warning' />,
  [OrderStatus.Succeed]: <Badge name='Thành công' type='Success' />,
  [OrderStatus.Canceled]: <Badge name='Đẫ hủy' type='Danger' />
};

const OrderList = () => {
  const queryParams: QueryConfig = UseQueryParams();
  const queryConfig: QueryConfig = omitBy(
    {
      page: queryParams.page || 1,
      limit: queryParams.limit || 20,
      status: queryParams.status
    },
    isUndefined
  );

  const { extendedOrders, setExtendedOrders } = useContext(AppContext);

  // Query: Lấy danh sách đơn hàng
  const getOrdersQuery = useQuery({
    queryKey: ['orders', queryConfig],
    queryFn: () => orderApi.getAll(queryConfig),
    keepPreviousData: true
  });

  // Danh sách đơn hàng
  const orders = useMemo(() => getOrdersQuery.data?.data.data.orders || [], [getOrdersQuery.data?.data.data.orders]);

  // Set giá trị mặc định cho extendedOrders
  useEffect(() => {
    if (!orders) return;
    setExtendedOrders((prevState) => {
      const extendedOrdersObj = keyBy(prevState, '_id');
      return orders.map((order) => ({
        ...order,
        checked: !!extendedOrdersObj[order._id]?.checked
      }));
    });
  }, [orders]);

  // Tổng số trang
  const pageSize = getOrdersQuery.data?.data.data.pagination.page_size || 0;

  // Mutation: Xóa đơn hàng
  const deleteOrderMutation = useMutation({
    mutationFn: orderApi.delete,
    onSuccess: (data) => {
      toast.success(data.data.message);
      getOrdersQuery.refetch();
    }
  });

  // Các cột trong bảng
  const columns = useMemo(
    () => [
      {
        field: 'customerName',
        headerName: 'Khách hàng',
        width: 10
      },
      {
        field: 'customerPhone',
        headerName: 'Số điện thoại',
        width: 10
      },
      {
        field: 'address',
        headerName: 'Địa chỉ nhận hàng',
        width: 30
      },
      {
        field: 'note',
        headerName: 'Ghi chú',
        width: 20
      },
      {
        field: 'status',
        headerName: 'Trạng thái',
        width: 10
      },
      {
        field: 'createdAt',
        headerName: 'Đặt lúc',
        width: 15
      }
    ],
    []
  );

  // Dữ liệu bảng
  const dataSource = useMemo(() => {
    return extendedOrders.map((order) => ({
      _id: order._id,
      checked: order.checked,
      customerName: <span className='capitalize'>{order.customer_name || ''}</span>,
      customerPhone: order.customer_phone || '',
      address: (
        <span className='capitalize'>
          {`${order.street}, ${order.ward}, ${order.district}, ${order.province}` || ''}
        </span>
      ),
      note: order.note || '',
      status: orderStatus[order.status as OrderStatus],
      createdAt: convertMomentFromNowToVietnamese(moment(order.created_at).fromNow())
    }));
  }, [extendedOrders]);

  return (
    <Fragment>
      <Table
        data={extendedOrders}
        setData={setExtendedOrders}
        columns={columns}
        dataSource={dataSource}
        pageSize={pageSize}
        isLoading={getOrdersQuery.isLoading}
        onDelete={(orderIds) => deleteOrderMutation.mutate(orderIds)}
        updateItemPath={PATH.DASHBOARD_ORDER_DETAIL_WITHOUT_ID}
      />
    </Fragment>
  );
};

export default OrderList;
