import { useMutation, useQuery } from '@tanstack/react-query';
import isUndefined from 'lodash/isUndefined';
import omitBy from 'lodash/omitBy';
import moment from 'moment';
import { Fragment, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

import orderApi from 'src/apis/order.api';
import Badge from 'src/components/Badge/Badge';
import ContextMenu from 'src/components/ContextMenu';
import { EyeIcon, TrashIcon } from 'src/components/Icons';
import Modal from 'src/components/Modal/Modal';
import Table from 'src/components/Table';
import { OrderStatus } from 'src/constants/enum';
import PATH from 'src/constants/path';
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
  const navigate = useNavigate();
  const [currentId, setCurrentId] = useState<string | null>(null);
  const queryParams: QueryConfig = UseQueryParams();
  const queryConfig: QueryConfig = omitBy(
    {
      page: queryParams.page || 1,
      limit: queryParams.limit || 20,
      status: queryParams.status
    },
    isUndefined
  );

  // Query: Lấy danh sách đơn hàng
  const getOrdersQuery = useQuery({
    queryKey: ['orders', queryConfig],
    queryFn: () => orderApi.getAll(queryConfig),
    keepPreviousData: true
  });

  // Danh sách đơn hàng
  const orders = useMemo(() => getOrdersQuery.data?.data.data.orders, [getOrdersQuery.data?.data.data.orders]);

  // Tổng số đơn hàng
  const total = getOrdersQuery.data?.data.data.pagination.total;

  // Tổng số trang
  const pageSize = getOrdersQuery.data?.data.data.pagination.page_size;

  // Bắt đầu xóa
  const startDelete = (orderId: string) => {
    setCurrentId(orderId);
  };

  // Dừng xóa
  const stopDelete = () => {
    setCurrentId(null);
  };

  // Xóa đơn hàng
  const deleteOrderMutation = useMutation({
    mutationFn: orderApi.delete,
    onSuccess: (data) => {
      toast.success(data.data.message);
      getOrdersQuery.refetch();
      stopDelete();
    }
  });

  // Xác nhận xóa
  const handleDelete = () => {
    if (currentId) deleteOrderMutation.mutate([currentId]);
  };

  return (
    <Fragment>
      <Table
        totalRows={total || 0}
        tableName='Danh sách đơn hàng'
        data={orders || []}
        columns={[
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
          },
          {
            field: 'actions',
            headerName: '',
            width: 5
          }
        ]}
        rows={
          orders?.map((order) => ({
            customerName: <span className='capitalize'>{order.customer_name || ''}</span>,
            customerPhone: order.customer_phone || '',
            address: (
              <span className='capitalize'>
                {`${order.street}, ${order.ward}, ${order.district}, ${order.province}` || ''}
              </span>
            ),
            note: order.note || '',
            status: orderStatus[order.status as OrderStatus],
            createdAt: convertMomentFromNowToVietnamese(moment(order.created_at).fromNow()),
            actions: (
              <ContextMenu
                items={[
                  {
                    icon: <EyeIcon className='w-4 h-4 mr-3' />,
                    label: 'Chi tiết đơn hàng',
                    onClick: () => navigate(`${PATH.DASHBOARD_ORDER_DETAIL_WITHOUT_ID}/${order._id}`)
                  },
                  {
                    icon: <TrashIcon className='w-4 h-4 mr-3' />,
                    label: 'Xóa đơn hàng',
                    onClick: () => startDelete(order._id)
                  }
                ]}
              />
            )
          })) || []
        }
        pageSize={pageSize || 0}
      />

      <Modal name='Xác nhận xóa đơn hàng' isVisible={Boolean(currentId)} onCancel={stopDelete} onOk={handleDelete}>
        <div className='text-center leading-loose'>
          <div>Bạn có chắc chắn muốn xóa đơn hàng này?</div>
          <div className='text-red-500 font-semibold underline'>
            Thông tin đơn hàng sẽ bị xóa vĩnh viễn <br /> và không thể khôi phục
          </div>
        </div>
      </Modal>
    </Fragment>
  );
};

export default OrderList;
