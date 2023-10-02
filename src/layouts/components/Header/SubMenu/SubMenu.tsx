import { CoinIcon, CreditCardIcon, ItemIcon, NewspaperIcon, ShieldIcon, VideoIcon } from 'src/components/Icons';
import PATH from 'src/constants/path';
import SubMenuItem from '../SubMenuItem';

const SubMenu = () => {
  return (
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
  );
};

export default SubMenu;
