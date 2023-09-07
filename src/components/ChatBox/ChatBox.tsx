import ChatList from '../ChatList';
import ChatWindow from '../ChatWindow/ChatWindow';

const ChatBox = () => {
  return (
    <div className='bg-white border-slate-900'>
      <div className='flex'>
        {/* Sidebar */}
        <div className='w-1/3 border-r h-[500px] max-h-[500px] overflow-y-auto'>
          <ChatList />
        </div>
        {/* Chat window */}
        <div className='flex-1 bg-[#f8f8f8]'>
          {/* Messages */}
          <div className='p-4 h-[450px] max-h-[450px] overflow-y-auto'>
            <ChatWindow />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatBox;
