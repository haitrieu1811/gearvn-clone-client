import { ReactNode } from 'react';

import DashboardSidebar from '../components/DashboardSidebar';
import { BellIcon, SearchIcon } from 'src/components/Icons';

const DashboardLayout = ({ children }: { children: ReactNode }) => {
  return (
    <div className='bg-[#eff0f6]'>
      <div className='flex'>
        <DashboardSidebar />
        <div className='flex-1 ml-[240px] min-h-screen pt-8 px-7 pb-0'>
          <div className='flex justify-between items-center mb-10'>
            <h1 className='font-extrabold text-2xl'>Hello, haitrieu1811! Welcome back</h1>
            <div className='flex'>
              <div className='relative'>
                <input type='text' placeholder='Search' className='text-sm rounded px-3 py-2 outline-none pr-10' />
                <button className='absolute top-1/2 -translate-y-1/2 right-1 h-full w-10 flex justify-center items-center'>
                  <SearchIcon className='w-4 h-4' />
                </button>
              </div>
              <button className='rounded bg-white px-2 flex justify-center items-center ml-3 relative'>
                <BellIcon className='w-5 h-5 fill-none' />
                <span className='absolute -top-2 -right-2 bg-red-500 text-xs text-white font-bold rounded-full w-5 h-5 flex justify-center items-center'>
                  2
                </span>
              </button>
            </div>
          </div>
          <div className=''>{children}</div>
        </div>
      </div>
    </div>
  );
};

export default DashboardLayout;
