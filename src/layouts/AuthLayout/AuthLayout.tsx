import { Fragment, ReactNode } from 'react';

import Footer from '../components/Footer';
import HeaderAuth from '../components/HeaderAuth';

const AuthLayout = ({ children }: { children: ReactNode }) => {
  return (
    <Fragment>
      <HeaderAuth />
      {children}
      <Footer />
    </Fragment>
  );
};

export default AuthLayout;
