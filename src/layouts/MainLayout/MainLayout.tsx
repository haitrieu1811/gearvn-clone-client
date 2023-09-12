import PropTypes from 'prop-types';
import { Fragment, ReactNode, useContext } from 'react';
import { useMediaQuery } from 'react-responsive';

import ChatBox from 'src/components/ChatBox';
import {
  ChatIcon,
  CoinIcon,
  CreditCardIcon,
  ItemIcon,
  NewspaperIcon,
  ShieldIcon,
  VideoIcon
} from 'src/components/Icons';
import CONFIG from 'src/constants/config';
import PATH from 'src/constants/path';
import { AppContext } from 'src/contexts/app.context';
import Footer from '../components/Footer';
import Header from '../components/Header';
import SubMenuItem from '../components/Header/SubMenuItem';

const MainLayout = ({ children }: { children: ReactNode }) => {
  const { isAuthenticated, isOpenChat, setIsOpenChat } = useContext(AppContext);
  const isTablet = useMediaQuery({ maxWidth: CONFIG.TABLET_SCREEN_SIZE });

  return (
    <div className='bg-[#ececec]'>
      <Header />
      {!isTablet && (
        <div className='bg-white shadow-sm'>
          <div className='flex items-center justify-center'>
            <SubMenuItem icon={<ItemIcon className='fill-none w-5 h-5' />} name='Tổng hợp khuyến mãi' separate />
            <SubMenuItem
              to={PATH.BLOG}
              icon={<NewspaperIcon className='fill-none w-5 h-5' />}
              name='Tin công nghệ'
              separate
            />
            <SubMenuItem icon={<VideoIcon className='fill-none w-5 h-5' />} name='Video' separate />
            <SubMenuItem icon={<CreditCardIcon className='fill-none w-5 h-5' />} name='Hướng dẫn thanh toán' separate />
            <SubMenuItem icon={<CoinIcon className='fill-none w-5 h-5' />} name='Hướng dẫn trả góp' separate />
            <SubMenuItem icon={<ShieldIcon className='fill-none w-5 h-5' />} name='Chính sách bảo hành' />
          </div>
        </div>
      )}
      {children}
      {isAuthenticated && !isTablet && (
        <Fragment>
          <div
            onClick={() => setIsOpenChat(true)}
            className='fixed bottom-0 right-5 flex justify-center items-center bg-primary rounded-t px-4 py-2 cursor-pointer select-none z-[1]'
          >
            <ChatIcon className='w-6 h-6 text-white' />
            <span className='text-white text-lg font-semibold ml-3'>Chat</span>
            {/* {totalUnreadCount > 0 && (
          <span className='absolute -top-3 -right-3 bg-primary text-white text-xs font-medium w-6 h-6 rounded-full flex justify-center items-center border-[2px]'>
            {totalUnreadCount <= 9 ? totalUnreadCount : '9+'}
          </span>
        )} */}
          </div>

          <ChatBox visible={isOpenChat} onClose={() => setIsOpenChat(false)} />
        </Fragment>
      )}
      <Footer />
    </div>
  );
};

MainLayout.propTypes = {
  children: PropTypes.node.isRequired
};

export default MainLayout;
