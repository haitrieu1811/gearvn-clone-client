import classNames from 'classnames';
import PropTypes from 'prop-types';
import { Fragment, useEffect, useMemo, useRef, useState } from 'react';

import { Link } from 'react-router-dom';
import fallbackImage from 'src/assets/images/product-fallback.png';
import { ArrowLeftIcon, ArrowRightIcon } from 'src/components/Icons';
import Image from 'src/components/Image';
import { Image as ImageType } from 'src/types/product.type';
import { getImageUrl } from 'src/utils/utils';

interface SliderImagesProps {
  images: ImageType[];
}

const SliderImages = ({ images }: SliderImagesProps) => {
  const [indexCurrentImages, setIndexCurrentImages] = useState<number[]>([0, 5]);
  const [activeImage, setActiveImage] = useState<string>('');
  const imageRef = useRef<HTMLImageElement>(null);

  // Active hình ảnh đầu tiên của sản phẩm
  useEffect(() => {
    if (images && images.length > 0 && images[0]) {
      setActiveImage(images[0].name);
    }
  }, [images]);

  // Danh sách những hình ảnh đang nằm trong slide
  const currentImages = useMemo(
    () => (images ? images.slice(...indexCurrentImages) : []),
    [images, indexCurrentImages]
  );

  // Prev slider hình ảnh
  const prevSliderImages = () => {
    if (indexCurrentImages[0] <= 0) return;
    setIndexCurrentImages((prevState) => [prevState[0] - 1, prevState[1] - 1]);
  };

  // Next slider hình ảnh
  const nextSliderImages = () => {
    if (images && indexCurrentImages[1] < images.length) {
      setIndexCurrentImages((prevState) => [prevState[0] + 1, prevState[1] + 1]);
    }
  };

  // Zoom hình ảnh
  const handleZoomImage = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    const image = imageRef.current as HTMLImageElement;
    const { naturalWidth, naturalHeight } = image;
    const rect = e.currentTarget.getBoundingClientRect();

    const offsetX = e.pageX - (rect.x + window.scrollX);
    const offsetY = e.pageY - (rect.y + window.scrollY);

    const top = offsetY * (1 - naturalHeight / rect.height);
    const left = offsetX * (1 - naturalWidth / rect.width);

    image.style.width = `${naturalWidth}px`;
    image.style.height = `${naturalHeight}px`;
    image.style.maxWidth = 'unset';
    image.style.top = `${top}px`;
    image.style.left = `${left}px`;
  };

  // Bỏ zoom hình ảnh
  const handleRemoveZoomImage = () => {
    imageRef.current?.removeAttribute('style');
  };

  return (
    <Fragment>
      {/* Ảnh được hiển thị */}
      <div
        className='overflow-hidden pt-[100%] relative hover:cursor-zoom-in'
        onMouseMove={handleZoomImage}
        onMouseLeave={handleRemoveZoomImage}
      >
        <Link to={getImageUrl(activeImage)} target='_blank'>
          <Image
            ref={imageRef}
            src={activeImage}
            fallbackImage={fallbackImage}
            alt={images[0]?.name}
            className='absolute inset-0 w-full h-full object-cover rounded'
          />
        </Link>
      </div>
      {/* Danh sách hình ảnh */}
      {images && images.length > 0 && (
        <div className='relative group'>
          {indexCurrentImages[0] > 0 && (
            <button
              className='absolute left-1 top-1/2 -translate-y-1/2 border bg-white w-[32px] h-[32px] rounded-full  items-center justify-center shadow hidden group-hover:flex z-[1]'
              onClick={prevSliderImages}
            >
              <ArrowLeftIcon className='w-3 h-3' />
            </button>
          )}
          <div className='grid grid-cols-10 gap-2 mt-2'>
            {currentImages.map((image) => {
              const isActive = image.name === activeImage;
              return (
                <div
                  key={image._id}
                  className={classNames('col-span-2 bg-white border-[2px] rounded cursor-pointer relative pt-[100%]', {
                    'border-primary': isActive,
                    'border-transparent': !isActive
                  })}
                  onClick={() => setActiveImage(image.name)}
                >
                  <Image
                    src={image.name}
                    alt={image.name}
                    className='absolute inset-0 rounded object-cover w-full h-full'
                  />
                </div>
              );
            })}
          </div>
          {indexCurrentImages[1] < images.length && (
            <button
              className='absolute right-1 top-1/2 -translate-y-1/2 border bg-white w-[32px] h-[32px] rounded-full hidden items-center justify-center shadow group-hover:flex'
              onClick={nextSliderImages}
            >
              <ArrowRightIcon className='w-3 h-3' />
            </button>
          )}
        </div>
      )}
    </Fragment>
  );
};

SliderImages.propTypes = {
  images: PropTypes.array.isRequired
};

export default SliderImages;
