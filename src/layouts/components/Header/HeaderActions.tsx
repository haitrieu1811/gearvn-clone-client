import { Link } from 'react-router-dom';

import { HotlineIcon, LocationIcon, PurchaseIcon } from 'src/components/Icons';
import PATH from 'src/constants/path';
import Cart from './Cart';
import HeaderAction from './HeaderAction';

const HeaderActions = ({ cartSize }: { cartSize: number }) => {
  return (
    <div className='flex items-center'>
      <HeaderAction
        icon={<HotlineIcon className='w-[18px] stroke-white' />}
        textAbove='Hotline'
        textBelow='1800.6975'
      />
      <HeaderAction icon={<LocationIcon className='w-[18px]' />} textAbove='Hệ thống' textBelow='Showroom' />
      <Link to={PATH.ACCOUNT_ORDER}>
        <HeaderAction
          icon={<PurchaseIcon className='w-[18px] fill-white' />}
          textAbove='Tra cứu'
          textBelow='đơn hàng'
        />
      </Link>
      <Link to={PATH.CART}>
        <HeaderAction icon={<Cart cartSize={cartSize} />} textAbove='Giỏ' textBelow='hàng' />
      </Link>
    </div>
  );
};

export default HeaderActions;
