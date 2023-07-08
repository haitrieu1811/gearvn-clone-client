import { ReactNode } from 'react';

const Wrapper = ({ children }: { children: ReactNode }) => {
  return <div className='bg-white rounded shadow-md'>{children}</div>;
};

export default Wrapper;
