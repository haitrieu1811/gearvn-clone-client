import { ReactNode, useContext, useState } from 'react';
import { useMediaQuery } from 'react-responsive';
import { Link } from 'react-router-dom';

import ChatBox from 'src/components/ChatBox';
import {
  ChatIcon,
  ChevronDownIcon,
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
  const isTablet = useMediaQuery({ maxWidth: CONFIG.TABLET_SCREEN_SIZE });
  const [isShowChat, setIsShowChat] = useState<boolean>(false);
  const { isAuthenticated } = useContext(AppContext);

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

      {isAuthenticated && (
        <div
          onClick={() => setIsShowChat(true)}
          className='fixed bottom-0 right-5 flex justify-center items-center bg-primary rounded-t px-4 py-2 cursor-pointer select-none'
        >
          <ChatIcon className='w-6 h-6 text-white' />
          <span className='text-white text-lg font-semibold ml-3'>Chat</span>
          <span className='absolute -top-3 -right-3 bg-primary text-white text-xs font-medium w-6 h-6 rounded-full flex justify-center items-center border-[2px]'>
            9+
          </span>
        </div>
      )}

      {isShowChat && (
        <div className='fixed bottom-0 right-2 z-10 shadow-3xl rounded-t-lg overflow-hidden w-[640px]'>
          <div className='flex justify-between items-center py-2 pl-6 pr-3 border-b bg-white'>
            <Link to={PATH.CHAT} className='text-primary font-semibold text-lg flex items-center'>
              Chat <span className='text-xs font-normal ml-1'>(28)</span>
            </Link>
            <div>
              <button className='py-1 px-2' onClick={() => setIsShowChat(false)}>
                <ChevronDownIcon className='w-4 h-4' />
              </button>
            </div>
          </div>
          <ChatBox />
        </div>
      )}

      <Footer />
    </div>
  );
};

export default MainLayout;
