import { Link } from 'react-router-dom';
import PATH from 'src/constants/path';
import { Order } from 'src/types/order.type';
import { formatCurrency, generateNameId, getImageUrl } from 'src/utils/utils';

interface OrderItemProps {
  data: Order;
}

const OrderItem = ({ data }: OrderItemProps) => {
  const purchases = data.purchases;

  return (
    <div className='px-6 py-4 mt-4 bg-white rounded shadow-sm'>
      {/* Head */}
      <div className='flex justify-between items-center pb-4 border-b border-b-[#cfcfcg]'>
        <div className='text-sm font-semibold text-[#6D6E72]'>Mới</div>
        <div className='text-sm font-semibold text-[#111111]'>#108766</div>
      </div>
      {/* Body */}
      {purchases.map((purchase, index) => (
        <div key={index} className='flex justify-between py-6'>
          <div className='flex-1 flex items-center'>
            <Link
              to={`${PATH.PRODUCT_DETAIL_WITHOUT_ID}/${generateNameId({ name: purchase.name_vi, id: purchase._id })}`}
              className='border border-[#eeeeee] rounded'
            >
              <img
                src={getImageUrl(purchase.thumbnail)}
                alt={purchase.name_vi}
                className='w-[90px] h-[90px] object-cover rounded'
              />
            </Link>
            <Link
              to={`${PATH.PRODUCT_DETAIL_WITHOUT_ID}/${generateNameId({ name: purchase.name_vi, id: purchase._id })}`}
              className='text-[#111111] font-semibold ml-2'
            >
              {purchase.name_vi}
            </Link>
          </div>
          <div className='text-right'>
            <div className='text-[#111111]'>{formatCurrency(purchase.price_after_discount)}₫</div>
            <div className='text-sm text-[#111111] line-through'>{formatCurrency(purchase.price)}₫</div>
          </div>
        </div>
      ))}

      {/* Foot */}
      <div className='flex flex-col items-end pt-4 border-t border-t-[#cfcfcf]'>
        <div className='mb-2'>
          <span className='text-[#111111]'>Tổng tiền:</span> <span className='text-primary font-semibold'>70.000₫</span>
        </div>
        <Link to={''} className='px-4 py-[6px] border border-[#1982F9] rounded text-sm text-[#1982F9] font-medium'>
          Xem chi tiết
        </Link>
      </div>
    </div>
  );
};

export default OrderItem;
