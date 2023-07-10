import { ReactNode } from 'react';
import Footer from '../components/Footer';
import Header from '../components/Header';

const MainLayout = ({ children }: { children: ReactNode }) => {
  return (
    <div className='bg-[#ececec]'>
      <Header />
      {children}
      <Footer />
    </div>
  );
};

export default MainLayout;
