import { Fragment, ReactNode, useEffect } from 'react';
import { useLocation } from 'react-router';

const ScrollToTop = ({ children }: { children: ReactNode }) => {
  const location = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location]);
  return <Fragment>{children}</Fragment>;
};

export default ScrollToTop;
