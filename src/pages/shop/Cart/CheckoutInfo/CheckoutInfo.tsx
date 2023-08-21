import { useContext } from 'react';
import { Link } from 'react-router-dom';

import Button from 'src/components/Button';
import Input from 'src/components/Input';
import PATH from 'src/constants/path';
import { formatCurrency } from 'src/utils/utils';
import { CartContext } from '../Cart';
import { AppContext } from 'src/contexts/app.context';

const CheckoutInfo = () => {
  const { total } = useContext(CartContext);
  const { profile } = useContext(AppContext);

  return (
    <div className='p-6'>
      <form>
        <h3 className='text-lg font-semibold mb-2'>Thông tin khách mua hàng</h3>
        {/* Xưng hô */}
        <div className='flex items-center mt-2 mb-4'>
          <div className='flex items-center'>
            <input type='radio' id='male' name='gender' />
            <label htmlFor='male' className='ml-2'>
              Anh
            </label>
          </div>
          <div className='flex items-center ml-[30px]'>
            <input type='radio' id='female' name='gender' />
            <label htmlFor='female' className='ml-2'>
              Chị
            </label>
          </div>
        </div>
        {/* Họ tên, số điện thoại */}
        <div className='grid grid-cols-12 gap-4 mb-6'>
          <div className='col-span-12 md:col-span-6'>
            <Input placeholder='Nhập họ tên' />
          </div>
          <div className='col-span-12 md:col-span-6'>
            <Input placeholder='Nhập số điện thoại' />
          </div>
        </div>
        <h3 className='text-lg font-semibold mb-2'>Chọn cách nhận hàng</h3>
        <div className='mt-2 mb-4 flex items-center'>
          <input type='radio' id='receive-at-home' name='receive-method' />
          <label htmlFor='receive-at-home' className='ml-2'>
            Giao hàng tận nơi
          </label>
        </div>
        {/* Địa chỉ */}
        <div className='bg-[#ECECEC] p-6 rounded mb-6'>
          <div className='grid grid-cols-12 gap-4'>
            <div className='col-span-6'>
              <Input placeholder='Nhập tỉnh/thành phố' />
            </div>
            <div className='col-span-6'>
              <Input placeholder='Nhập quận/huyện' />
            </div>
            <div className='col-span-6'>
              <Input placeholder='Nhập phường xã' />
            </div>
            <div className='col-span-6'>
              <Input placeholder='Nhập số nhà/tên đường' />
            </div>
          </div>
        </div>
        {/* Yêu cầu khác */}
        <div>
          <Input type='text' placeholder='Lưu ý, yêu cầu khác (Không bắt buộc)' />
        </div>
        {/* Thông tin thanh toán */}
        <div className='px-4 py-6 mt-6 md:p-6 bg-white border-t border-[#cfcfcf]'>
          <div className='flex justify-between items-center mb-2'>
            <div className='text-sm md:text-base font-semibold'>Phí vận chuyển:</div>
            <div className='text-sm md:text-base font-semibold'>Miễn phí</div>
          </div>
          <div className='flex justify-between items-center mb-6'>
            <div className='text-base md:text-lg font-semibold'>Tổng tiền:</div>
            <div className='text-lg md:text-2xl text-primary font-semibold'>{formatCurrency(total as number)}₫</div>
          </div>
          {/* <Button disabled={checkedCartList.length <= 0} isLoading={checkoutMutation.isLoading} onClick={checkout}>
              Đặt hàng ngay
            </Button> */}
          <Link to={PATH.CART_CHECKOUT_PROCESS}>
            <Button>Đặt hàng ngay</Button>
          </Link>
        </div>
      </form>
    </div>
  );
};

export default CheckoutInfo;
