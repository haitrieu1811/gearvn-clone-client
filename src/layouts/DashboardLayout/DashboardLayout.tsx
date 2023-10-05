import PropTypes from 'prop-types';
import { ReactNode, useContext } from 'react';

import ChatBox from 'src/components/ChatBox';
import { ChatContext } from 'src/contexts/chat.context';
import HeaderDashboard from '../components/HeaderDashboard';
import SidebarDashboard from '../components/SidebarDashboard';

const DashboardLayout = ({ children }: { children: ReactNode }) => {
  const { isOpenChat, setIsOpenChat } = useContext(ChatContext);
  return (
    <div className='flex'>
      <SidebarDashboard />
      <div className='flex-1'>
        {/* Header */}
        <HeaderDashboard />
        <div className='min-h-screen'>
          <div className='bg-white p-4 pb-0'>{children}</div>
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
