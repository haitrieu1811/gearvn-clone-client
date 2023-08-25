import { useMemo } from 'react';
import { useLocation, useMatch } from 'react-router-dom';

import { CheckoutIcon, CheckoutSuccessIcon, InCartIcon, InfoCheckoutIcon } from 'src/components/Icons';
import PATH from 'src/constants/path';
import PaymentProgressItem from '../PaymentProgressItem/PaymentProgressItem';

const PaymentProgress = () => {
  const location = useLocation();

  const isCheckoutInfoPage = Boolean(useMatch(PATH.CART_CHECKOUT_INFO));
  const isCheckoutProcessPage = Boolean(useMatch(PATH.CART_CHECKOUT_PROCESS));
  const isCheckoutSuccessPage = Boolean(useMatch(PATH.CART_CHECKOUT_SUCCESS));

  const checkoutInfoActive = useMemo(
    () => isCheckoutInfoPage || isCheckoutProcessPage || isCheckoutSuccessPage,
    [location.pathname]
  );
  const checkoutProcessActive = useMemo(() => isCheckoutProcessPage || isCheckoutSuccessPage, [location.pathname]);
  const checkoutSuccessActive = useMemo(() => isCheckoutSuccessPage, [location.pathname]);

  return (
    <div className='p-2'>
      <div className='bg-[#FFEDED] px-[14px] pt-5 pb-4 flex'>
        <div className='flex justify-center items-center flex-col flex-1'>
          <InCartIcon className='w-7 h-7' />
          <p className='text-primary mt-1'>Giỏ hàng</p>
        </div>
        <PaymentProgressItem icon={InfoCheckoutIcon} name='Thông tin đặt hàng' isActive={checkoutInfoActive} />
        <PaymentProgressItem icon={CheckoutIcon} name='Thanh toán' isActive={checkoutProcessActive} />
        <PaymentProgressItem icon={CheckoutSuccessIcon} name='Hoàn tất' isActive={checkoutSuccessActive} />
      </div>
    </div>
  );
};

export default PaymentProgress;
