import PropTypes from 'prop-types';
import { Fragment, useEffect } from 'react';
import { createPortal } from 'react-dom';

import Loading from '../Loading';

interface FloatLoadingProps {
  isLoading: boolean;
}

const FloatLoading = ({ isLoading }: FloatLoadingProps) => {
  // Vô hiệu hóa cuộn trang khi đang tải
  useEffect(() => {
    if (isLoading) document.body.classList.add('disable-scroll');
    else document.body.classList.remove('disable-scroll');
  }, [isLoading]);

  return (
    <Fragment>
      {isLoading &&
        createPortal(
          <div className='bg-gray-200/50 fixed inset-0 z-[99999] flex justify-center items-center backdrop-blur-sm'>
            <Loading />
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
