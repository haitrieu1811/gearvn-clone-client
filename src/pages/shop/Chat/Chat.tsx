import ChatList from 'src/components/ChatList';
import ChatWindow from 'src/components/ChatWindow';

const Chat = () => {
  return (
    <div>
      <div className='container my-4 flex'>
        <div className='w-[300px] h-[600px] max-h-[800px] overflow-y-auto'>
          <ChatList />
        </div>
        <div className='flex-1 ml-4 h-[600px] max-h-[800px] overflow-y-auto'>
          <ChatWindow />
        </div>
      </div>
    </div>
  );
};

export default Chat;
