import classNames from 'classnames';
import PropTypes from 'prop-types';
import { Fragment, useEffect, useState } from 'react';
import { createPortal } from 'react-dom';

import { ChevronLeftIcon, ChevronRightIcon, CloseIcon, SearchMinusIcon, SearchPlusIcon } from '../Icons';
import Image from '../Image';

interface PreviewImagesProps {
  images: string[];
  isVisible: boolean;
  onClose?: () => void;
}

const PreviewImages = ({ images, isVisible, onClose }: PreviewImagesProps) => {
  const [activeImage, setActiveImage] = useState<string>('');
  const [currentIndex, setCurrentIndex] = useState<number>(0);

  // Active hình ảnh đầu tiên của sản phẩm
  useEffect(() => {
    if (images && images.length > 0) {
      setActiveImage(images[currentIndex]);
    }
  }, [images, currentIndex]);

  // Đóng
  const handleClose = () => {
    images.length > 0 && onClose && onClose();
    setCurrentIndex(0);
  };

  // Vô hiệu hóa cuộn trang khi mở
  useEffect(() => {
    if (isVisible) document.body.classList.add('disable-scroll');
    else document.body.classList.remove('disable-scroll');
  }, [isVisible]);

  // Prev hình ảnh
  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex((prevState) => prevState - 1);
    }
  };

  // Next hình ảnh
  const handleNext = () => {
    if (currentIndex < images.length - 1) {
      setCurrentIndex((prevState) => prevState + 1);
    }
  };

  return createPortal(
    <Fragment>
      {isVisible && (
        <div className='fixed inset-0 z-[999999] backdrop-blur-sm'>
          {/* Mask */}
          <div className='bg-slate-900/50 absolute inset-0' />
          {/* Hình ảnh */}
          <div className='absolute inset-0 overflow-hidden flex justify-center items-center'>
            <Image src={activeImage} className='w-full lg:w-1/2 object-contain' />
          </div>
          {/* Đóng */}
          <button
            onClick={handleClose}
            className='absolute top-4 right-4 bg-black/30 w-10 h-10 rounded-full flex justify-center items-center'
          >
            <CloseIcon className='w-6 h-6 stroke-white' />
          </button>
          {/* Trở về */}
          <button
            onClick={handlePrev}
            className={classNames(
              'absolute top-1/2 -translate-y-1/2 left-4 bg-black/30 w-10 h-10 rounded-full flex justify-center items-center',
              {
                'cursor-not-allowed': currentIndex === 0
              }
            )}
          >
            <ChevronLeftIcon className='w-6 h-6 stroke-white' />
          </button>
          {/* Tiến tới */}
          <button
            onClick={handleNext}
            className={classNames(
              'absolute top-1/2 -translate-y-1/2 right-4 bg-black/30 w-10 h-10 rounded-full flex justify-center items-center',
              {
                'cursor-not-allowed': currentIndex === images.length - 1
              }
            )}
          >
            <ChevronRightIcon className='w-6 h-6 stroke-white' />
          </button>
          {/* Thao tác với ảnh */}
          <div className='absolute bottom-4 left-1/2 -translate-x-1/2 flex flex-col items-center'>
            <div className='mb-5 text-white font-semibold'>
              {currentIndex + 1} / {images.length}
            </div>
            <div className='bg-black/20 rounded-full flex'>
              <button className='w-12 h-12 flex justify-center items-center'>
                <SearchPlusIcon className='w-5 h-5 stroke-white' />
              </button>
              <button className='w-12 h-12 flex justify-center items-center'>
                <SearchMinusIcon className='w-5 h-5 stroke-white' />
              </button>
            </div>
          </div>
        </div>
      )}
    </Fragment>,
    document.body
  );
};

PreviewImages.propTypes = {
  isVisible: PropTypes.bool.isRequired
};

export default PreviewImages;
