import { Fragment, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import classNames from 'classnames';

import { MenuLinkArrowIcon } from 'src/components/Icons';
import useMegaMenuData from 'src/hooks/useMegaMenuData';

export interface MegaMenuItem {
  heading: string;
  data: {
    to: string;
    name: string;
  }[];
}

const MegaMenu = () => {
  const megaMenuData = useMegaMenuData();
  const [menuList, setMenuList] = useState<MegaMenuItem[] | null>(null);
  const [isShowMenu, setIsShowMenu] = useState<boolean>(false);
  const [currentIndex, setCurrentIndex] = useState<number | null>(null);

  // Xử lý khi rê chuột vào menu cha
  const handleParentEnter = (menuList: MegaMenuItem[], index: number) => () => {
    setIsShowMenu(true);
    setCurrentIndex(index);
    setMenuList(menuList);
  };

  // Xử lý khi rê chuột ra khỏi menu cha
  const handleParentLeave = () => {
    setIsShowMenu(false);
  };

  // Xử lý khi rê chuột vào menu con
  const handleChildEnter = () => {
    setIsShowMenu(true);
  };

  // Xử lý khi rê chuột ra khỏi menu con
  const handleChildLeave = () => {
    setIsShowMenu(false);
  };

  // Reset khi isShowMenu = false
  useEffect(() => {
    if (isShowMenu) return;
    setMenuList(null);
    setIsShowMenu(false);
    setCurrentIndex(null);
  }, [isShowMenu]);

  return (
    <Fragment>
      <div className='relative z-10 pointer-events-none'>
        {/* Sidebar */}
        <div className='w-[216px] bg-white rounded relative pointer-events-auto'>
          {megaMenuData.map((item, index) => {
            const isActive = index === currentIndex;
            return (
              <Link
                key={index}
                to={item.to}
                onMouseEnter={handleParentEnter(item.menuData, index)}
                onMouseLeave={handleParentLeave}
                className={classNames(
                  'relative flex justify-between items-center px-4 py-[6px] z-[1] after:absolute after:left-full after:top-0 after:bottom-0 after:border-[16px] after:border-transparent',
                  {
                    'bg-[#ea1c04] text-white after:border-l-[#ea1c04] after:block': isActive,
                    'after:hidden': !isActive
                  }
                )}
              >
                <span
                  className={classNames('flex items-center', {
                    'text-white': isActive
                  })}
                >
                  <div className='w-6'>{item.icon}</div>
                  <span className='text-[13px] ml-3'>{item.name}</span>
                </span>
                <MenuLinkArrowIcon
                  className={classNames('w-2 h-2 stroke-black', {
                    'stroke-white': isActive
                  })}
                />
              </Link>
            );
          })}
        </div>

        {/* Menu */}
        {menuList && (
          <div
            className='ml-2 bg-white rounded p-[10px] absolute right-0 top-0 left-[216px] w-[944px] pointer-events-auto'
            onMouseEnter={handleChildEnter}
            onMouseLeave={handleChildLeave}
          >
            <div className='grid grid-cols-10 gap-10'>
              {menuList?.map((menu, index) => (
                <div key={index} className='col-span-2 p-[5px] pb-4'>
                  <h3 className='text-primary text-[15px] font-semibold mb-2'>{menu.heading}</h3>
                  {menu.data.length > 0 && (
                    <div>
                      {menu.data.map((item, _index) => (
                        <Link key={_index} to={item.to} className='block text-[13px] hover:text-primary mb-2'>
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
    </Fragment>
  );
};

export default MegaMenu;
