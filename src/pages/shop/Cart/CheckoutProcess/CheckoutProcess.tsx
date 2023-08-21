import { useContext } from 'react';
import CODImage from 'src/assets/images/COD.webp';
import { formatCurrency } from 'src/utils/utils';
import { CartContext } from '../Cart';
import { Link } from 'react-router-dom';
import PATH from 'src/constants/path';
import Button from 'src/components/Button/Button';

const CheckoutProcess = () => {
  const { total } = useContext(CartContext);

  return (
    <div className=''>
      <div className='p-6'>
        <h3 className='mb-2 font-semibold text-2xl'>Thông tin đặt hàng</h3>
        <div>
          <div className='mt-4 flex'>
            <div className='font-semibold basis-1/3'>Khách hàng</div>
            <div className='flex-1'>a</div>
          </div>
          <div className='mt-4 flex'>
            <div className='font-semibold basis-1/3'>Số điện thoại</div>
            <div className='flex-1'>0775936841</div>
          </div>
          <div className='mt-4 flex'>
            <div className='font-semibold basis-1/3'>Địa chỉ nhận hàng</div>
            <div className='flex-1'>132, Xã Rạch Chèo, Huyện Phú Tân, Cà Mau, Huyện Phú Tân, Cà Mau</div>
          </div>
          <div className='mt-4 flex'>
            <div className='font-semibold basis-1/3'>Tạm tính</div>
            <div className='flex-1'>40.000₫</div>
          </div>
          <div className='mt-4 flex'>
            <div className='font-semibold basis-1/3'> Phí vận chuyển</div>
            <div className='flex-1'>Miễn phí</div>
          </div>
          <div className='mt-4 flex'>
            <div className='font-semibold basis-1/3'>Tổng tiền</div>
            <div className='flex-1'>40.000₫</div>
          </div>
        </div>
      </div>
      <div className='py-6 mx-6 border-t border-b'>
        <h3 className='mb-4 font-semibold text-2xl'>Chọn hình thức thanh toán</h3>
        <div className='flex items-center my-3'>
          <input type='radio' name='' id='cod' className='mr-5 w-4 h-4' />
          <img src={CODImage} alt='' className='w-6 h-6' />
          <label htmlFor='cod' className='ml-5'>
            Thanh toán khi giao hàng (COD)
          </label>
        </div>
      </div>
      {/* Thông tin thanh toán */}
      <div className='px-4 py-6 md:p-6 bg-white'>
        <div className='flex justify-between items-center mb-6'>
          <div className='text-base md:text-lg font-semibold'>Tổng tiền:</div>
          <div className='text-lg md:text-2xl text-primary font-semibold'>{formatCurrency(total as number)}₫</div>
        </div>
        {/* <Button disabled={checkedCartList.length <= 0} isLoading={checkoutMutation.isLoading} onClick={checkout}>
              Đặt hàng ngay
            </Button> */}
        <Link to={PATH.CART_CHECKOUT_SUCCESS}>
          <Button>Đặt hàng ngay</Button>
        </Link>
      </div>
    </div>
  );
};

export default CheckoutProcess;
