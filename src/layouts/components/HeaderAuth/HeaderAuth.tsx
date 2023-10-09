import { Link, useMatch } from 'react-router-dom';

import logo from 'src/assets/images/logo-red.svg';
import PATH from 'src/constants/path';

const HeaderAuth = () => {
  const match = useMatch(PATH.REGISTER);
  const isRegister = !!match;
  return (
    <header className='bg-white'>
      <nav className='flex items-center justify-between container py-4'>
        <div className='flex items-center'>
          <Link to={PATH.HOME} className='block w-[100px] md:w-[150px]'>
            <img src={logo} alt='Logo' />
          </Link>
          <h1 className='text-lg md:text-2xl ml-5 capitalize'>{isRegister ? 'Đăng ký' : 'Đăng nhập'}</h1>
        </div>
      </nav>
    </header>
  );
};

export default HeaderAuth;
