import classNames from 'classnames';
import PropTypes from 'prop-types';
import { ReactNode } from 'react';
import { useMediaQuery } from 'react-responsive';

import CONFIG from 'src/constants/config';

const Wrapper = ({ children, arrow }: { children: ReactNode; arrow?: boolean }) => {
  const isMobile = useMediaQuery({ maxWidth: CONFIG.MOBILE_SCREEN_SIZE });
  return (
    <div
      className={classNames('bg-white rounded-sm shadow-lg', {
        'relative before:absolute before:right-6 before:bottom-full before:border-[10px] before:border-transparent before:border-b-white':
          arrow && !isMobile
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
