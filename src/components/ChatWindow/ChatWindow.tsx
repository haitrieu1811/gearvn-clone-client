import { Fragment } from 'react';
import { SendMessageIcon } from '../Icons';

const ChatWindow = () => {
  return (
    <div>
      <div>
        {Array(20)
          .fill(0)
          .map((_, index) => (
            <Fragment key={index}>
              <div className='flex mb-4'>
                <div className='bg-white rounded-lg shadow py-2 px-4 max-w-[80%]'>
                  <div className='text-slate-700 text-[15px]'>Xin chào! Chúng tôi có thể giúp gì cho bạn?</div>
                  <div className='text-right text-xs text-slate-400 mt-1'>1 ngày trước</div>
                </div>
              </div>

              <div className='flex justify-end mb-4'>
                <div className='bg-[#d7f7ef] rounded-lg shadow py-2 px-4 max-w-[80%]'>
                  <div className='text-slate-700 text-[15px]'>
                    Hàng e vẫn chưa nhận đc. Nếu k ấy thì shop gửi lại tiền cho e e trả hàng lại cho shop để e đi mua
                    chỗ khác
                  </div>
                  <div className='text-right text-xs text-slate-400 mt-1'>1 ngày trước</div>
                </div>
              </div>
            </Fragment>
          ))}
      </div>

      {/* Input */}
      <form className='bg-white border-t flex h-[50px]'>
        <input
          type='text'
          placeholder='Nhập nội dung tin nhắn'
          className='w-full py-3 pl-4 pr-1 outline-none text-slate-600'
        />
        <button className='w-12 flex justify-center items-center'>
          <SendMessageIcon className='w-4 h-4 stroke-slate-600' />
        </button>
      </form>
    </div>
  );
};

export default ChatWindow;
