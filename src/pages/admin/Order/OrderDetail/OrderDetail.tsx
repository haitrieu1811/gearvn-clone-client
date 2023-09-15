import { useMutation, useQuery } from '@tanstack/react-query';
import moment from 'moment';
import { Fragment, useEffect, useMemo, useState } from 'react';
import { useParams } from 'react-router-dom';
import { toast } from 'react-toastify';

import classNames from 'classnames';
import orderApi from 'src/apis/order.api';
import FloatLoading from 'src/components/FloatLoading';
import { EmptyImage } from 'src/components/Icons';
import Loading from 'src/components/Loading';
import Modal from 'src/components/Modal';
import { PaymentMethod, ReceiveMethod } from 'src/constants/enum';
import { convertMomentFromNowToVietnamese, formatCurrency, getImageUrl } from 'src/utils/utils';
import { orderStatus } from '../OrderList/OrderList';
import { ORDER_PROGRESS } from './constants';

const paymentMethods = {
  [PaymentMethod.Cash]: 'Tiền mặt',
  [PaymentMethod.Card]: 'Trả thẻ'
};

const receiveMethods = {
  [ReceiveMethod.AtHome]: 'Tại nhà',
  [ReceiveMethod.AtPostOffice]: 'Tại cơ quan',
  [ReceiveMethod.AtStore]: 'Tại cưa hàng',
  [ReceiveMethod.Other]: 'Khác'
};

