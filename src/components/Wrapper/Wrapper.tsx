import { ReactNode } from 'react';
import classNames from 'classnames';

const Wrapper = ({ children, arrow }: { children: ReactNode; arrow?: boolean }) => {
  return (
    <div
      className={classNames('bg-white rounded shadow-md relative', {
        'before:absolute before:right-6 before:bottom-full before:border-[10px] before:border-transparent before:border-b-white':
          arrow
      })}
    >
      {children}
    </div>
  );
};

export default Wrapper;
