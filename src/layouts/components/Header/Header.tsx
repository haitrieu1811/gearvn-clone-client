import { useQuery } from '@tanstack/react-query';
import classNames from 'classnames';
import { Fragment, useContext, useMemo, useState } from 'react';
import { useMediaQuery } from 'react-responsive';
import { Link } from 'react-router-dom';

import purchaseApi from 'src/apis/purchase.api';
import logoMobile from 'src/assets/images/logo-mobile.svg';
import logo from 'src/assets/images/logo-white.svg';
import Drawer from 'src/components/Drawer';
import { BarIcon } from 'src/components/Icons';
import MegaMenu from 'src/components/MegaMenu';
import MobileMenu from 'src/components/MobileMenu';
import CONFIG from 'src/constants/config';
import PATH from 'src/constants/path';
import { AppContext } from 'src/contexts/app.context';
import Account from './Account';
import Cart from './Cart';
import HeaderActions from './HeaderActions';
import Search from './Search';

const Header = () => {
  const isTablet = useMediaQuery({ maxWidth: CONFIG.TABLET_SCREEN_SIZE });
  const [showMegaMenu, setShowMegaMenu] = useState<boolean>(false);
  const [showMobileMenu, setShowMobileMenu] = useState<boolean>(false);
  const { isAuthenticated } = useContext(AppContext);

  // Ẩn hiện mega menu
  const toggleMegaMenu = () => {
    setShowMegaMenu((prevState) => !prevState);
  };

  // Ẩn hiện mobile menu
  const handleShowMobileMenu = () => {
    setShowMobileMenu(true);
  };

  // Ẩn mobile menu
  const handleCloseMobileMenu = () => {
    setShowMobileMenu(false);
  };

  // Lấy số lượng sản phẩm trong giỏ hàng
  const getCartListQuery = useQuery({
    queryKey: ['cart_list'],
    queryFn: () => purchaseApi.getCart(),
    enabled: isAuthenticated
  });

  // Số lượng sản phẩm trong giỏ hàng
  const cartSize = useMemo(
    () => getCartListQuery.data?.data.data.cart_size,
    [getCartListQuery.data?.data.data.cart_size]
  );

  return (
    <Fragment>
      {/* Header của desktop */}
      {!isTablet && (
        <header className='sticky top-0 left-0 right-0 z-[99999]'>
          <div className='bg-primary'>
            <nav className='container py-4 flex justify-between'>
              {/* Logo */}
              <Link to={PATH.HOME} className='flex items-center'>
                <img src={logo} alt='Logo' className='w-[140px]' />
              </Link>
              {/* Danh mục */}
              <div
                className='ml-4 h-[42px] bg-[#BE1529] px-2 flex items-center justify-center rounded cursor-pointer select-none'
                onClick={toggleMegaMenu}
              >
                <BarIcon className='fill-white' />
                <span className='text-white text-[13px] ml-3 font-semibold'>Danh mục</span>
              </div>
              {/* Tìm kiếm */}
              <Search />
              {/* Header actions */}
              <HeaderActions cartSize={cartSize || 0} />
              {/* Tài khoản */}
              <Account />
            </nav>
          </div>
          {/* Mega menu */}
          <div
            className={classNames('absolute top-full left-0 w-full duration-200', {
              'opacity-0 pointer-events-none': !showMegaMenu,
              'opacity-100 pointer-events-auto': showMegaMenu
            })}
          >
            {/* Mask */}
            <div onClick={toggleMegaMenu} className='absolute left-0 right-0 w-full h-screen bg-black/50' />
            <div className='container mt-[15px]'>
              <MegaMenu />
            </div>
          </div>
        </header>
      )}
      {/* Header của mobile và tablet */}
      {isTablet && (
        <Fragment>
          <header className='sticky top-0 left-0 right-0 z-[99999]'>
            <nav className='bg-primary p-2 flex'>
              <button className='ml-2' onClick={handleShowMobileMenu}>
                <BarIcon className='w-[22px] h-9 fill-white' />
              </button>
              <Link to={PATH.HOME} className='ml-4 mr-2'>
                <img src={logoMobile} alt='Logo mobile' />
              </Link>
              <Search />
              <Link
                to={PATH.CART}
                className='w-9 h-9 bg-[#BE1529] flex justify-center items-center rounded flex-shrink-0 ml-2'
              >
                <Cart cartSize={cartSize || 0} />
              </Link>
            </nav>
            <Drawer isShow={showMobileMenu} onCancel={handleCloseMobileMenu}>
              <MobileMenu onCancel={handleCloseMobileMenu} />
            </Drawer>
          </header>
        </Fragment>
      )}
    </Fragment>
  );
};

export default Header;
