import classNames from 'classnames';
import { Link } from 'react-router-dom';
import { useState } from 'react';

import {
  AccessoryIcon,
  ChairIcon,
  HeadphoneIcon,
  KeyboardIcon,
  LaptopGamingIcon,
  LaptopIcon,
  MouseIcon,
  PcIcon,
  ScreenIcon
} from 'src/components/Icons';
import PATH from 'src/constants/path';
import MenuLink from './MenuLink';
import { MEGA_MENU_DATA } from './constants';

interface MegaMenuProps {
  isShow: boolean;
  toggleMenu: () => void;
}

export interface MegaMenuItem {
  heading: string;
  data: {
    to: string;
    name: string;
  }[];
}

const MegaMenu = ({ isShow, toggleMenu }: MegaMenuProps) => {
  const [menuList, setMenuList] = useState<MegaMenuItem[] | null>(null);

  const onMouseEnter = (menuList: MegaMenuItem[]) => {
    setMenuList(menuList);
  };

  const onMouseLeave = () => {
    // setMenuList(null);
  };

  return (
    <div
      className={classNames('absolute top-full left-0 w-full duration-200', {
        'opacity-0 pointer-events-none': !isShow,
        'opacity-100 pointer-events-auto': isShow
      })}
    >
      {/* Mask */}
      <div onClick={toggleMenu} className='absolute left-0 right-0 w-full h-screen bg-black/50' />

      <div className='relative z-10 container pt-[15px] flex items-start'>
        {/* Sidebar */}
        <div className='w-[216px] bg-white rounded'>
          <MenuLink
            onMouseEnter={() => onMouseEnter(MEGA_MENU_DATA.LAPTOP)}
            onMouseLeave={onMouseLeave}
            to={PATH.HOME}
            icon={<LaptopIcon />}
            name='Laptop'
          />
          <MenuLink
            to={PATH.HOME}
            icon={<LaptopGamingIcon />}
            name='Laptop Gaming'
            onMouseEnter={() => onMouseEnter(MEGA_MENU_DATA.PC_GAMING)}
            onMouseLeave={onMouseLeave}
          />
          <MenuLink
            to={PATH.HOME}
            icon={<PcIcon />}
            name='PC Gaming'
            onMouseEnter={() => onMouseEnter(MEGA_MENU_DATA.LAPTOP)}
            onMouseLeave={onMouseLeave}
          />
          <MenuLink
            to={PATH.HOME}
            icon={<ScreenIcon />}
            name='Màn hình'
            onMouseEnter={() => onMouseEnter(MEGA_MENU_DATA.PC_GAMING)}
            onMouseLeave={onMouseLeave}
          />
          <MenuLink
            to={PATH.HOME}
            icon={<KeyboardIcon />}
            name='Bàn phím'
            onMouseEnter={() => onMouseEnter(MEGA_MENU_DATA.LAPTOP)}
            onMouseLeave={onMouseLeave}
          />
          <MenuLink
            to={PATH.HOME}
            icon={<MouseIcon />}
            name='Chuột'
            onMouseEnter={() => onMouseEnter(MEGA_MENU_DATA.PC_GAMING)}
            onMouseLeave={onMouseLeave}
          />
          <MenuLink
            to={PATH.HOME}
            icon={<HeadphoneIcon />}
            name='Tai Nghe - Loa'
            onMouseEnter={() => onMouseEnter(MEGA_MENU_DATA.LAPTOP)}
            onMouseLeave={onMouseLeave}
          />
          <MenuLink
            to={PATH.HOME}
            icon={<ChairIcon />}
            name='Ghế - Bàn'
            onMouseEnter={() => onMouseEnter(MEGA_MENU_DATA.PC_GAMING)}
            onMouseLeave={onMouseLeave}
          />
          <MenuLink
            to={PATH.HOME}
            icon={<AccessoryIcon />}
            name='Phụ kiện'
            onMouseEnter={() => onMouseEnter(MEGA_MENU_DATA.LAPTOP)}
            onMouseLeave={onMouseLeave}
          />
        </div>

        {/* Menu */}
        {menuList && (
          <div className='flex-1 ml-[10px] bg-white rounded p-[10px]'>
            <div className='grid grid-cols-10 gap-10'>
              {menuList.map((menu, index) => (
                <div key={index} className='col-span-2 p-[5px] pb-4'>
                  <h3 className='text-primary text-[15px] font-semibold mb-2'>{menu.heading}</h3>
                  {menu.data.length > 0 && (
                    <div>
                      {menu.data.map((item, index) => (
                        <Link key={index} to={item.to} className='block text-[13px] hover:text-primary mb-2'>
                          {item.name}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MegaMenu;
