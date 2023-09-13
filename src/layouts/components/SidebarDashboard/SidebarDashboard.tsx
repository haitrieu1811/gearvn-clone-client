import { Link } from 'react-router-dom';

import logo from 'src/assets/images/logo-mobile.svg';
import {
  CheckoutIcon,
  FlagIcon,
  HomeIcon,
  ItemIcon,
  LogoutIcon,
  NewspaperIcon,
  ShoppingBagIcon,
  UserIcon
} from 'src/components/Icons';
import PATH from 'src/constants/path';
import DashboardItem from './DashboardItem';
import { useContext } from 'react';
import { AppContext } from 'src/contexts/app.context';

const SidebarDashboard = () => {
  const { logout } = useContext(AppContext);

  return (
    <aside className='w-[240px] h-screen bg-slate-800 sticky z-[999] right-0 top-0 bottom-0 pb-10 border-r'>
      <div className='p-5'>
        <Link to={PATH.DASHBOARD} className='flex items-center'>
          <img src={logo} alt='logo' className='w-8 h-8' />
          <span className='text-white text-xl font-bold ml-2 uppercase'>Admin</span>
        </Link>
      </div>
      <div className='p-4 pl-0 border-b'>
        <DashboardItem
          path={PATH.DASHBOARD_USER}
          icon={<UserIcon className='w-4 h-4 stroke-white' />}
          name='Người dùng'
        />
        <DashboardItem
          path={PATH.DASHBOARD_CATEGORY}
          icon={<ShoppingBagIcon className='w-4 h-4 text-white' />}
          name='Danh mục'
        />
        <DashboardItem
          path={PATH.DASHBOARD_BRAND}
          icon={<FlagIcon className='w-4 h-4 text-white' />}
          name='Nhãn hiệu'
        />
        <DashboardItem
          path={PATH.DASHBOARD_PRODUCT}
          icon={<ItemIcon className='w-4 h-4 text-white' />}
          name='Sản phẩm'
        />
        <DashboardItem path={PATH.DASHBOARD_BLOG} icon={<NewspaperIcon className='w-4 h-4 text-white' />} name='Blog' />
        <DashboardItem
          path={PATH.DASHBOARD_ORDER}
          icon={<CheckoutIcon className='w-4 h-4 text-white' />}
          name='Đơn hàng'
        />
      </div>
      <div className='py-5 px-6 pl-0'>
        <Link to={PATH.HOME} className='flex items-center rounded py-3 px-4 hover:bg-slate-700 w-full'>
          <HomeIcon className='w-4 h-4 text-white' />
          <span className='text-sm text-white ml-3 capitalize font-medium'>Về cửa hàng</span>
        </Link>
        <button onClick={logout} className='flex items-center rounded py-3 px-4 hover:bg-slate-700 w-full'>
          <LogoutIcon className='w-4 h-4 text-white' />
          <span className='text-sm text-white ml-3 capitalize font-medium'>Đăng xuất</span>
        </button>
      </div>
    </aside>
  );
};

export default SidebarDashboard;
