import { useContext } from 'react';
import { useFormContext } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';

import Button from 'src/components/Button';
import Input from 'src/components/Input';
import { Gender, ReceiveMethod } from 'src/constants/enum';
import PATH from 'src/constants/path';
import { AppContext } from 'src/contexts/app.context';
import { PaymentOrderSchema } from 'src/utils/rules';
import { formatCurrency } from 'src/utils/utils';

type FormData = PaymentOrderSchema;

const CheckoutInfo = () => {
  const navigate = useNavigate();
  const { cartTotal } = useContext(AppContext);

  const {
    register,
    watch,
    handleSubmit,
    formState: { errors }
  } = useFormContext<FormData>();

  const gender = watch('customer_gender');
  const receiveMethod = watch('receive_method');

  const nextStep = handleSubmit(() => {
    navigate(PATH.CART_CHECKOUT_PROCESS);
  });

  return (
    <div className='p-6'>
      <form onSubmit={nextStep}>
        <h3 className='text-lg font-semibold mb-2'>Thông tin khách mua hàng</h3>
        {/* Xưng hô */}
        <div className='flex items-center mt-2 mb-4'>
          <div className='flex items-center'>
            <input
              type='radio'
              id='male'
              checked={Gender.Male === Number(gender)}
              value={Gender.Male}
              {...register('customer_gender')}
            />
            <label htmlFor='male' className='ml-2'>
              Anh
            </label>
          </div>
          <div className='flex items-center ml-[30px]'>
            <input
              type='radio'
              id='female'
              checked={Gender.Female === Number(gender)}
              value={Gender.Female}
              {...register('customer_gender')}
            />
            <label htmlFor='female' className='ml-2'>
              Chị
            </label>
          </div>
        </div>
        {/* Họ tên, số điện thoại */}
        <div className='grid grid-cols-12 gap-4 mb-6'>
          <div className='col-span-12 md:col-span-6'>
            <Input
              placeholder='Nhập họ tên'
              name='customer_name'
              register={register}
              errorMessage={errors.customer_name?.message}
            />
          </div>
          <div className='col-span-12 md:col-span-6'>
            <Input
              placeholder='Nhập số điện thoại'
              name='customer_phone'
              register={register}
              errorMessage={errors.customer_phone?.message}
            />
          </div>
        </div>
        {/* Phương thức nhận hàng */}
        <h3 className='text-lg font-semibold mb-2'>Chọn cách nhận hàng</h3>
        <div className='mt-2 mb-4 flex items-center'>
          <input
            type='radio'
            id='receive-at-home'
            checked={ReceiveMethod.AtHome === Number(receiveMethod)}
            value={ReceiveMethod.AtHome}
            {...register('receive_method')}
          />
          <label htmlFor='receive-at-home' className='ml-2'>
            Giao hàng tận nơi
          </label>
        </div>
        {/* Địa chỉ */}
        <div className='bg-[#ECECEC] p-6 rounded mb-6'>
          <div className='grid grid-cols-12 gap-4'>
            <div className='col-span-6'>
              <Input
                placeholder='Nhập tỉnh/thành phố'
                name='province'
                register={register}
                errorMessage={errors.province?.message}
              />
            </div>
            <div className='col-span-6'>
              <Input
                placeholder='Nhập quận/huyện'
                name='district'
                register={register}
                errorMessage={errors.district?.message}
              />
            </div>
            <div className='col-span-6'>
              <Input placeholder='Nhập phường xã' name='ward' register={register} errorMessage={errors.ward?.message} />
            </div>
            <div className='col-span-6'>
              <Input
                placeholder='Nhập số nhà/tên đường'
                name='street'
                register={register}
                errorMessage={errors.street?.message}
              />
            </div>
          </div>
        </div>
        {/* Yêu cầu khác */}
        <Input type='text' placeholder='Lưu ý, yêu cầu khác (Không bắt buộc)' name='note' register={register} />
        {/* Thông tin thanh toán */}
        <div className='px-4 py-6 mt-6 md:p-6 md:pb-3 bg-white border-t border-[#cfcfcf]'>
          <div className='flex justify-between items-center mb-2'>
            <div className='text-sm md:text-base font-semibold'>Phí vận chuyển:</div>
            <div className='text-sm md:text-base font-semibold'>Miễn phí</div>
          </div>
          <div className='flex justify-between items-center mb-6'>
            <div className='text-base md:text-lg font-semibold'>Tổng tiền:</div>
            <div className='text-lg md:text-2xl text-primary font-semibold'>{formatCurrency(cartTotal as number)}₫</div>
          </div>
          {/* <Button disabled={checkedCartList.length <= 0} isLoading={checkoutMutation.isLoading} onClick={checkout}>
              Đặt hàng ngay
            </Button> */}
          <Button onClick={nextStep}>Đặt hàng ngay</Button>
        </div>
        <p className='text-sm text-[#666666] text-center'>Bạn có thể chọn hình thức thanh toán sau khi đặt hàng</p>
      </form>
    </div>
  );
};

export default CheckoutInfo;
