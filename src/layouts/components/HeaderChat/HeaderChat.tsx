import { Link } from 'react-router-dom';

import logo from 'src/assets/images/favicon.ico';
import PATH from 'src/constants/path';

const HeaderChat = () => {
  return (
    <header className='bg-white shadow-sm'>
      <nav className='container py-3'>
        <div className='flex items-center'>
          <Link to={PATH.HOME}>
            <img src={logo} alt='logo' className='w-9 h-9 object-contain' />
          </Link>
          <span className='text-red-500 text-3xl font-semibold ml-3'>Chat</span>
        </div>
      </nav>
    </header>
  );
};

export default HeaderChat;
