import classNames from 'classnames';
import { Link, NavLink } from 'react-router-dom';

import logo from 'src/assets/images/logo-red.svg';
import { ChartPieIcon, ItemIcon, LogoutIcon, NewspaperIcon, ShoppingBagIcon, UserIcon } from 'src/components/Icons';
import PATH from 'src/constants/path';

const DashboardSidebar = () => {
  return (
    <aside className='w-[240px] bg-white fixed top-0 bottom-0 py-10 shadow-sm'>
      <div className='px-6'>
        <Link to={PATH.HOME}>
          <img src={logo} alt='Logo' className='w-[160px]' />
        </Link>
      </div>
      <div className='py-5 px-6 pl-0 border-b'>
        <NavLink
          end
          to={PATH.DASHBOARD}
          className={({ isActive }) =>
            classNames('flex items-center rounded-tr-sm rounded-br-sm py-2 px-5', {
              'hover:bg-slate-100': !isActive,
              'bg-gradient-to-r from-sky-500/30 to-indigo-500/30': isActive
            })
          }
        >
          <ChartPieIcon className='w-4 h-4 stroke-black' />
          <span className='text-sm ml-3 capitalize font-medium'>Dashboard</span>
        </NavLink>
        <NavLink
          to={PATH.DASHBOARD_USER}
          className={({ isActive }) =>
            classNames('flex items-center rounded-tr-sm rounded-br-sm py-2 px-5 mt-1', {
              'hover:bg-slate-100': !isActive,
              'bg-gradient-to-r from-sky-500/30 to-indigo-500/30': isActive
            })
          }
        >
          <UserIcon className='w-4 h-4 stroke-black' />
          <span className='text-sm ml-3 capitalize font-medium'>Người dùng</span>
        </NavLink>
        <NavLink
          to={PATH.DASHBOARD_CATEGORY}
          className={({ isActive }) =>
            classNames('flex items-center rounded-tr-sm rounded-br-sm py-2 px-5 mt-1', {
              'hover:bg-slate-100': !isActive,
              'bg-gradient-to-r from-sky-500/30 to-indigo-500/30': isActive
            })
          }
        >
          <ShoppingBagIcon className='w-4 h-4 stroke-black' />
          <span className='text-sm ml-3 capitalize font-medium'>Danh mục sản phẩm</span>
        </NavLink>
        <NavLink
          to={PATH.HOME}
          className={({ isActive }) =>
            classNames('flex items-center rounded-tr-sm rounded-br-sm py-2 px-5 mt-1', {
              'hover:bg-slate-100': !isActive,
              'bg-gradient-to-r from-sky-500/30 to-indigo-500/30': isActive
            })
          }
        >
          <ItemIcon className='w-4 h-4 fill-none' />
          <span className='text-sm ml-3 capitalize font-medium'>Sản phẩm</span>
        </NavLink>
        <NavLink
          to={PATH.HOME}
          className={({ isActive }) =>
            classNames('flex items-center rounded-tr-sm rounded-br-sm py-2 px-5 mt-1', {
              'hover:bg-slate-100': !isActive,
              'bg-gradient-to-r from-sky-500/30 to-indigo-500/30': isActive
            })
          }
        >
          <NewspaperIcon className='w-4 h-4 fill-none' />
          <span className='text-sm ml-3 capitalize font-medium'>Blog</span>
        </NavLink>
      </div>
      <div className='py-5 px-6 pl-0'>
        <button className='flex items-center rounded py-3 px-4 hover:bg-slate-100 w-full'>
          <LogoutIcon className='w-4 h-4 fill-none' />
          <span className='text-sm ml-3 capitalize font-medium'>Đăng xuất</span>
        </button>
      </div>
    </aside>
  );
};

export default DashboardSidebar;
