import { Fragment, memo, useState } from 'react';
import { useMediaQuery } from 'react-responsive';
import { Link, useNavigate } from 'react-router-dom';

import logoMobile from 'src/assets/images/logo-mobile.svg';
import logo from 'src/assets/images/logo-white.svg';
import Drawer from 'src/components/Drawer';
import { BarIcon, HotlineIcon, LocationIcon, PurchaseIcon } from 'src/components/Icons';
import MegaMenu from 'src/components/MegaMenu';
import MobileMenu from 'src/components/MobileMenu';
import CONFIG from 'src/constants/config';
import PATH from 'src/constants/path';
import useCart from 'src/hooks/useCart';
import Account from './Account';
import Cart from './Cart';
import Search from './Search';

const Header = () => {
  const navigate = useNavigate();
  const isTablet = useMediaQuery({ maxWidth: CONFIG.TABLET_SCREEN_SIZE });
  const { cartSize } = useCart();
  const [showMegaMenu, setShowMegaMenu] = useState<boolean>(false);
  const [showMobileMenu, setShowMobileMenu] = useState<boolean>(false);

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

              {/* Nút danh mục */}
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
              <div className='flex items-center'>
                {[
                  {
                    icon: <HotlineIcon className='w-[18px] stroke-white' />,
                    textAbove: 'Hotline',
                    textBelow: '1800.6975'
                  },
                  {
                    icon: <LocationIcon className='w-[18px]' />,
                    textAbove: 'Hệ thống',
                    textBelow: 'Showroom'
                  },
                  {
                    icon: <PurchaseIcon className='w-[18px] fill-white' />,
                    textAbove: 'Tra cứu',
                    textBelow: 'đơn hàng',
                    onClick: () => navigate(PATH.ACCOUNT_ORDER)
                  },
                  {
                    icon: <Cart cartSize={cartSize} />,
                    textAbove: 'Giỏ',
                    textBelow: 'hàng',
                    onClick: () => navigate(PATH.CART_LIST)
                  }
                ].map((item, index) => (
                  <div
                    key={index}
                    onClick={item.onClick}
                    tabIndex={0}
                    role='button'
                    aria-hidden='true'
                    className='flex items-center ml-7 cursor-pointer'
                  >
                    {item.icon}
                    <div className='text-[13px] text-white ml-3 leading-snug'>
                      <div className='font-semibold'>{item.textAbove}</div>
                      <div className='font-semibold'>{item.textBelow}</div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Tài khoản */}
              <Account />
            </nav>
          </div>

          {/* Mega menu */}
          {showMegaMenu && (
            <div className={'absolute top-full left-0 w-full'}>
              {/* Mask */}
              <div onClick={toggleMegaMenu} className='absolute left-0 right-0 w-full h-screen bg-black/50' />
              <div className='container mt-[15px]'>
                <MegaMenu />
              </div>
            </div>
          )}
        </header>
      )}

      {/* Header của mobile và tablet */}
      {isTablet && (
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
              <Cart cartSize={cartSize} />
            </Link>
          </nav>
          <Drawer isShow={showMobileMenu} onCancel={handleCloseMobileMenu}>
            <MobileMenu onCancel={handleCloseMobileMenu} />
          </Drawer>
        </header>
      )}
    </Fragment>
  );
};

export default memo(Header);
