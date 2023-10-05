import PropTypes from 'prop-types';
import { Fragment, ReactNode, useContext } from 'react';
import { useMediaQuery } from 'react-responsive';

import ChatBox from 'src/components/ChatBox';
import { ChatIcon } from 'src/components/Icons';
import CONFIG from 'src/constants/config';
import { AppContext } from 'src/contexts/app.context';
import { ChatContext } from 'src/contexts/chat.context';
import Footer from '../components/Footer';
import Header from '../components/Header';
import SubMenu from '../components/Header/SubMenu';

const MainLayout = ({ children }: { children: ReactNode }) => {
  const { isAuthenticated } = useContext(AppContext);
  const { unreadCount, isOpenChat, setIsOpenChat } = useContext(ChatContext);
  const isTablet = useMediaQuery({ maxWidth: CONFIG.TABLET_SCREEN_SIZE });
  return (
    <Fragment>
      <Header />
      {!isTablet && <SubMenu />}
      {children}
      {/* Nút mở chatbox */}
      {isAuthenticated && !isTablet && (
        <Fragment>
          <div
            onClick={() => setIsOpenChat(true)}
            className='fixed bottom-0 right-5 flex justify-center items-center bg-primary rounded-t px-3 py-2 cursor-pointer select-none z-[1]'
          >
            <ChatIcon className='w-5 h-5 text-white' />
            <span className='text-white text-lg font-semibold ml-3'>Chat</span>
            {unreadCount > 0 && (
              <span className='absolute -top-3 -right-3 bg-primary text-white text-xs font-medium w-6 h-6 rounded-full flex justify-center items-center border-[2px]'>
                {unreadCount <= 9 ? unreadCount : '9+'}
              </span>
            )}
          </div>
          <ChatBox visible={isOpenChat} onClose={() => setIsOpenChat(false)} />
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
