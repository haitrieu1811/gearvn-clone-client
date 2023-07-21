import { Link } from 'react-router-dom';
import { CaretDownIcon, ClockIcon } from 'src/components/Icons';
import PATH from 'src/constants/path';

const Blog = () => {
  return (
    <div>
      <div className='container my-4 bg-white rounded shadow-sm pb-8'>
        <div className='grid grid-cols-12 gap-10 pt-4'>
          <div className='col-span-7'>
            <div>
              <Link to={PATH.HOME}>
                <img
                  src='https://file.hstatic.net/200000722513/article/thumb_youtube_community_4d473164c65340958af754254fb8d691_1024x1024.jpg'
                  alt=''
                  className='w-full h-[360px] object-top object-cover rounded-sm'
                />
              </Link>
              <Link to={PATH.HOME} className='font-medium text-[22px] mt-4 block line-clamp-2'>
                Giải mã trào lưu Flex là gì ? Sức hút và ảnh hưởng trong cộng đồng trẻ
              </Link>
            </div>
          </div>
          <div className='col-span-5'>
            <Link to={PATH.HOME}>
              <img
                src='https://file.hstatic.net/200000722513/article/gearvn-tiktok-music-2_0ea06b7a0d204c2f8738b9a4d76e2e05_grande.png'
                alt=''
                className='w-full h-[240px] object-cover'
              />
            </Link>
            <Link to={PATH.HOME} className='line-clamp-2 font-medium'>
              TikTok Music 10 điểm là 10 điểm, không có nhưng!
            </Link>
            <p className='text-[#333333] text-sm leading-loose'>
              Khi nhắc đến ứng dụng nghe nhạc, Spotify và Apple Music là hai cái tên đầu tiên nhảy số trong đầu nhiều
              người và cũng là những ông lớn mà nhiều công ty âm nhạc hướng đến. Mặc dù cho đến nay, vẫn chưa có ai làm
              được điều đó. Tuy nhiên, TikTok Music sẽ gia nhập đường đua và hứa hẹn sẽ là “tân binh khủng long” về ứng
              dụng...
            </p>
          </div>
        </div>
        <div className='grid grid-cols-12 gap-4 mt-6'>
          {Array(4)
            .fill(0)
            .map((_, index) => (
              <div key={index} className='col-span-3'>
                <Link to={PATH.HOME}>
                  <img
                    src='https://file.hstatic.net/200000722513/article/gearvn-aov-day-2023_039e9ec7dadc443dbcfa5d0d9a47d1fc_grande.jpg'
                    alt=''
                    className='w-full h-[160px] object-cover rounded-sm'
                  />
                </Link>
                <Link to={PATH.HOME} className='text-[#333333] font-medium line-clamp-2 block mt-2'>
                  AOV Day 2023 - Ngày hội Liên Quân Free Skin Keera
                </Link>
              </div>
            ))}
        </div>
        <div className='mt-6'>
          {Array(8)
            .fill(0)
            .map((_, index) => (
              <div key={index} className='border-t border-slate-300 py-6 flex items-start'>
                <Link to={PATH.HOME}>
                  <img
                    src='https://file.hstatic.net/200000722513/article/gearvn-final-fantasy-xvi-8_77a6c7dedd0c45728c09b2d0093d401a_grande.png'
                    alt=''
                    className='h-[122px] w-[218px] object-cover rounded'
                  />
                </Link>
                <div className='flex-1 ml-4'>
                  <Link to={PATH.HOME} className='font-medium mb-[10px] block'>
                    Final Fantasy XVI: Sự đổi mới trong cốt truyện & gameplay?
                  </Link>
                  <div className='flex items-center text-sm'>
                    <span className='flex items-center'>
                      <ClockIcon className='w-4 h-4' />
                      <span className='text-slate-500 ml-1'>Thứ Năm 22,06,2023</span>
                    </span>
                    <span className='w-1 h-1 rounded-full bg-slate-500 block mx-2' />
                    <span className='text-blue-600'>Lê Thị Mỹ Duyên</span>
                  </div>
                </div>
              </div>
            ))}
        </div>
        <div
          className='border py-3 flex justify-center items-center text-[#1982F9]'
          tabIndex={0}
          aria-hidden='true'
          role='button'
        >
          Xem thêm bài viết <CaretDownIcon className='w-3 h-3 fill-[#1982F9] ml-3' />
        </div>
      </div>
    </div>
  );
};

export default Blog;
