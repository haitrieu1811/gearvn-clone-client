const ChatList = () => {
  return (
    <div>
      {Array(10)
        .fill(0)
        .map((_, index) => (
          <div
            key={index}
            className='flex py-4 pl-4 pr-6 relative hover:bg-slate-100'
            aria-hidden='true'
            role='button'
            tabIndex={0}
          >
            <img
              src='https://gearvn-clone-ap-southeast-1.s3.ap-southeast-1.amazonaws.com/images/977a9518243f1985fca916609.jpg'
              alt=''
              className='w-9 h-9 rounded-full object-cover flex-shrink-0'
            />
            <div className='flex-1 ml-3'>
              <h3 className='font-semibold line-clamp-1 text-sm'>Trần Hải Triều</h3>
              <p className='text-sm text-slate-500 line-clamp-1'>Chào bạn, tôi có thể giúp gì cho bạn?</p>
            </div>
            <span className='absolute top-3 right-2 w-4 h-4 rounded-full bg-primary text-white text-[8px] flex justify-center items-center'>
              9
            </span>
          </div>
        ))}
    </div>
  );
};

export default ChatList;
