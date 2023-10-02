import moment from 'moment';
import PropTypes from 'prop-types';

import { DeliveringIcon, OrderedIcon, RatingIcon, WaitProcessingIcon } from 'src/components/Icons';
import { OrderStatus } from 'src/constants/enum';
import { Order } from 'src/types/order.type';
import OrderTrackingItem from '../OrderTrackingItem';

interface OrderTrackingProps {
  order: Order;
}

const OrderTracking = ({ order }: OrderTrackingProps) => {
  const isProcessing =
    order.status === OrderStatus.Processing ||
    order.status === OrderStatus.Delivering ||
    order.status === OrderStatus.Succeed;
  const isDelivering = order.status === OrderStatus.Delivering || order.status === OrderStatus.Succeed;
  const isSucceed = order.status === OrderStatus.Succeed;

  return (
    <div className='flex'>
      <div className='basis-1/5'>
        <OrderTrackingItem
          icon={OrderedIcon}
          text='Đơn hàng đã đặt'
          time={moment(order.created_at).format('kk:mm - DD.MM.YYYY')}
          border={false}
          isActive={true}
        />
      </div>
      <div className='basis-1/5'>
        <OrderTrackingItem icon={WaitProcessingIcon} text='Tiếp nhận và chờ xử lý' isActive={isProcessing} />
      </div>
      <div className='basis-1/5'>
        <OrderTrackingItem icon={DeliveringIcon} text='Đã giao cho ĐVVC' isActive={isDelivering} />
      </div>
      <div className='basis-1/5'>
        <OrderTrackingItem icon={DeliveringIcon} text='Đang giao' isActive={isDelivering} />
      </div>
      <div className='basis-1/5'>
        <OrderTrackingItem icon={RatingIcon} text='Đánh giá' isActive={isSucceed} />
      </div>
    </div>
  );
};

OrderTracking.propTypes = {
  order: PropTypes.object.isRequired
};

export default OrderTracking;
