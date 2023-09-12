import { ReactNode, useContext } from 'react';
import { useMediaQuery } from 'react-responsive';
import PropTypes from 'prop-types';

import ChatBox from 'src/components/ChatBox';
import { CoinIcon, CreditCardIcon, ItemIcon, NewspaperIcon, ShieldIcon, VideoIcon } from 'src/components/Icons';
import CONFIG from 'src/constants/config';
import PATH from 'src/constants/path';
import { AppContext } from 'src/contexts/app.context';
import Footer from '../components/Footer';
import Header from '../components/Header';
import SubMenuItem from '../components/Header/SubMenuItem';

const MainLayout = ({ children }: { children: ReactNode }) => {
  const { isAuthenticated } = useContext(AppContext);
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
      {isAuthenticated && <ChatBox />}
      <Footer />
    </div>
  );
};

MainLayout.propTypes = {
  children: PropTypes.node.isRequired
};

export default MainLayout;
