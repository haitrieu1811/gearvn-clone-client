import { useQuery } from '@tanstack/react-query';
import classNames from 'classnames';
import isUndefined from 'lodash/isUndefined';
import omitBy from 'lodash/omitBy';
import { useMemo } from 'react';
import { createSearchParams, useLocation, useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';

import orderApi from 'src/apis/order.api';
import { EmptyOrder } from 'src/components/Icons';
import OrderItem from 'src/components/OrderItem';
import { OrderStatus } from 'src/constants/enum';
import PATH from 'src/constants/path';
import UseQueryParams from 'src/hooks/useQueryParams';
import { GetOrderListRequestBody } from 'src/types/order.type';

type QueryConfig = {
  [key in keyof GetOrderListRequestBody]: string;
};

const HistoryOrder = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const queryParams: QueryConfig = UseQueryParams();
  const queryConfig: QueryConfig = omitBy(
    {
      page: queryParams.page || 1,
      limit: queryParams.limit || 10,
      status: queryParams.status || String(OrderStatus.All)
    },
    isUndefined
  );

  const getOrdersQuery = useQuery({
    queryKey: ['orders', queryConfig],
    queryFn: () => orderApi.getList(queryConfig),
    keepPreviousData: true
  });

  const orders = useMemo(() => getOrdersQuery.data?.data.data.orders, [getOrdersQuery.data?.data.data.orders]);

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
    <div>
      <div className='bg-white rounded-tl rounded-tr shadow-sm'>
        <h2 className='py-4 px-6 text-2xl font-semibold'>Quản lý đơn hàng</h2>
        <nav className='flex justify-between mt-4'>
          <div
            aria-hidden='true'
            tabIndex={0}
            role='button'
            className={classNames(
              'relative whitespace-nowrap text-center uppercase text-[#535353] font-semibold flex-auto px-1 pb-2 after:absolute after:bottom-0 after:left-0 after:right-0 after:h-[2px]',
              {
                'after:bg-primary text-black': queryConfig.status === String(OrderStatus.All),
                'after:bg-transparent': queryConfig.status !== String(OrderStatus.All)
              }
            )}
            onClick={() => changeStatus(String(OrderStatus.All))}
          >
            Tất cả
          </div>
          <div
            aria-hidden='true'
            tabIndex={0}
            role='button'
            className={classNames(
              'relative whitespace-nowrap text-center uppercase text-[#535353] font-semibold flex-auto px-1 pb-2 after:absolute after:bottom-0 after:left-0 after:right-0 after:h-[2px]',
              {
                'after:bg-primary text-black': queryConfig.status === String(OrderStatus.New),
                'after:bg-transparent': queryConfig.status !== String(OrderStatus.New)
              }
            )}
            onClick={() => changeStatus(String(OrderStatus.New))}
          >
            Mới
          </div>
          <div
            aria-hidden='true'
            tabIndex={0}
            role='button'
            className={classNames(
              'relative whitespace-nowrap text-center uppercase text-[#535353] font-semibold flex-auto px-1 pb-2 after:absolute after:bottom-0 after:left-0 after:right-0 after:h-[2px]',
              {
                'after:bg-primary text-black': queryConfig.status === String(OrderStatus.Processing),
                'after:bg-transparent': queryConfig.status !== String(OrderStatus.Processing)
              }
            )}
            onClick={() => changeStatus(String(OrderStatus.Processing))}
          >
            Đang xử lý
          </div>
          <div
            aria-hidden='true'
            tabIndex={0}
            role='button'
            className={classNames(
              'relative whitespace-nowrap text-center uppercase text-[#535353] font-semibold flex-auto px-1 pb-2 after:absolute after:bottom-0 after:left-0 after:right-0 after:h-[2px]',
              {
                'after:bg-primary text-black': queryConfig.status === String(OrderStatus.Delivering),
                'after:bg-transparent': queryConfig.status !== String(OrderStatus.Delivering)
              }
            )}
            onClick={() => changeStatus(String(OrderStatus.Delivering))}
          >
            Đang vận chuyển
          </div>
          <div
            aria-hidden='true'
            tabIndex={0}
            role='button'
            className={classNames(
              'relative whitespace-nowrap text-center uppercase text-[#535353] font-semibold flex-auto px-1 pb-2 after:absolute after:bottom-0 after:left-0 after:right-0 after:h-[2px]',
              {
                'after:bg-primary text-black': queryConfig.status === String(OrderStatus.Succeed),
                'after:bg-transparent': queryConfig.status !== String(OrderStatus.Succeed)
              }
            )}
            onClick={() => changeStatus(String(OrderStatus.Succeed))}
          >
            Hoàn thành
          </div>
          <div
            aria-hidden='true'
            tabIndex={0}
            role='button'
            className={classNames(
              'relative whitespace-nowrap text-center uppercase text-[#535353] font-semibold flex-auto px-1 pb-2 after:absolute after:bottom-0 after:left-0 after:right-0 after:h-[2px]',
              {
                'after:bg-primary text-black': queryConfig.status === String(OrderStatus.Cancelled),
                'after:bg-transparent': queryConfig.status !== String(OrderStatus.Cancelled)
              }
            )}
            onClick={() => changeStatus(String(OrderStatus.Cancelled))}
          >
            Hủy
          </div>
        </nav>
      </div>
      <div>
        {orders &&
          orders.length > 0 &&
          !getOrdersQuery.isLoading &&
          orders.map((order) => <OrderItem key={order._id} data={order} />)}
      </div>
      {orders && orders.length <= 0 && !getOrdersQuery.isLoading && (
        <div className='bg-white rounded shadow-sm mt-4 py-8 flex justify-center items-center flex-col'>
          <EmptyOrder />
          <p className='my-4 text-center'>Quý khách chưa có đơn hàng nào.</p>
          <Link
            to={PATH.HOME}
            className='py-[10px] px-7 rounded uppercase text-white bg-primary font-medium text-sm hover:bg-primary/90'
          >
            Tiếp tục mua hàng
          </Link>
        </div>
      )}
    </div>
  );
};

export default HistoryOrder;
