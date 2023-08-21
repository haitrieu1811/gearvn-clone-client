import { NavLink } from 'react-router-dom';
import classNames from 'classnames';

import { HomeIcon, CategoryIcon, DiscountIcon, UserIcon, HotlineIcon } from 'src/components/Icons';
import PATH from 'src/constants/path';

const StickyBottomMenu = () => {
  return (
    <div className='sticky bg-white bottom-0 left-0 right-0 border-t-[2px] border-t-primary'>
      <div className='flex'>
        <NavLink
          to={PATH.HOME}
          className={({ isActive }) =>
            classNames('flex-1 flex justify-center items-center flex-col py-[10px]', {
              groupactive: isActive
            })
          }
        >
          <HomeIcon className='w-5 h-5 mb-[6px] stroke-[#333333] group-[active]:fill-primary' />
          <span className='text-[10px] text-[#333333] group-[active]:text-primary'>Trang chủ</span>
        </NavLink>
        <NavLink
          to={PATH.HOME}
          className={({ isActive }) =>
            classNames('flex-1 flex justify-center items-center flex-col py-[10px]', {
              groupactive: isActive
            })
          }
        >
          <CategoryIcon className='w-5 h-5 mb-[6px] group-[active]:stroke-primary' />
          <span className='text-[10px] text-[#333333]'>Danh mục</span>
        </NavLink>
        <NavLink
          to={PATH.HOME}
          className={({ isActive }) =>
            classNames('flex-1 flex justify-center items-center flex-col py-[10px]', {
              groupactive: isActive
            })
          }
        >
          <DiscountIcon className='w-5 h-5 mb-[6px] group-[active]:stroke-primary' />
          <span className='text-[10px] text-[#333333]'>Khuyến mãi</span>
        </NavLink>
        <NavLink
          to={PATH.HOME}
          className={({ isActive }) =>
            classNames('flex-1 flex justify-center items-center flex-col py-[10px]', {
              groupactive: isActive
            })
          }
        >
          <HotlineIcon className='w-5 h-5 mb-[6px] stroke-[#333333]' />
          <span className='text-[10px] text-[#333333]'>Tư vấn</span>
        </NavLink>
        <NavLink
          to={PATH.ACCOUNT_PROFILE}
          className={({ isActive }) =>
            classNames('flex-1 flex justify-center items-center flex-col py-[10px]', {
              groupactive: isActive
            })
          }
        >
          <UserIcon className='w-5 h-5 mb-[6px] stroke-[#333333] group-[active]:stroke-primary' />
          <span className='text-[10px] text-[#333333] group-[active]:text-primary'>Tài khoản</span>
        </NavLink>
      </div>
    </div>
  );
};

export default StickyBottomMenu;
