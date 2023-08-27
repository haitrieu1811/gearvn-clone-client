import PropTypes from 'prop-types';
import { createPortal } from 'react-dom';

import { LoadingIcon } from '../Icons';
import { Fragment } from 'react';

interface FloatLoadingProps {
  isLoading: boolean;
}

const FloatLoading = ({ isLoading }: FloatLoadingProps) => {
  return (
    <Fragment>
      {isLoading &&
        createPortal(
          <div className='bg-black/50 fixed inset-0 z-[99999] flex justify-center items-center'>
            <LoadingIcon className='w-8 h-8 md:w-12 md:h-12' />
          </div>,
          document.body
        )}
    </Fragment>
  );
};

FloatLoading.propTypes = {
  isLoading: PropTypes.bool.isRequired
};

export default FloatLoading;
