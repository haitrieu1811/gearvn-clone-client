import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { memo } from 'react';

import { HotlineIcon, LocationIcon, PurchaseIcon } from 'src/components/Icons';
import PATH from 'src/constants/path';
import HeaderAction from '../Action';
import Cart from '../Cart';

interface ActionsProps {
  cartSize: number;
}

const Actions = ({ cartSize }: ActionsProps) => {
  console.log('>>> Actions re-render');

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
      <Link to={PATH.CART_LIST}>
        <HeaderAction icon={<Cart cartSize={cartSize} />} textAbove='Giỏ' textBelow='hàng' />
      </Link>
    </div>
  );
};

Actions.propTypes = {
  cartSize: PropTypes.number.isRequired
};

export default memo(Actions);