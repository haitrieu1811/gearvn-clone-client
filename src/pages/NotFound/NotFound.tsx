import { Link } from 'react-router-dom';
import notFound from 'src/assets/images/404.webp';
import PATH from 'src/constants/path';

const NotFound = () => {
  return (
    <div className='container flex justify-center items-center flex-col bg-white rounded shadow-sm my-4 pb-12'>
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
  );
};

export default NotFound;
