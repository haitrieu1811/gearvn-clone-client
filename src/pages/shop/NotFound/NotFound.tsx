import { Fragment } from 'react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';

import notFound from 'src/assets/images/404.webp';
import PATH from 'src/constants/path';

const NotFound = () => {
  return (
    <Fragment>
      <Helmet>
        <title>Không tìm thấy trang</title>
        <meta
          name='description'
          content='Mua sắm đồ công nghệ chính hãng với giá tốt nhất tại Gearvn-clone. Chúng tôi cung cấp đa dạng các sản phẩm công nghệ từ các thương hiệu nổi tiếng như Apple, Samsung, Huawei, Xiaomi,...'
        />
        <meta property='og:title' content='Không tìm thấy trang' />
        <meta
          property='og:description'
          content='Mua sắm đồ công nghệ chính hãng với giá tốt nhất tại Gearvn-clone. Chúng tôi cung cấp đa dạng các sản phẩm công nghệ từ các thương hiệu nổi tiếng như Apple, Samsung, Huawei, Xiaomi,...'
        />
        <meta
          property='og:image'
          content='https://gearvn-clone-ap-southeast-1.s3.ap-southeast-1.amazonaws.com/images/af998ec412e68932c8a77ba00.jpg'
        />
        <meta property='og:url' content={window.location.href} />
        <meta property='og:site_name' content='Không tìm thấy trang' />
        <meta property='og:type' content='website' />
      </Helmet>
      <div className='container flex justify-center items-center flex-col bg-white rounded shadow-sm my-2 md:my-4 pb-12'>
        <img src={notFound} alt='Not found' className='w-[70%]' />
        <div className='text-lg font-semibold mt-5 mb-[30px] text-center'>
          Rất tiếc trang bạn tìm kiếm đang không tồn tại
        </div>
        <div className='mb-[30px] text-lg text-center'>Nếu bạn cần hỗ trợ, vui lòng liên hệ tổng đài 1800 6975</div>
        <Link
          to={PATH.HOME}
          className='border border-[#1982F9] rounded px-[70px] py-3 text-[#1982F9] font-semibold text-sm'
        >
          QUAY LẠI TRANG CHỦ
        </Link>
      </div>
    </Fragment>
  );
};

export default NotFound;
