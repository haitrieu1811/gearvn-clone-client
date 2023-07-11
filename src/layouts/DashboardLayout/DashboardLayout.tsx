import { ReactNode } from 'react';

import { BellIcon } from 'src/components/Icons';
import DashboardSidebar from '../components/DashboardSidebar';

const DashboardLayout = ({ children }: { children: ReactNode }) => {
  return (
    <div className='bg-[#eff0f6]'>
      <div className='flex'>
        <DashboardSidebar />
        <div className='flex-1 ml-[240px] min-h-screen pt-8 px-4 pb-0'>
          <div className='flex justify-between items-center mb-8'>
            <h1 className='font-bold text-2xl'>Hello, haitrieu1811! Welcome back</h1>
            <div className='flex'>
              <button className='rounded bg-white p-2 flex justify-center items-center ml-3 relative'>
                <BellIcon className='w-5 h-5 fill-none' />
                <span className='absolute -top-2 -right-2 bg-red-500 text-xs text-white font-bold rounded-full w-5 h-5 flex justify-center items-center'>
                  2
                </span>
              </button>
            </div>
          </div>
          {children}
        </div>
      </div>
    </div>
  );
};

export default DashboardLayout;
