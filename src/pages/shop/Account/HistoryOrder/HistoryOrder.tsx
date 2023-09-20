import { useQuery } from '@tanstack/react-query';
import { Fragment, useMemo } from 'react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';

import orderApi from 'src/apis/order.api';
import { EmptyImage } from 'src/components/Icons';
import Loading from 'src/components/Loading';
import OrderItem from 'src/components/OrderItem';
import { OrderStatus } from 'src/constants/enum';
import PATH from 'src/constants/path';
import UseQueryParams from 'src/hooks/useQueryParams';
import { GetOrdersRequestParams, OrderCountByStatus } from 'src/types/order.type';
import Tabs from './Tabs';

export type QueryConfig = {
  [key in keyof GetOrdersRequestParams]: string;
};

const HistoryOrder = () => {
  const queryParams: QueryConfig = UseQueryParams();
  const queryConfig: QueryConfig = useMemo(
    () => ({
      status: queryParams.status || String(OrderStatus.All)
    }),
    [queryParams.status]
  );

  // Query: Lấy danh sách đơn hàng
  const getOrdersQuery = useQuery({
    queryKey: ['orders', queryConfig],
    queryFn: () => orderApi.getList(queryConfig),
    keepPreviousData: true
  });

  // Danh sách đơn hàng
  const orders = useMemo(() => getOrdersQuery.data?.data.data.orders, [getOrdersQuery.data?.data.data.orders]);
  // Số lượng đơn hàng theo trạng thái
  const quantity = useMemo(() => getOrdersQuery.data?.data.data.quantity, [getOrdersQuery.data?.data.data.quantity]);

  return (
    <Fragment>
      <Helmet>
        <title>Quản lý đơn hàng</title>
        <meta name='description' content='Quản lý đơn hàng của bạn trên website của chúng tôi.' />
        <meta property='og:title' content='Quản lý đơn hàng' />
        <meta property='og:description' content='Quản lý đơn hàng của bạn trên website của chúng tôi.' />
        <meta property='og:url' content={window.location.href} />
        <meta property='og:site_name' content='Quản lý đơn hàng' />
        <meta property='og:type' content='website' />
      </Helmet>

      <div className='bg-white rounded-tl rounded-tr shadow-sm'>
        <h2 className='py-4 px-2 md:px-6 text-xl md:text-2xl font-semibold'>Quản lý đơn hàng</h2>
        {/* Thay đổi trạng thái */}
        {!getOrdersQuery.isLoading && (
          <div className='overflow-x-auto'>
            <Tabs quantity={quantity as OrderCountByStatus} queryConfig={queryConfig} />
          </div>
        )}
      </div>

      {/* Hiển thị khi có đơn hàng */}
      {orders && orders.length > 0 && !getOrdersQuery.isLoading && (
        <div>
          {orders.map((order) => (
            <OrderItem key={order._id} data={order} />
          ))}
        </div>
      )}

      {/* Hiển thị khi không có đơn hàng nào */}
      {orders && orders.length <= 0 && !getOrdersQuery.isLoading && (
        <div className='bg-white rounded shadow-sm mt-2 md:mt-4 py-4 md:py-8 flex justify-center items-center flex-col'>
          <EmptyImage />
          <p className='my-4 text-center text-sm md:text-base'>Quý khách chưa có đơn hàng nào.</p>
          <Link
            to={PATH.PRODUCT}
            className='py-2 md:py-[10px] px-4 md:px-7 rounded uppercase text-white bg-primary font-medium text-xs md:text-sm hover:bg-primary/90'
          >
            Tiếp tục mua hàng
          </Link>
        </div>
      )}

      {/* Loading */}
      {getOrdersQuery.isLoading && (
        <div className='min-h-[400px] flex justify-center items-center bg-white rounded'>
          <Loading />
        </div>
      )}
    </Fragment>
  );
};

export default HistoryOrder;
