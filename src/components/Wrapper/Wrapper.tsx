import classNames from 'classnames';
import { ReactNode } from 'react';
import PropTypes from 'prop-types';

const Wrapper = ({ children, arrow }: { children: ReactNode; arrow?: boolean }) => {
  return (
    <div
      className={classNames('bg-white rounded shadow-xl relative', {
        'before:absolute before:right-6 before:bottom-full before:border-[10px] before:border-transparent before:border-b-white':
          arrow
      })}
    >
      {children}
    </div>
  );
};

Wrapper.propTypes = {
  arrow: PropTypes.bool
};

export default Wrapper;
