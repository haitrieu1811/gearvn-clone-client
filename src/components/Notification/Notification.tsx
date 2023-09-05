import classNames from 'classnames';

const Notification = () => {
  return (
    <div className='bg-white rounded-lg shadow-2xl w-[350px] pb-5'>
      <div className='flex justify-between items-center px-6 py-3'>
        <h3 className='text-lg font-semibold'>Thông báo</h3>
        <button className='ml-16 text-sm text-blue-600'>Đánh dấu tất cả đã đọc</button>
      </div>
      <div className='max-h-[500px] overflow-y-auto px-1'>
        {Array(10)
          .fill(0)
          .map((_, index) => (
            <div
              key={index}
              className={classNames('px-6 py-3 flex cursor-pointer', {
                'hover:bg-slate-100': index % 2 !== 0,
                'bg-blue-100': index % 2 === 0
              })}
            >
              <img
                src='https://fullstack.edu.vn/assets/images/f8_avatar.png'
                alt=''
                className='w-9 h-9 rounded object-cover'
              />
              <div className='flex-1 ml-5'>
                <p className='text-slate-600 text-sm line-clamp-3'>
                  Bài học Giới thiệu khóa học Sass mới được thêm vào Bài học Giới thiệu khóa học Sass mới được thêm vào
                  Bài học Giới thiệu khóa học Sass mới được thêm vào.
                </p>
                <p className='text-xs text-red-500 mt-1'>16 ngày trước</p>
              </div>
            </div>
          ))}
      </div>
    </div>
  );
};

export default Notification;
