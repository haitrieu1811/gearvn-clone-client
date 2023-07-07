import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useMatch } from 'react-router-dom';

import PATH from 'src/constants/path';
import logo from 'src/assets/images/logo-red.svg';

const HeaderAuth = () => {
  const { t } = useTranslation('pages');
  const match = useMatch(PATH.REGISTER);
  const isRegister = Boolean(match);

  return (
    <header className='bg-white'>
      <nav className='flex items-center justify-between container py-4'>
        <div className='flex items-center'>
          <Link to={PATH.HOME} className='md:w-[150px] block w-[120px]'>
            <img src={logo} alt='Logo' />
          </Link>
          <h1 className='font-medium md:text-2xl ml-5 text-xl capitalize'>
            {isRegister ? t('register_login.register') : t('register_login.login')}
          </h1>
        </div>
      </nav>
    </header>
  );
};

export default HeaderAuth;
