import { useQuery } from '@tanstack/react-query';
import { Fragment, useContext, useMemo } from 'react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';

import orderApi from 'src/apis/order.api';
import { EmptyImage } from 'src/components/Icons';
import Loading from 'src/components/Loading';
import OrderItem from 'src/components/OrderItem';
import Pagination from 'src/components/Pagination';
import { OrderStatus } from 'src/constants/enum';
import PATH from 'src/constants/path';
import { AppContext } from 'src/contexts/app.context';
import useQueryParams from 'src/hooks/useQueryParams';
import { GetOrdersRequestParams, OrderCountByStatus } from 'src/types/order.type';
import Tabs from './Tabs';

export type QueryConfig = {
  [key in keyof GetOrdersRequestParams]: string;
};

const HistoryOrder = () => {
  const { profile } = useContext(AppContext);
  const queryParams: QueryConfig = useQueryParams();
  const queryConfig: QueryConfig = useMemo(
    () => ({
      status: queryParams.status || String(OrderStatus.All),
      page: queryParams.page || '1',
      limit: queryParams.limit || '10'
    }),
    [queryParams.status, queryParams.page, queryParams.limit]
  );

  // Query: Lấy danh sách đơn hàng
  const getOrdersQuery = useQuery({
    queryKey: ['orders', profile?._id, queryConfig],
    queryFn: () => orderApi.getList(queryConfig),
    enabled: !!profile?._id,
    keepPreviousData: true
  });

  // Danh sách đơn hàng
  const orders = useMemo(() => getOrdersQuery.data?.data.data.orders, [getOrdersQuery.data?.data.data.orders]);

  // Số lượng đơn hàng theo trạng thái
  const quantity = useMemo(() => getOrdersQuery.data?.data.data.quantity, [getOrdersQuery.data?.data.data.quantity]);

  // Số lượng trang của danh sách đơn hàng
  const pageSize = useMemo(
    () => getOrdersQuery.data?.data.data.pagination.page_size || 0,
    [getOrdersQuery.data?.data.data.pagination.page_size]
  );

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
          {pageSize > 1 && (
            <div className='flex justify-center rounded-b-md py-5 bg-white'>
              <Pagination
                pageSize={pageSize}
                classNameItem='w-8 h-8 md:w-10 md:h-10 mx-1 rounded-full flex justify-center items-center font-semibold text-sm md:text-base select-none'
                classNameItemActive='bg-black text-white pointer-events-none'
                classNameItemUnActive='bg-[#f3f3f3]'
              />
            </div>
          )}
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
