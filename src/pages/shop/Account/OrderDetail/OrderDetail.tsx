import { useQuery } from '@tanstack/react-query';
import { Fragment, useMemo } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import moment from 'moment';

import orderApi from 'src/apis/order.api';
import { CheckCircleGreenIcon, CustomerInfoImage, PaymentMethodImage, ProductInfoImage } from 'src/components/Icons';
import { orderStatusName } from 'src/components/OrderItem/OrderItem';
import PATH from 'src/constants/path';
import { formatCurrency, generateNameId, getImageUrl } from 'src/utils/utils';
import Loading from 'src/components/Loading';
import { OrderStatus } from 'src/constants/enum';

const OrderDetail = () => {
  const navigate = useNavigate();
  const { order_id } = useParams();

  const getOrderDetailQuery = useQuery({
    queryKey: ['order_detail', order_id],
    queryFn: () => orderApi.getDetail(order_id as string),
    enabled: Boolean(order_id)
  });

  const order = useMemo(() => getOrderDetailQuery.data?.data.data.order, [getOrderDetailQuery.data?.data.data.order]);

  return (
    <div className='bg-white rounded shadow-sm'>
      {/* Thông tin đơn hàng */}
      {order && !getOrderDetailQuery.isLoading && (
        <Fragment>
          <div className='py-4 px-6 flex justify-between items-center'>
            <h2 className='text-2xl'>
              <span className='font-semibold'>Chi tiết đơn hàng {`#${order._id.slice(-6)}`} -</span>{' '}
              <span className='text-[#FF7A00] font-semibold'>{orderStatusName[order.status]}</span>
            </h2>
            <div>Đặt lúc: {moment(order.created_at).format('kk:mm, DD.MM.YYYY')}</div>
          </div>
          <div className='px-6 py-4'>
            {/* Thông tin khách hàng, hình thức thanh toán */}
            <div className='flex'>
              <div className='flex-1 px-4 py-3 rounded border border-[#cfcfcf]'>
                <div className='flex items-center mb-3'>
                  <CustomerInfoImage className='w-6 h-6 mr-2' />{' '}
                  <h3 className='text-[#333333] font-semibold'>Thông tin khách hàng</h3>
                </div>
                <div className='flex mb-4'>
                  <span className='w-1/3'>Người nhận:</span>
                  <span className='flex-1'>
                    {order.contact.customer_name} - {order.contact.phone_number}
                  </span>
                </div>
                <div className='flex mb-4'>
                  <span className='w-1/3'>Địa chỉ nhận hàng:</span>
                  <span className='capitalize flex-1'>{`${order.contact.street}, ${order.contact.ward}, ${order.contact.district}, ${order.contact.province}`}</span>
                </div>
                <div className='flex'>
                  <span className='w-1/3'>Thời gian nhận hàng:</span>
                  <span className='flex-1'>{moment(order.created_at).add(3, 'days').format('DD.MM.YYYY')}</span>
                </div>
              </div>
              <div className='px-4 py-3 rounded border border-[#cfcfcf] ml-6 w-[324px]'>
                <div className='flex items-center mb-3'>
                  <PaymentMethodImage className='w-6 h-6 mr-2' />{' '}
                  <h3 className='text-[#333333] font-semibold'>Hình thức thanh toán</h3>
                </div>
                <div className='text-[#FF7A00]'>Thanh toán khi nhận hàng</div>
              </div>
            </div>
            {/* Thông tin sản phẩm */}
            <div className='px-4 py-3 rounded border border-[#cfcfcf] mt-6'>
              <div className='flex items-center mb-3'>
                <ProductInfoImage className='w-6 h-6 mr-2' />{' '}
                <h3 className='text-[#333333] font-semibold'>Thông tin sản phẩm</h3>
              </div>
              {/* Danh sách sản phẩm */}
              <div>
                {order.purchases.map((purchase) => (
                  <div key={purchase._id} className='p-2 flex justify-between items-start'>
                    <div className='flex items-center'>
                      <Link
                        to={`${PATH.PRODUCT_DETAIL_WITHOUT_ID}/${generateNameId({
                          name: purchase.product.name_vi,
                          id: purchase.product._id
                        })}`}
                      >
                        <img
                          src={getImageUrl(purchase.product.thumbnail)}
                          alt={purchase.product.name_vi}
                          className='w-[90px] h-[90px] rounded-sm'
                        />
                      </Link>
                      <div className='ml-2 flex flex-col'>
                        <Link
                          to={`${PATH.PRODUCT_DETAIL_WITHOUT_ID}/${generateNameId({
                            name: purchase.product.name_vi,
                            id: purchase.product._id
                          })}`}
                        >
                          {purchase.product.name_vi}
                        </Link>
                        <span className='text-sm text-[#535353]'>Số lượng: {purchase.buy_count}</span>
                      </div>
                    </div>
                    <div className='text-primary'>
                      {`${formatCurrency(purchase.product.price_after_discount * purchase.buy_count)}₫`}
                    </div>
                  </div>
                ))}
              </div>
            </div>
            {/* Thông tin thanh toán */}
            <div className='mt-4 flex justify-end'>
              <div className='w-[424px]'>
                <div className='flex justify-between items-center mb-3'>
                  <span>Giá tạm tính:</span>
                  <span>{`${formatCurrency(order.total_amount)}₫`}</span>
                </div>
                <div className='flex justify-between items-center mb-3'>
                  <span>Phí vận chuyển:</span>
                  <span>Miễn phí</span>
                </div>
                <div className='flex justify-between items-center mb-3'>
                  <span>Tổng tiền:</span>
                  <span>{`${formatCurrency(order.total_amount)}₫`}</span>
                </div>
                <div className='flex justify-between items-center mb-3'>
                  <span className='flex items-center'>
                    <CheckCircleGreenIcon className='w-4 h-4 mr-2' />
                    <span>Số tiền đã thanh toán:</span>
                  </span>
                  <span className='text-primary font-bold'>
                    {order.status === OrderStatus.Succeed ? formatCurrency(order.total_amount) : 0}₫
                  </span>
                </div>
              </div>
            </div>
            {/* Quay lại danh sách đơn hàng */}
            <div className='mt-16 mb-8 flex justify-center'>
              <button
                className='bg-[#1982F9] rounded px-6 py-3 text-white hover:bg-[#1982F9]/90'
                onClick={() => navigate(-1)}
              >
                Quay lại danh sách đơn hàng
              </button>
            </div>
          </div>
        </Fragment>
      )}
      {/* Tải trang */}
      {getOrderDetailQuery.isLoading && (
        <div className='flex justify-center p-[200px]'>
          <Loading className='w-12 h-12' />
        </div>
      )}
    </div>
  );
};

export default OrderDetail;
