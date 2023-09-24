import { useMemo } from 'react';
import { useLocation, useMatch } from 'react-router-dom';

import { CheckoutIcon, CheckoutSuccessIcon, InCartIcon, InfoCheckoutIcon } from 'src/components/Icons';
import PATH from 'src/constants/path';
import PaymentProgressItem from '../PaymentProgressItem';

const PaymentProgress = () => {
  const location = useLocation();
  const isCheckoutInfoPage = !!useMatch(PATH.CART_CHECKOUT_INFO);
  const isCheckoutProcessPage = !!useMatch(PATH.CART_CHECKOUT_PROCESS);
  const isCheckoutSuccessPage = !!useMatch(PATH.CART_CHECKOUT_SUCCESS);

  // Đang ở trang thông tin đặt hàng
  const checkoutInfoActive = useMemo(
    () => isCheckoutInfoPage || isCheckoutProcessPage || isCheckoutSuccessPage,
    [location.pathname]
  );

  // Đang ở trang thanh toán
  const checkoutProcessActive = useMemo(() => isCheckoutProcessPage || isCheckoutSuccessPage, [location.pathname]);

  // Đang ở trang hoàn tất đặt hàng
  const checkoutSuccessActive = useMemo(() => isCheckoutSuccessPage, [location.pathname]);

  return (
    <div className='p-2'>
      <div className='bg-[#FFEDED] px-[14px] pt-5 pb-4 flex items-start'>
        <div className='flex justify-center items-center flex-col flex-1'>
          <InCartIcon className='w-7 h-7' />
          <p className='text-primary mt-1 text-sm md:text-base'>Giỏ hàng</p>
        </div>
        <PaymentProgressItem icon={InfoCheckoutIcon} name='Thông tin đặt hàng' isActive={checkoutInfoActive} />
        <PaymentProgressItem icon={CheckoutIcon} name='Thanh toán' isActive={checkoutProcessActive} />
        <PaymentProgressItem icon={CheckoutSuccessIcon} name='Hoàn tất' isActive={checkoutSuccessActive} />
      </div>
    </div>
  );
};

export default PaymentProgress;