const OrderDetail = () => {
  const { order_id } = useParams();
  const [isUpdateStatus, setIsUpdateStatus] = useState<boolean>(false);
  const [currentStatus, setCurrentStatus] = useState<number | null>(null);

  // Lấy chi tiết đơn hàng
  const getOrderDetailQuery = useQuery({
    queryKey: ['order-detail', order_id],
    queryFn: () => orderApi.getDetail(order_id as string),
    enabled: Boolean(order_id)
  });

  // Đơn hàng
  const order = useMemo(() => getOrderDetailQuery.data?.data.data.order, [getOrderDetailQuery.data?.data.data.order]);

  // Cập nhật trạng thái đơn hàng
  useEffect(() => {
    if (order) setCurrentStatus(order.status);
  }, [order]);

  // Thay đổi trạng thái đơn hàng
  const handleChangeStatus = (status: number) => {
    setCurrentStatus(status);
  };

  // Cập nhật trạng thái đơn hàng
  const updateStatusMutation = useMutation({
    mutationFn: orderApi.updateStatus,
    onSuccess: (data) => {
      toast.success(data.data.message);
      getOrderDetailQuery.refetch();
    }
  });

  // Cập nhật trạng thái đơn hàng
  const updateStatus = () => {
    if (currentStatus && order_id) {
      updateStatusMutation.mutate({ orderId: order_id, status: currentStatus });
      setIsUpdateStatus(false);
    }
  };

  return (
    <Fragment>
      <div className='bg-white p-6'>
        <h1 className='font-semibold text-2xl mb-6'>Chi tiết đơn hàng #{order?._id.slice(-6)}</h1>
        {/* Hiển thị khi có dữ liệu */}
        {order && !getOrderDetailQuery.isLoading && (
          <Fragment>
            {/* Thông tin đơn hàng */}
            <div className='grid grid-cols-12 gap-10'>
              <div className='col-span-3'>
                {/* Trạng thái */}
                <div>
                  <h3 className='font-semibold mb-2 text-sm'>
                    Trạng thái
                    <button
                      className='bg-blue-500 text-white rounded-sm px-4 py-[2px] text-sm ml-4'
                      onClick={() => setIsUpdateStatus(true)}
                    >
                      Cập nhật
                    </button>
                  </h3>
                  <p className='text-slate-700'>{orderStatus[order.status]}</p>
                </div>
              </div>
              <div className='col-span-3'>
                {/* Đặt lúc */}
                <div>
                  <h3 className='font-semibold mb-2 text-sm'>Đặt lúc</h3>
                  <p className='text-slate-700 text-sm'>
                    {moment(order.created_at).format('kk:mm, DD.MM.YYYY')} (
                    {convertMomentFromNowToVietnamese(moment(order.created_at).fromNow())})
                  </p>
                </div>
              </div>
              <div className='col-span-3'>
                {/* Cập nhật */}
                <div>
                  <h3 className='font-semibold mb-2 text-sm'>Cập nhật</h3>
                  <p className='text-slate-700 text-sm'>
                    {moment(order.updated_at).format('kk:mm, DD.MM.YYYY')} (
                    {convertMomentFromNowToVietnamese(moment(order.updated_at).fromNow())})
                  </p>
                </div>
              </div>
              <div className='col-span-3'>
                {/* Tên khách hàng */}
                <div>
                  <h3 className='font-semibold mb-2 text-sm'>Tên khách hàng</h3>
                  <p className='text-slate-700 capitalize text-sm'>{order.customer_name}</p>
                </div>
              </div>
              <div className='col-span-3'>
                {/* Số điện thoại */}
                <div>
                  <h3 className='font-semibold mb-2 text-sm'>Số điện thoại</h3>
                  <p className='text-slate-700 text-sm'>{order.customer_phone}</p>
                </div>
              </div>
              <div className='col-span-3'>
                {/* Địa chỉ nhận hàng */}
                <div>
                  <h3 className='font-semibold mb-2 text-sm'>Địa chỉ nhận hàng</h3>
                  <p className='text-slate-700 capitalize text-sm'>
                    {order.street}, {order.ward}, {order.district}, {order.province}
                  </p>
                </div>
              </div>
              <div className='col-span-3'>
                {/* Ghi chú */}
                <div>
                  <h3 className='font-semibold mb-2 text-sm'>Ghi chú</h3>
                  <p className='text-slate-700 text-sm'>{order.note || 'Không có ghi chú'}</p>
                </div>
              </div>
              <div className='col-span-3'>
                {/* Phương thức thanh toán */}
                <div>
                  <h3 className='font-semibold mb-2 text-sm'>Phương thức thanh toán</h3>
                  <p className='text-slate-700 text-sm'>{paymentMethods[order.payment_method]}</p>
                </div>
              </div>
              <div className='col-span-3'>
                {/* Hình thức nhận hàng */}
                <div>
                  <h3 className='font-semibold mb-2 text-sm'>Hình thức nhận hàng</h3>
                  <p className='text-slate-700 text-sm'>{receiveMethods[order.receive_method]}</p>
                </div>
              </div>
              <div className='col-span-3'>
                {/* Phí vận chuyển */}
                <div>
                  <h3 className='font-semibold mb-2 text-sm'>Phí vận chuyển</h3>
                  <p className='text-slate-700 text-sm'>{formatCurrency(order.transport_fee)}₫</p>
                </div>
              </div>
              <div className='col-span-3'>
                {/* Tiền giảm */}
                <div>
                  <h3 className='font-semibold mb-2 text-sm'>Tiền giảm</h3>
                  <p className='text-slate-700 text-sm'>{formatCurrency(order.total_amount_reduced)}₫</p>
                </div>
              </div>
              <div className='col-span-3'>
                {/* Tổng đơn */}
                <div>
                  <h3 className='font-semibold mb-2 text-sm'>Tổng đơn</h3>
                  <p className='text-slate-700 text-sm'>{formatCurrency(order.total_amount)}₫</p>
                </div>
              </div>
            </div>
            {/* Danh sách sản phẩm */}
            <div className='mt-10'>
              <table className='w-full border text-sm'>
                <thead>
                  <tr>
                    <td className='font-semibold px-4 py-2 border'>Sản phẩm</td>
                    <td className='font-semibold px-4 py-2 border'>Đơn giá</td>
                    <td className='font-semibold px-4 py-2 border'>Số lượng</td>
                    <td className='font-semibold px-4 py-2 border'>Tổng tiền</td>
                  </tr>
                </thead>
                <tbody>
                  {order.purchases.map((purchase) => (
                    <tr key={purchase._id}>
                      <td className='border px-4 py-2'>
                        <div className='flex items-center'>
                          <img
                            src={getImageUrl(purchase.product.thumbnail)}
                            alt={purchase.product.name_vi}
                            className='w-16 h-16 object-cover mr-4 rounded'
                          />
                          {purchase.product.name_vi}
                        </div>
                      </td>
                      <td className='border px-4 py-2'>{formatCurrency(purchase.unit_price_after_discount)}₫</td>
                      <td className='border px-4 py-2'>{purchase.buy_count}</td>
                      <td className='border px-4 py-2'>
                        {formatCurrency(purchase.buy_count * purchase.unit_price_after_discount)}₫
                      </td>
                    </tr>
                  ))}
                </tbody>
                <tfoot>
                  <tr>
                    <td colSpan={2} className='border px-4 py-2 text-right font-semibold'>
                      Tổng cộng:
                    </td>
                    <td className='border px-4 py-1'>{order.total_items}</td>
                    <td className='border px-4 py-1 font-semibold text-primary text-sm'>
                      {formatCurrency(order.total_amount)}₫
                    </td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </Fragment>
        )}

        {/* Hiển thị khi không có dữ liệu */}
        {!order && !getOrderDetailQuery.isLoading && (
          <div className='h-[600px] flex justify-center items-center flex-col'>
            <EmptyImage />
            <p className='text-center mt-6'>Không tim thấy đơn hàng</p>
          </div>
        )}

        {/* Tải trang */}
        {getOrderDetailQuery.isLoading && <Loading />}
      </div>

      <Modal
        name='Cập nhật tiến trình'
        isVisible={isUpdateStatus}
        okText='Cập nhật'
        onCancel={() => setIsUpdateStatus(false)}
        onOk={updateStatus}
      >
        <div className='flex'>
          {ORDER_PROGRESS.map((item, index) => (
            <div
              key={index}
              className={classNames('border px-4 py-2 mx-1 rounded', {
                'pointer-events-none bg-black text-white border-black': item.value === currentStatus
              })}
              aria-hidden='true'
              tabIndex={0}
              role='button'
              onClick={() => handleChangeStatus(item.value)}
            >
              {item.name}
            </div>
          ))}
        </div>
      </Modal>

      <FloatLoading isLoading={updateStatusMutation.isLoading} />
    </Fragment>
  );
};

export default OrderDetail;
