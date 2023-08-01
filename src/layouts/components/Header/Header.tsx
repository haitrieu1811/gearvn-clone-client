import { useState } from 'react';
import { Link } from 'react-router-dom';
import classNames from 'classnames';

import logo from 'src/assets/images/logo-white.svg';
import { BarIcon } from 'src/components/Icons';
import PATH from 'src/constants/path';
import Account from './Account';
import HeaderActions from './HeaderActions';
import MegaMenu from './MegaMenu';
import Search from './Search';

const Header = () => {
  const [showMenu, setShowMenu] = useState<boolean>(false);

  const toggleMenu = () => {
    setShowMenu((prevState) => !prevState);
  };

  return (
    <header className='sticky top-0 left-0 right-0 z-[99999]'>
      <div className='bg-primary'>
        <nav className='container py-4 flex justify-between'>
          {/* Logo */}
          <Link to={PATH.HOME} className='flex items-center'>
            <img src={logo} alt='Logo' className='w-[140px]' />
          </Link>
          {/* Danh mục */}
          <div
            className='ml-4 h-[42px] bg-[#BE1529] px-2 py-1 flex items-center justify-center rounded cursor-pointer select-none'
            onClick={toggleMenu}
          >
            <BarIcon />
            <span className='text-white text-[13px] ml-3 font-semibold'>Danh mục</span>
          </div>
          {/* Tìm kiếm */}
          <Search />
          {/* Header actions */}
          <HeaderActions />
          {/* Tài khoản */}
          <Account />
        </nav>
      </div>

      {/* Mega menu */}
      <div
        className={classNames('absolute top-full left-0 w-full duration-200', {
          'opacity-0 pointer-events-none': !showMenu,
          'opacity-100 pointer-events-auto': showMenu
        })}
      >
        {/* Mask */}
        <div onClick={toggleMenu} className='absolute left-0 right-0 w-full h-screen bg-black/50' />
        <div className='container mt-[15px]'>
          <MegaMenu />
        </div>
      </div>
    </header>
  );
};

export default Header;
