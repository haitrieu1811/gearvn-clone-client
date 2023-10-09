import PropTypes from 'prop-types';
import { Fragment, ReactNode, useContext } from 'react';

import ChatBox from 'src/components/ChatBox';
import { ChatIcon } from 'src/components/Icons';
import { AppContext } from 'src/contexts/app.context';
import { ChatContext } from 'src/contexts/chat.context';
import Footer from '../components/Footer';
import Header from '../components/Header';
import SubMenu from '../components/Header/SubMenu';

interface MainLayoutProps {
  children: ReactNode;
}

const MainLayout = ({ children }: MainLayoutProps) => {
  const { isAuthenticated } = useContext(AppContext);
  const { totalUnreadMessagesCount, isOpenChat, setIsOpenChat, resetChat } = useContext(ChatContext);
  return (
    <Fragment>
      <Header />
      <SubMenu />
      {children}
      {/* Nút mở chatbox */}
      {isAuthenticated && (
        <Fragment>
          <div
            onClick={() => setIsOpenChat(true)}
            className='hidden md:flex justify-center items-center fixed bottom-0 right-5  bg-primary rounded-t px-3 py-2 cursor-pointer select-none z-[1]'
          >
            <ChatIcon className='w-6 h-6 text-white' />
            <span className='text-white text-lg font-semibold ml-3'>Chat</span>
            {totalUnreadMessagesCount > 0 && (
              <span className='absolute -top-3 -right-3 bg-primary text-white text-xs font-medium w-6 h-6 rounded-full flex justify-center items-center border-[2px]'>
                {totalUnreadMessagesCount <= 9 ? totalUnreadMessagesCount : '9+'}
              </span>
            )}
          </div>
          <ChatBox visible={isOpenChat} onClose={resetChat} />
        </Fragment>
      )}
      <Footer />
    </Fragment>
  );
};

MainLayout.propTypes = {
  children: PropTypes.node.isRequired
};

export default MainLayout;
