import PropTypes from 'prop-types';
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

AuthLayout.propTypes = {
  children: PropTypes.node.isRequired
};

export default AuthLayout;
