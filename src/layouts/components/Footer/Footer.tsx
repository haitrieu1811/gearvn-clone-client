import { Link } from 'react-router-dom';

import FooterHeading from './FooterHeading';
import FooterLink from './FooterLink';

const Footer = () => {
  return (
    <footer className='bg-white'>
      <div className='py-10 container border-b'>
        <div className='grid grid-cols-12 gap-3'>
          <div className='lg:col-span-2 col-span-12'>
            <FooterHeading name='Về Gearvn' />
            <ul className='leading-loose'>
              <li>
                <FooterLink name='Giới thiệu' />
              </li>
              <li>
                <FooterLink name='Tuyển dụng' />
              </li>
            </ul>
          </div>
          <div className='lg:col-span-2 col-span-12 mt-4 lg:mt-0'>
            <FooterHeading name='Chính sách' />
            <ul className='leading-loose'>
              <li>
                <FooterLink name='Chính sách bảo hành' />
              </li>
              <li>
                <FooterLink name='Chính sách thanh toán' />
              </li>
              <li>
                <FooterLink name='Chính sách giao hàng' />
              </li>
              <li>
                <FooterLink name='Chính sách bảo mật' />
              </li>
            </ul>
          </div>
          <div className='lg:col-span-2 col-span-12 mt-4 lg:mt-0'>
            <FooterHeading name='Thông tin' />
            <ul className='leading-loose'>
              <li>
                <FooterLink name='Hệ thống cửa hàng' />
              </li>
              <li>
                <FooterLink name='Trung tâm bảo hành' />
              </li>
            </ul>
          </div>
          <div className='lg:col-span-3 col-span-12 mt-4 lg:mt-0'>
            <FooterHeading name='Tổng đài hỗ trợ' />
            <ul className='leading-loose'>
              <li className='flex items-center text-sm mt-3'>
                <span className='text-[#111111] w-[25%]'>Gọi mua</span>
                <Link to='tel:18006975' className='text-[#1982F9] font-bold mr-1'>
                  1800.6975
                </Link>
                <span className='text-[#111111]'>(8:00 - 21:00)</span>
              </li>
              <li className='flex items-center text-sm mt-3'>
                <span className='text-[#111111] w-[25%]'>CSKH</span>
                <Link to='tel:18006173' className='text-[#1982F9] font-bold mr-1'>
                  1800.6173
                </Link>
                <span className='text-[#111111]'>(8:00 - 21:00)</span>
              </li>
              <li className='flex items-center text-sm mt-3'>
                <span className='text-[#111111] w-[25%]'>Email</span>
                <Link to='mailto:18006173' className='text-[#1982F9] font-bold mr-1'>
                  cskh@gearvn.com
                </Link>
              </li>
            </ul>
          </div>
          <div className='lg:col-span-3 col-span-12 mt-6 lg:mt-0'>
            <FooterHeading name='Đơn vị vận chuyển' />
            <div className='grid grid-cols-12 gap-1'>
              <div className='col-span-3'>
                <img src='https://theme.hstatic.net/200000722513/1001065590/14/ship_1.png?v=1171' alt='' />
              </div>
              <div className='col-span-3'>
                <img src='https://theme.hstatic.net/200000722513/1001065590/14/ship_2.png?v=1171' alt='' />
              </div>
              <div className='col-span-3'>
                <img src='https://theme.hstatic.net/200000722513/1001065590/14/ship_3.png?v=1171' alt='' />
              </div>
              <div className='col-span-3'>
                <img src='https://theme.hstatic.net/200000722513/1001065590/14/ship_4.png?v=1171' alt='' />
              </div>
            </div>
            <FooterHeading name='Cách thức thanh toán' className='mt-6 lg:mt-4' />
            <div className='grid grid-cols-12 gap-1'>
              <div className='col-span-3'>
                <img src='https://theme.hstatic.net/200000722513/1001065590/14/pay_1.png?v=1171' alt='' />
              </div>
              <div className='col-span-3'>
                <img src='https://theme.hstatic.net/200000722513/1001065590/14/pay_2.png?v=1171' alt='' />
              </div>
              <div className='col-span-3'>
                <img src='https://theme.hstatic.net/200000722513/1001065590/14/pay_3.png?v=1171' alt='' />
              </div>
              <div className='col-span-3'>
                <img src='https://theme.hstatic.net/200000722513/1001065590/14/pay_4.png?v=1171' alt='' />
              </div>
              <div className='col-span-3'>
                <img src='https://theme.hstatic.net/200000722513/1001065590/14/pay_5.png?v=1171' alt='' />
              </div>
              <div className='col-span-3'>
                <img src='https://theme.hstatic.net/200000722513/1001065590/14/pay_6.png?v=1171' alt='' />
              </div>
              <div className='col-span-3'>
                <img src='https://theme.hstatic.net/200000722513/1001065590/14/pay_7.png?v=1171' alt='' />
              </div>
              <div className='col-span-3'>
                <img src='https://theme.hstatic.net/200000722513/1001065590/14/pay_8.png?v=1171' alt='' />
              </div>
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
              <img
                src='https://file.hstatic.net/200000636033/file/facebook_1_0e31d70174824ea184c759534430deec.png'
                className='w-8 h-8 object-cover mr-3'
                alt=''
              />
              <img
                src='https://file.hstatic.net/200000722513/file/tiktok-logo_fe1e020f470a4d679064cec31bc676e4.png'
                className='w-8 h-8 object-cover mr-3'
                alt=''
              />
              <img
                src='https://file.hstatic.net/200000636033/file/youtube_1_d8de1f41ca614424aca55aa0c2791684.png'
                className='w-8 h-8 object-cover mr-3'
                alt=''
              />
              <img
                src='https://file.hstatic.net/200000722513/file/2023-06-07_11.08.09_2bc09900263b4b1c8935646b4a7b2d32.jpg'
                className='w-8 h-8 object-cover mr-3'
                alt=''
              />
              <img
                src='https://file.hstatic.net/200000636033/file/group_1_54d23abd89b74ead806840aa9458661d.png'
                className='w-8 h-8 object-cover mr-3'
                alt=''
              />
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
  );
};

export default Footer;
