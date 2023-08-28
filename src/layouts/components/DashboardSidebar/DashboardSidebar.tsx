import { Link } from 'react-router-dom';

import logo from 'src/assets/images/logo-red.svg';
import { FlagIcon, ItemIcon, LogoutIcon, NewspaperIcon, ShoppingBagIcon, UserIcon } from 'src/components/Icons';
import PATH from 'src/constants/path';
import DashboardItem from './DashboardItem';

const DashboardSidebar = () => {
  return (
    <aside className='w-[240px] bg-white fixed z-[999] top-0 bottom-0 pb-10'>
      <div className='px-6 pt-6'>
        <Link to={PATH.HOME}>
          <img src={logo} alt='Logo' className='w-[150px]' />
        </Link>
      </div>
      <div className='py-5 px-6 pl-0 border-b'>
        {/* <DashboardItem
          path={PATH.DASHBOARD}
          icon={<ChartPieIcon className='w-4 h-4 stroke-black' />}
          name='Dashboard'
          end
        /> */}
        <DashboardItem
          path={PATH.DASHBOARD_USER}
          icon={<UserIcon className='w-4 h-4 stroke-black' />}
          name='Người dùng'
        />
        <DashboardItem
          path={PATH.DASHBOARD_CATEGORY}
          icon={<ShoppingBagIcon className='w-4 h-4 stroke-black' />}
          name='Danh mục'
        />
        <DashboardItem
          path={PATH.DASHBOARD_BRAND}
          icon={<FlagIcon className='w-4 h-4 stroke-black' />}
          name='Nhãn hiệu'
        />
        <DashboardItem
          path={PATH.DASHBOARD_PRODUCT}
          icon={<ItemIcon className='w-4 h-4 stroke-black' />}
          name='Sản phẩm'
        />
        <DashboardItem
          path={PATH.DASHBOARD_BLOG}
          icon={<NewspaperIcon className='w-4 h-4 stroke-black' />}
          name='Blog'
        />
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
