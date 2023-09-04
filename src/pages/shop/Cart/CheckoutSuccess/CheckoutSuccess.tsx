import { useContext, useMemo } from 'react';
import { useFormContext } from 'react-hook-form';
import { Link, useLocation } from 'react-router-dom';

import { ShoppingBagCheckIcon } from 'src/components/Icons';
import PATH from 'src/constants/path';
import { AppContext } from 'src/contexts/app.context';
import { PaymentOrderSchema } from 'src/utils/rules';
import { formatCurrency } from 'src/utils/utils';
import { CartContext } from '../Cart';

const CheckoutSuccess = () => {
  const location = useLocation();
  const { getValues } = useFormContext<PaymentOrderSchema>();
  const { profile } = useContext(AppContext);
  const { total } = useContext(CartContext);
  const orderId = useMemo(() => (location?.state as { order_id: string })?.order_id, [location?.state?.order_id]);

  return (
    <div className='px-6 md:px-16 py-6'>
      <div className='flex items-center justify-center text-lg text-[#1E9800] p-[14px] mb-6 bg-[#D5F7E0] rounded'>
        <ShoppingBagCheckIcon />
        <span className='ml-1 font-semibold'>Đặt hàng thành công</span>
      </div>
      <div className='text-center mb-7'>
        <p>Cảm ơn quý khách đã cho GEARVN có cơ hội được phục vụ.</p>
        <p>Nhân viên GEARVN sẽ liên hệ với quý khách trong thời gian sớm nhất.</p>
      </div>
      {/* Thông tin đơn mua */}
      <div className='bg-[#ececec] mb-6 pb-4'>
        <div className='p-4 flex justify-between items-center border-b border-b-[#CFCFCF]'>
          <div className='uppercase'>ĐƠN HÀNG {`#${orderId?.slice(-6)}`}</div>
          <Link to={PATH.ACCOUNT_ORDER} className='text-[#1982F9]'>
            Quản lý đơn hàng
          </Link>
        </div>
        <div className='p-4'>
          <div className='flex'>
            <div className='font-semibold basis-[40%]'>Khách hàng</div>
            <div className='flex-1'>{getValues('customer_name')}</div>
          </div>
          <div className='mt-4 flex'>
            <div className='font-semibold basis-[40%]'>Số điện thoại</div>
            <div className='flex-1'>{getValues('customer_phone')}</div>
          </div>
          <div className='mt-4 flex'>
            <div className='font-semibold basis-[40%]'>Email</div>
            <div className='flex-1'>{profile?.email}</div>
          </div>
          <div className='mt-4 flex'>
            <div className='font-semibold basis-[40%]'>Giao đến</div>
            <div className='flex-1'>
              {getValues('street')}, {getValues('ward')}, {getValues('district')}, {getValues('province')}
            </div>
          </div>
          <div className='mt-4 flex'>
            <div className='font-semibold basis-[40%]'>Tổng tiền</div>
            <div className='flex-1 text-primary font-semibold'>{formatCurrency(total)}₫</div>
          </div>
          <div className='mt-4 flex'>
            <div className='font-semibold basis-[40%]'>Hình thức thanh toán</div>
            <div className='flex-1'>Thanh toán khi giao hàng (COD)</div>
          </div>
        </div>
        <div className='p-3 rounded border border-dashed border-[#FF7A00] flex justify-center items-center text-[#FF7A00] bg-[#fff6ed] mx-4'>
          Đơn hàng chưa được thanh toán
        </div>
      </div>
      <Link
        to={PATH.HOME}
        className='mt-4 p-3 rounded text-[#1982f9] font-semibold border border-[#1982f9] text-lg flex justify-center items-center hover:bg-[#1982f9] hover:text-white duration-300'
      >
        Tiếp tục mua hàng
      </Link>
    </div>
  );
};

export default CheckoutSuccess;
