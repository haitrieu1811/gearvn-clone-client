import classNames from 'classnames';
import PropTypes from 'prop-types';
import { ReactNode } from 'react';

const Wrapper = ({ children, arrow }: { children: ReactNode; arrow?: boolean }) => {
  return (
    <div
      className={classNames('bg-white rounded-sm shadow-lg', {
        'relative before:absolute before:right-6 before:bottom-full before:border-[10px] before:border-transparent before:border-b-white':
          arrow
      })}
    >
      {children}
    </div>
  );
};

Wrapper.propTypes = {
  children: PropTypes.node.isRequired,
  arrow: PropTypes.bool
};

export default Wrapper;
