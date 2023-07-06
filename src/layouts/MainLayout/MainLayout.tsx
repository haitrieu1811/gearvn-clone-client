import { Fragment, ReactNode } from 'react';

const MainLayout = ({ children }: { children: ReactNode }) => {
  return <Fragment>{children}</Fragment>;
};

export default MainLayout;
