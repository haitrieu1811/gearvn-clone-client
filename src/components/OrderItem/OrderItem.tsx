import { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { OrderStatus } from 'src/constants/enum';
import PATH from 'src/constants/path';
import { Order } from 'src/types/order.type';
import { formatCurrency, generateNameId, getImageUrl } from 'src/utils/utils';

interface OrderItemProps {
  data: Order;
}

export const orderStatusName = {
  [OrderStatus.All]: 'Tất cả',
  [OrderStatus.New]: 'Mới',
  [OrderStatus.Processing]: 'Đang xử lý',
  [OrderStatus.Delivering]: 'Đang vận chuyển',
  [OrderStatus.Succeed]: 'Thành công',
  [OrderStatus.Cancelled]: 'Đã hủy'
};

const OrderItem = ({ data }: OrderItemProps) => {
  const purchases = useMemo(() => data.purchases, [data]);

  return (
    <div className='px-2 md:px-6 py-4 mt-2 md:mt-4 bg-white rounded shadow-sm'>
      {/* Head */}
      <div className='flex justify-between items-center pb-4 border-b border-b-[#cfcfcg]'>
        <div className='text-sm font-semibold text-[#6D6E72]'>{orderStatusName[data.status as OrderStatus]}</div>
        <div className='text-sm font-semibold text-[#111111]'>{`#${data._id.slice(-6)}`}</div>
      </div>
      {/* Body */}
      {purchases.map((purchase, index) => (
        <div key={index} className='flex justify-between py-6'>
          <div className='flex-1 flex items-center'>
            <Link
              to={`${PATH.PRODUCT_DETAIL_WITHOUT_ID}/${generateNameId({
                name: purchase.product.name_vi,
                id: purchase.product._id
              })}`}
              className='border border-[#eeeeee] rounded relative flex-shrink-0'
            >
              <img
                src={getImageUrl(purchase.product.thumbnail)}
                alt={purchase.product.name_vi}
                className='w-[50px] h-[50px] md:w-[90px] md:h-[90px] object-cover rounded'
              />
              <span className='absolute bottom-0 right-0 bg-[#ECECEC] font-semibold text-[10px] md:text-xs w-5 h-5 md:w-6 md:h-6 rounded-tl rounded-br flex justify-center items-center text-[#6D6E72]'>
                x{purchase.buy_count}
              </span>
            </Link>
            <Link
              to={`${PATH.PRODUCT_DETAIL_WITHOUT_ID}/${generateNameId({
                name: purchase.product.name_vi,
                id: purchase.product._id
              })}`}
              className='text-[#111111] font-semibold ml-2 line-clamp-2 text-[12px] md:text-base'
            >
              {purchase.product.name_vi}
            </Link>
          </div>
          <div className='text-right ml-2'>
            <div className='text-[#111111] text-sm md:text-base'>
              {formatCurrency(purchase.unit_price_after_discount * purchase.buy_count)}₫
            </div>
            <div className='text-[12px] md:text-sm text-[#111111] line-through'>
              {formatCurrency(purchase.unit_price * purchase.buy_count)}₫
            </div>
          </div>
        </div>
      ))}
      {/* Foot */}
      <div className='flex flex-col items-end pt-4 border-t border-t-[#cfcfcf]'>
        <div className='mb-2'>
          <span className='text-[#111111] text-sm md:text-base'>Tổng tiền:</span>{' '}
          <span className='text-primary text-sm md:text-base font-semibold'>{formatCurrency(data.total_amount)}₫</span>
        </div>
        <Link
          to={`${PATH.ACCOUNT_ORDER_DETAIL_WITHOUT_ID}/${data._id}`}
          className='px-2 md:px-4 py-1 md:py-[6px] border border-[#1982F9] rounded text-[12px] md:text-sm text-[#1982F9] font-medium'
        >
          Xem chi tiết
        </Link>
      </div>
    </div>
  );
};

export default OrderItem;
