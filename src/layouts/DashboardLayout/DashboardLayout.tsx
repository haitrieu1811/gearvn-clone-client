import { ReactNode } from 'react';

import { BellIcon } from 'src/components/Icons';
import DashboardSidebar from '../components/DashboardSidebar';

const DashboardLayout = ({ children }: { children: ReactNode }) => {
  return (
    <div className='bg-[#f7f7f7]'>
      <div className='flex'>
        <DashboardSidebar />
        <div className='flex-1 ml-[240px] min-h-screen px-4'>
          <div className='flex justify-between items-center my-8'>
            <div></div>
            <div className='flex'>
              <button className='rounded bg-white p-2 flex justify-center items-center ml-3 relative'>
                <BellIcon className='w-5 h-5 fill-none' />
                <span className='absolute -top-1 -right-1  bg-red-500 text-xs text-white font-bold rounded-full w-4 h-4 flex justify-center items-center'>
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
