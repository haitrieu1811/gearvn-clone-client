import { useQuery } from '@tanstack/react-query';
import classNames from 'classnames';
import isUndefined from 'lodash/isUndefined';
import omitBy from 'lodash/omitBy';
import { Fragment, useMemo } from 'react';
import { Helmet } from 'react-helmet-async';
import { Link, createSearchParams, useLocation, useNavigate } from 'react-router-dom';

import orderApi from 'src/apis/order.api';
import { EmptyImage } from 'src/components/Icons';
import Loading from 'src/components/Loading';
import OrderItem from 'src/components/OrderItem';
import { OrderStatus } from 'src/constants/enum';
import PATH from 'src/constants/path';
import UseQueryParams from 'src/hooks/useQueryParams';
import { GetOrderListRequestParams } from 'src/types/order.type';
import { NAV_LINKS } from './constants';

type QueryConfig = {
  [key in keyof GetOrderListRequestParams]: string;
};

const HistoryOrder = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const queryParams: QueryConfig = UseQueryParams();
  const queryConfig: QueryConfig = omitBy(
    {
      status: queryParams.status || String(OrderStatus.All)
    },
    isUndefined
  );

  // Query: Lấy danh sách đơn hàng
  const getOrdersQuery = useQuery({
    queryKey: ['orders', queryConfig],
    queryFn: () => orderApi.getList(queryConfig),
    keepPreviousData: true
  });

  // Query: Lấy số lượng đơn hàng
  const getQuantityQuery = useQuery({
    queryKey: ['orders_quantity'],
    queryFn: () => orderApi.getQuantity()
  });

  // Danh sách đơn hàng
  const orders = useMemo(() => getOrdersQuery.data?.data.data.orders, [getOrdersQuery.data?.data.data.orders]);

  // Số lượng đơn hàng
  const quantityData = useMemo(() => getQuantityQuery.data?.data.data, [getQuantityQuery.data?.data.data]);

  // Số lượng đơn hàng theo trạng thái
  const quantity = useMemo(
    () => ({
      [OrderStatus.All]: quantityData ? quantityData.qty_all : 0,
      [OrderStatus.New]: quantityData ? quantityData.qty_new : 0,
      [OrderStatus.Processing]: quantityData ? quantityData.qty_processing : 0,
      [OrderStatus.Delivering]: quantityData ? quantityData.qty_delivering : 0,
      [OrderStatus.Succeed]: quantityData ? quantityData.qty_succeed : 0,
      [OrderStatus.Cancelled]: quantityData ? quantityData.qty_cancelled : 0
    }),
    [quantityData]
  );

  // Chọn trạng thái đơn hàng
  const changeStatus = (status: string) => {
    navigate({
      pathname: location.pathname,
      search: createSearchParams({
        ...queryConfig,
        status
      }).toString()
    });
  };

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

      {/* Navbar */}
      {quantityData && !getQuantityQuery.isLoading && (
        <div className='bg-white rounded-tl rounded-tr shadow-sm'>
          <h2 className='py-4 px-2 md:px-6 text-xl md:text-2xl font-semibold'>Quản lý đơn hàng</h2>
          {/* Nav links */}
          <div className='overflow-x-auto'>
            <nav className='flex justify-between mt-2 md:mt-4 w-[800px] md:w-full'>
              {NAV_LINKS.map((navLink, index) => {
                const isActive = queryConfig.status === String(navLink.status);
                return (
                  <div
                    key={index}
                    aria-hidden='true'
                    tabIndex={0}
                    role='button'
                    className={classNames(
                      'relative whitespace-nowrap text-center uppercase text-[#535353] text-sm md:text-base font-semibold flex-auto px-1 pb-2 after:absolute after:bottom-0 after:left-0 after:h-[2px] after:duration-200',
                      {
                        'after:bg-primary text-black after:w-full': isActive,
                        'after:bg-transparent after:w-0': !isActive
                      }
                    )}
                    onClick={() => changeStatus(String(navLink.status))}
                  >
                    {navLink.name}{' '}
                    {isActive && (
                      <span className='text-[#FF3C53] text-sm md:text-base ml-[2px]'>({quantity[navLink.status]})</span>
                    )}
                  </div>
                );
              })}
            </nav>
          </div>
        </div>
      )}

      {/* Hiển thị khi có đơn hàng */}
      {orders && orders.length > 0 && !getOrdersQuery.isLoading && !getQuantityQuery.isLoading && (
        <div>
          {orders.map((order) => (
            <OrderItem key={order._id} data={order} />
          ))}
        </div>
      )}

      {/* Hiển thị khi không có đơn hàng nào */}
      {orders && orders.length <= 0 && !getOrdersQuery.isLoading && !getQuantityQuery.isLoading && (
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
      {(getOrdersQuery.isLoading || getQuantityQuery.isLoading) && (
        <div className='min-h-[400px] flex justify-center items-center bg-white rounded'>
          <Loading />
        </div>
      )}
    </Fragment>
  );
};

export default HistoryOrder;
