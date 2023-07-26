import { Outlet } from 'react-router-dom';
import AccountSidebar from 'src/layouts/components/AccountSidebar';

const Account = () => {
  return (
    <div>
      <div className='container my-4 grid grid-cols-12 gap-4'>
        <div className='col-span-3 bg-white rounded shadow-sm'>
          <AccountSidebar />
        </div>
        <div className='col-span-9'>
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default Account;
