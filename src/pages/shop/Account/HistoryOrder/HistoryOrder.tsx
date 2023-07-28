import { useQuery } from '@tanstack/react-query';
import classNames from 'classnames';
import isUndefined from 'lodash/isUndefined';
import omitBy from 'lodash/omitBy';
import { Fragment, useMemo } from 'react';
import { Link, createSearchParams, useLocation, useNavigate } from 'react-router-dom';

import orderApi from 'src/apis/order.api';
import { EmptyOrderImage } from 'src/components/Icons';
import Loading from 'src/components/Loading';
import OrderItem from 'src/components/OrderItem';
import { OrderStatus } from 'src/constants/enum';
import PATH from 'src/constants/path';
import UseQueryParams from 'src/hooks/useQueryParams';
import { GetOrderListRequestBody } from 'src/types/order.type';
import { NAV_LINKS } from './constants';

type QueryConfig = {
  [key in keyof GetOrderListRequestBody]: string;
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

  // Lấy danh sách đơn hàng
  const getOrdersQuery = useQuery({
    queryKey: ['orders', queryConfig],
    queryFn: () => orderApi.getList(queryConfig),
    keepPreviousData: true
  });

  // Lấy số lượng đơn hàng
  const GetQuantityQuery = useQuery({
    queryKey: ['orders_quantity'],
    queryFn: () => orderApi.getQuantity()
  });

  const orders = useMemo(() => getOrdersQuery.data?.data.data.orders, [getOrdersQuery.data?.data.data.orders]);
  const quantityData = useMemo(() => GetQuantityQuery.data?.data.data, [GetQuantityQuery.data?.data.data]);
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
      <div className='bg-white rounded-tl rounded-tr shadow-sm'>
        <h2 className='py-4 px-6 text-2xl font-semibold'>Quản lý đơn hàng</h2>
        {/* Nav links */}
        <nav className='flex justify-between mt-4'>
          {NAV_LINKS.map((navLink, index) => {
            const isActive = queryConfig.status === String(navLink.status);
            return (
              <div
                key={index}
                aria-hidden='true'
                tabIndex={0}
                role='button'
                className={classNames(
                  'relative whitespace-nowrap text-center uppercase text-[#535353] font-semibold flex-auto px-1 pb-2 after:absolute after:bottom-0 after:left-0 after:h-[2px] after:duration-200',
                  {
                    'after:bg-primary text-black after:w-full': isActive,
                    'after:bg-transparent after:w-0': !isActive
                  }
                )}
                onClick={() => changeStatus(String(navLink.status))}
              >
                {navLink.name}{' '}
                {isActive && <span className='text-[#FF3C53] ml-[2px]'>({quantity[navLink.status]})</span>}
              </div>
            );
          })}
        </nav>
      </div>
      {/* Danh sách đơn hàng */}
      <div>
        {orders &&
          orders.length > 0 &&
          !getOrdersQuery.isLoading &&
          orders.map((order) => <OrderItem key={order._id} data={order} />)}

        {getOrdersQuery.isLoading && (
          <div className='bg-white rounded shadow-sm flex justify-center mt-4 py-[100px]'>
            <Loading className='w-12 h-12' />
          </div>
        )}
      </div>
      {/* Hiển thị khi không có đơn hàng nào */}
      {orders && orders.length <= 0 && !getOrdersQuery.isLoading && (
        <div className='bg-white rounded shadow-sm mt-4 py-8 flex justify-center items-center flex-col'>
          <EmptyOrderImage />
          <p className='my-4 text-center'>Quý khách chưa có đơn hàng nào.</p>
          <Link
            to={PATH.HOME}
            className='py-[10px] px-7 rounded uppercase text-white bg-primary font-medium text-sm hover:bg-primary/90'
          >
            Tiếp tục mua hàng
          </Link>
        </div>
      )}
    </Fragment>
  );
};

export default HistoryOrder;
