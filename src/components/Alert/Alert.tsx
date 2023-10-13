import { Fragment, ReactNode } from 'react';
import PropTypes from 'prop-types';

interface AlertProps {
  children: ReactNode;
  isVisible?: boolean;
}

const Alert = ({ children, isVisible = true }: AlertProps) => {
  return (
    <Fragment>
      {isVisible && (
        <div className='px-4 py-2 bg-yellow-100 text-sm font-medium inline-block mx-2 md:mx-6 rounded'>{children}</div>
      )}
    </Fragment>
  );
};

Alert.propTypes = {
  children: PropTypes.node.isRequired,
  isVisible: PropTypes.bool
};

export default Alert;
