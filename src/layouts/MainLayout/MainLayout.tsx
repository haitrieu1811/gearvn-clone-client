import { Fragment, ReactNode } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';

const MainLayout = ({ children }: { children: ReactNode }) => {
  return (
    <Fragment>
      <Header />
      {children}
      <Footer />
    </Fragment>
  );
};

export default MainLayout;
