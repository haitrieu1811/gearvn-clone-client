import { useQuery } from '@tanstack/react-query';
import { useMemo } from 'react';
import { Link } from 'react-router-dom';

import purchaseApi from 'src/apis/purchase.api';
import { CartIcon, HotlineIcon, LocationIcon, PurchaseIcon } from 'src/components/Icons';
import PATH from 'src/constants/path';
import HeaderAction from './HeaderAction';

const HeaderActions = () => {
  // Lấy số lượng sản phẩm trong giỏ hàng
  const getCartListQuery = useQuery({
    queryKey: ['cart_list'],
    queryFn: () => purchaseApi.getCart()
  });

  // Số lượng sản phẩm trong giỏ hàng
  const cartSize = useMemo(
    () => getCartListQuery.data?.data.data.cart_size,
    [getCartListQuery.data?.data.data.cart_size]
  );

  return (
    <div className='flex items-center'>
      <HeaderAction icon={<HotlineIcon className='w-[18px]' />} textAbove='Hotline' textBelow='1800.6975' />
      <HeaderAction icon={<LocationIcon className='w-[18px]' />} textAbove='Hệ thống' textBelow='Showroom' />
      <Link to={PATH.ACCOUNT_ORDER}>
        <HeaderAction
          icon={<PurchaseIcon className='w-[18px] fill-white' />}
          textAbove='Tra cứu'
          textBelow='đơn hàng'
        />
      </Link>
      <Link to={PATH.CART}>
        <HeaderAction
          icon={
            <div className='relative'>
              <CartIcon className='w-[18px]' />
              <span className='absolute -top-2 -right-2 bg-[#FDD835] text-[9px] w-4 h-4 rounded-full flex items-center justify-center font-bold border-[2px] border-white'>
                {cartSize || 0}
              </span>
            </div>
          }
          textAbove='Giỏ'
          textBelow='hàng'
        />
      </Link>
    </div>
  );
};

export default HeaderActions;
