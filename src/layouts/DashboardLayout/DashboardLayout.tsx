import PropTypes from 'prop-types';
import { ReactNode, useContext } from 'react';

import ChatBox from 'src/components/ChatBox';
import { AppContext } from 'src/contexts/app.context';
import HeaderDashboard from '../components/HeaderDashboard';
import SidebarDashboard from '../components/SidebarDashboard';

const DashboardLayout = ({ children }: { children: ReactNode }) => {
  const { isOpenChat, setIsOpenChat } = useContext(AppContext);

  return (
    <div className='bg-[#f8f8f8] flex'>
      <SidebarDashboard />
      <div className='flex-1'>
        {/* Header */}
        <HeaderDashboard />
        <div className='min-h-screen p-4 pb-0'>
          <div className='bg-white rounded'>{children}</div>
        </div>
        <ChatBox visible={isOpenChat} onClose={() => setIsOpenChat(false)} />
      </div>
    </div>
  );
};

DashboardLayout.propTypes = {
  children: PropTypes.node.isRequired
};

export default DashboardLayout;
