import PropTypes from 'prop-types';
import { memo, useCallback } from 'react';
import { createSearchParams, useLocation, useNavigate } from 'react-router-dom';

import { OrderStatus } from 'src/constants/enum';
import { OrderCountByStatus } from 'src/types/order.type';
import { QueryConfig } from '../HistoryOrder';
import Tab from '../Tab';

interface TabsProps {
  quantity: OrderCountByStatus;
  queryConfig: QueryConfig;
}

const Tabs = ({ quantity, queryConfig }: TabsProps) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { all, new: new_count, processing, delivering, succeed, canceled } = quantity;

  // Chọn trạng thái đơn hàng
  const changeStatus = useCallback(
    (status: string) => {
      navigate({
        pathname: location.pathname,
        search: createSearchParams({
          ...queryConfig,
          status,
          page: '1'
        }).toString()
      });
    },
    [location.pathname, navigate, queryConfig]
  );

  return (
    <nav className='flex justify-between mt-2 md:mt-4 w-[800px] md:w-full'>
      <Tab
        name='Tất cả'
        quantity={all}
        isActive={queryConfig.status === String(OrderStatus.All)}
        onClick={() => changeStatus(String(OrderStatus.All))}
      />
      <Tab
        name='Mới'
        quantity={new_count}
        isActive={queryConfig.status === String(OrderStatus.New)}
        onClick={() => changeStatus(String(OrderStatus.New))}
      />
      <Tab
        name='Đang xử lý'
        quantity={processing}
        isActive={queryConfig.status === String(OrderStatus.Processing)}
        onClick={() => changeStatus(String(OrderStatus.Processing))}
      />
      <Tab
        name='Đang vận chuyển'
        quantity={delivering}
        isActive={queryConfig.status === String(OrderStatus.Delivering)}
        onClick={() => changeStatus(String(OrderStatus.Delivering))}
      />
      <Tab
        name='Hoàn thành'
        quantity={succeed}
        isActive={queryConfig.status === String(OrderStatus.Succeed)}
        onClick={() => changeStatus(String(OrderStatus.Succeed))}
      />
      <Tab
        name='Hủy'
        quantity={canceled}
        isActive={queryConfig.status === String(OrderStatus.Canceled)}
        onClick={() => changeStatus(String(OrderStatus.Canceled))}
      />
    </nav>
  );
};

Tabs.propTypes = {
  quantity: PropTypes.object.isRequired,
  queryConfig: PropTypes.object.isRequired
};

export default memo(Tabs);
