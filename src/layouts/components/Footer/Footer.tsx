import { Fragment } from 'react';
import { useMediaQuery } from 'react-responsive';

import StickyBottomMenu from 'src/components/StickyBottomMenu';
import FooterContact from './FooterContact';
import FooterHeading from './FooterHeading';
import FooterList from './FooterList';
import CONFIG from 'src/constants/config';

const Footer = () => {
  const isTablet = useMediaQuery({ maxWidth: CONFIG.TABLET_SCREEN_SIZE });

  return (
    <Fragment>
      <footer className='bg-white'>
        <div className='py-5 md:py-10 container border-b'>
          <div className='grid grid-cols-12 gap-3'>
            <FooterList heading='Về Gearvn' data={[{ name: 'Giới thiệu' }, { name: 'Tuyển dụng' }]} />
            <FooterList
              heading='Chính sách'
              data={[
                { name: 'Chính sách bảo hành' },
                { name: 'Chính sách bảo hành' },
                { name: 'Chính sách giao hàng' },
                { name: 'Chính sách bảo mật' }
              ]}
            />
            <FooterList heading='Thông tin' data={[{ name: 'Hệ thống cửa hàng' }, { name: 'Trung tâm bảo hành' }]} />
            <div className='lg:col-span-3 col-span-12 mt-4 lg:mt-0'>
              <FooterHeading name='Tổng đài hỗ trợ' />
              <ul className='leading-loose'>
                <li className='flex items-center text-sm mt-3'>
                  <FooterContact field='Gọi mua' to='1800.6975' time='(8:00 - 21:00)' />
                </li>
                <li className='flex items-center text-sm mt-3'>
                  <FooterContact field='CSKH' to='1800.6173' time='(8:00 - 21:00)' />
                </li>
                <li className='flex items-center text-sm mt-3'>
                  <FooterContact field='Email' to='cskh@gearvn.com' />
                </li>
              </ul>
            </div>
            <div className='lg:col-span-3 col-span-12 mt-6 lg:mt-0'>
              <FooterHeading name='Đơn vị vận chuyển' />
              <div className='grid grid-cols-12 gap-1'>
                {[
                  'https://theme.hstatic.net/200000722513/1001065590/14/ship_1.png?v=1171',
                  'https://theme.hstatic.net/200000722513/1001065590/14/ship_2.png?v=1171',
                  'https://theme.hstatic.net/200000722513/1001065590/14/ship_3.png?v=1171',
                  'https://theme.hstatic.net/200000722513/1001065590/14/ship_4.png?v=1171'
                ].map((url) => (
                  <div key={url} className='col-span-3'>
                    <img src={url} alt='' />
                  </div>
                ))}
              </div>
              <FooterHeading name='Cách thức thanh toán' className='mt-6 lg:mt-4' />
              <div className='grid grid-cols-12 gap-1'>
                {[
                  'https://theme.hstatic.net/200000722513/1001065590/14/pay_1.png?v=1171',
                  'https://theme.hstatic.net/200000722513/1001065590/14/pay_2.png?v=1171',
                  'https://theme.hstatic.net/200000722513/1001065590/14/pay_3.png?v=1171',
                  'https://theme.hstatic.net/200000722513/1001065590/14/pay_4.png?v=1171',
                  'https://theme.hstatic.net/200000722513/1001065590/14/pay_5.png?v=1171',
                  'https://theme.hstatic.net/200000722513/1001065590/14/pay_6.png?v=1171',
                  'https://theme.hstatic.net/200000722513/1001065590/14/pay_7.png?v=1171',
                  'https://theme.hstatic.net/200000722513/1001065590/14/pay_8.png?v=1171'
                ].map((url) => (
                  <div key={url} className='col-span-3'>
                    <img src={url} alt='' />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
        <div className='container'>
          <div className='flex justify-between items-center py-6 flex-wrap'>
            <div className='flex items-center w-full lg:w-auto flex-wrap'>
              <div className='uppercase font-semibold text-sm w-full text-center lg:w-auto lg:text-left'>
                Kết nối với chúng tôi
              </div>
              <div className='flex items-center ml-4 justify-center w-full lg:w-auto lg:justify-normal mt-4 lg:mt-0'>
                {[
                  'https://file.hstatic.net/200000636033/file/facebook_1_0e31d70174824ea184c759534430deec.png',
                  'https://file.hstatic.net/200000722513/file/tiktok-logo_fe1e020f470a4d679064cec31bc676e4.png',
                  'https://file.hstatic.net/200000636033/file/youtube_1_d8de1f41ca614424aca55aa0c2791684.png',
                  'https://file.hstatic.net/200000722513/file/2023-06-07_11.08.09_2bc09900263b4b1c8935646b4a7b2d32.jpg',
                  'https://file.hstatic.net/200000636033/file/group_1_54d23abd89b74ead806840aa9458661d.png'
                ].map((url, index) => (
                  <img key={index} src={url} className='w-8 h-8 object-cover mr-3' alt='' />
                ))}
              </div>
            </div>
            <div className='w-full lg:w-auto flex justify-center mt-4 lg:inline lg:justify-normal lg:mt-0'>
              <img
                src='https://theme.hstatic.net/200000722513/1001065590/14/logo-bct.png?v=1171'
                alt=''
                className='w-[133px]'
              />
            </div>
          </div>
        </div>
      </footer>
      {/* Sticky menu bottom */}
      {isTablet && <StickyBottomMenu />}
    </Fragment>
  );
};

export default Footer;
