import { useQuery } from '@tanstack/react-query';
import moment from 'moment';
import { Fragment, useMemo } from 'react';
import { Helmet } from 'react-helmet-async';
import { Link, useNavigate, useParams } from 'react-router-dom';

import orderApi from 'src/apis/order.api';
import { CheckCircleGreenIcon, CustomerInfoImage, PaymentMethodImage, ProductInfoImage } from 'src/components/Icons';
import Loading from 'src/components/Loading';
import { orderStatusName } from 'src/components/OrderItem/OrderItem';
import { OrderStatus } from 'src/constants/enum';
import PATH from 'src/constants/path';
import { formatCurrency, generateNameId, getImageUrl } from 'src/utils/utils';
import OrderTracking from './OrderTracking';

const OrderDetail = () => {
  const navigate = useNavigate();
  const { order_id } = useParams();

  // Query: Lấy thông tin đơn hàng
  const getOrderDetailQuery = useQuery({
    queryKey: ['order', order_id],
    queryFn: () => orderApi.getDetail(order_id as string),
    enabled: !!order_id
  });

  // Thông tin đơn hàng
  const order = useMemo(() => getOrderDetailQuery.data?.data.data.order, [getOrderDetailQuery.data?.data.data.order]);

  return (
    <Fragment>
      {order && !getOrderDetailQuery.isLoading && (
        <Helmet>
          <title>Chi tiết đơn hàng #{order._id.slice(-6)}</title>
          <meta
            name='description'
            content='Mua sắm đồ công nghệ chính hãng với giá tốt nhất tại Gearvn-clone. Chúng tôi cung cấp đa dạng các sản phẩm công nghệ từ các thương hiệu nổi tiếng như Apple, Samsung, Huawei, Xiaomi,...'
          />
          <meta property='og:title' content={`Chi tiết đơn hàng #${order._id.slice(-6)}`} />
          <meta
            property='og:description'
            content='Mua sắm đồ công nghệ chính hãng với giá tốt nhất tại Gearvn-clone. Chúng tôi cung cấp đa dạng các sản phẩm công nghệ từ các thương hiệu nổi tiếng như Apple, Samsung, Huawei, Xiaomi,...'
          />
          <meta
            property='og:image'
            content='https://gearvn-clone-ap-southeast-1.s3.ap-southeast-1.amazonaws.com/images/af998ec412e68932c8a77ba00.jpg'
          />
          <meta property='og:url' content={window.location.href} />
          <meta property='og:site_name' content={`Chi tiết đơn hàng #${order._id.slice(-6)}`} />
          <meta property='og:type' content='website' />
        </Helmet>
      )}

      <div className='bg-white rounded shadow-sm'>
        {/* Thông tin đơn hàng */}
        {order && !getOrderDetailQuery.isLoading && (
          <Fragment>
            <div className='py-4 px-2 md:px-6 flex flex-wrap md:flex-nowrap justify-between items-center'>
              <h2 className='text-base md:text-2xl w-full md:w-auto text-center md:text-left'>
                <span className='font-semibold'>Chi tiết đơn hàng {`#${order._id.slice(-6)}`} -</span>{' '}
                <span className='text-[#FF7A00] font-semibold md:mt-0'>{orderStatusName[order.status]}</span>
              </h2>
              <div className='text-sm md:text-base w-full md:w-auto mt-1 text-center md:text-left'>
                Đặt lúc: {moment(order.created_at).format('kk:mm, DD.MM.YYYY')}
              </div>
            </div>
            {/* Tiến trình đơn hàng */}
            {order.status !== OrderStatus.Canceled && (
              <div className='px-6 py-8'>
                <OrderTracking order={order} />
              </div>
            )}
            <div className='px-2 md:px-6 py-2 md:py-4'>
              <div className='flex flex-wrap md:flex-nowrap'>
                {/* Thông tin khách hàng */}
                <div className='flex-1 px-4 py-3 rounded border border-[#cfcfcf]'>
                  <div className='flex items-center mb-3'>
                    <CustomerInfoImage className='w-5 h-5 md:w-6 md:h-6 mr-2' />{' '}
                    <h3 className='text-[#333333] font-semibold text-sm md:text-base'>Thông tin khách hàng</h3>
                  </div>
                  <div className='flex mb-4 text-xs md:text-base'>
                    <span className='w-1/3'>Người nhận:</span>
                    <span className='flex-1'>
                      {order.customer_name} - {order.customer_phone}
                    </span>
                  </div>
                  <div className='flex mb-4 text-xs md:text-base'>
                    <span className='w-1/3'>Địa chỉ nhận hàng:</span>
                    <span className='capitalize flex-1'>{`${order.street}, ${order.ward}, ${order.district}, ${order.province}`}</span>
                  </div>
                  <div className='flex text-xs md:text-base'>
                    <span className='w-1/3'>Thời gian nhận hàng:</span>
                    <span className='flex-1'>{moment(order.created_at).add(3, 'days').format('DD.MM.YYYY')}</span>
                  </div>
                </div>
                {/* Hình thức thanh toán */}
                <div className='px-4 py-3 rounded border border-[#cfcfcf] mt-2 md:mt-0 md:ml-6 w-full md:w-[324px]'>
                  <div className='flex items-center mb-3'>
                    <PaymentMethodImage className='w-5 h-5 md:w-6 md:h-6 mr-2' />{' '}
                    <h3 className='text-[#333333] font-semibold text-sm md:text-base'>Hình thức thanh toán</h3>
                  </div>
                  <div className='text-[#FF7A00] text-xs md:text-base'>Thanh toán khi nhận hàng</div>
                </div>
              </div>
              {/* Thông tin sản phẩm */}
              <div className='px-2 md:px-4 py-3 rounded border border-[#cfcfcf] mt-2 md:mt-6'>
                <div className='flex items-center mb-3'>
                  <ProductInfoImage className='w-5 h-5 md:w-6 md:h-6 mr-2' />{' '}
                  <h3 className='text-[#333333] font-semibold text-sm md:text-base'>Thông tin sản phẩm</h3>
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
                          className='flex-shrink-0'
                        >
                          <img
                            src={getImageUrl(purchase.product.thumbnail)}
                            alt={purchase.product.name_vi}
                            className='w-[50px] h-[50px] md:w-[90px] md:h-[90px] rounded-sm'
                          />
                        </Link>
                        <div className='ml-2 flex flex-col'>
                          <Link
                            to={`${PATH.PRODUCT_DETAIL_WITHOUT_ID}/${generateNameId({
                              name: purchase.product.name_vi,
                              id: purchase.product._id
                            })}`}
                            className='text-xs md:text-base line-clamp-2'
                          >
                            {purchase.product.name_vi}
                          </Link>
                          <span className='text-xs md:text-sm text-[#535353]'>Số lượng: {purchase.buy_count}</span>
                        </div>
                      </div>
                      <div className='text-primary ml-2 text-xs md:text-base'>
                        {`${formatCurrency(purchase.product.price_after_discount * purchase.buy_count)}₫`}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              {/* Thông tin thanh toán */}
              <div className='mt-4 flex justify-end'>
                <div className='w-full md:w-[424px] text-xs md:text-base'>
                  <div className='flex justify-between items-center mb-3'>
                    <span>Giá tạm tính:</span>
                    <span>{`${formatCurrency(order.total_amount_before_discount)}₫`}</span>
                  </div>
                  <div className='flex justify-between items-center mb-3'>
                    <span>Khuyến mãi:</span>
                    <span>-{formatCurrency(order.total_amount_reduced)}₫</span>
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
              <div className='mt-8 md:mt-16 mb-4 md:mb-8 flex justify-center'>
                <button
                  className='bg-[#1982F9] rounded px-3 md:px-6 py-2 md:py-3 text-white text-xs md:text-base hover:bg-[#1982F9]/90'
                  onClick={() => navigate(-1)}
                >
                  Quay lại danh sách đơn hàng
                </button>
              </div>
            </div>
          </Fragment>
        )}

        {/* Loading */}
        {getOrderDetailQuery.isLoading && (
          <div className='min-h-[400px] flex justify-center items-center'>
            <Loading />
          </div>
        )}
      </div>
    </Fragment>
  );
};

export default OrderDetail;
