import classNames from 'classnames';
import { Fragment, useContext, useEffect, useMemo, useRef, useState } from 'react';

import fallbackImage from 'src/assets/images/product-fallback.png';
import { ArrowLeftIcon, ArrowRightIcon } from 'src/components/Icons';
import Image from 'src/components/Image';
import { ProductDetailContext } from '../ProductDetail';

const SliderImages = () => {
  const { imagesObject, setShowPreviewImages, setPreviewImages } = useContext(ProductDetailContext);
  const [indexCurrentImages, setIndexCurrentImages] = useState<number[]>([0, 5]);
  const [activeImage, setActiveImage] = useState<string>('');
  const imageRef = useRef<HTMLImageElement>(null);

  // Active hình ảnh đầu tiên của sản phẩm
  useEffect(() => {
    if (imagesObject && imagesObject.length > 0 && imagesObject[0]) {
      setActiveImage(imagesObject[0].name);
    }
  }, [imagesObject]);

  // Danh sách những hình ảnh đang nằm trong slide
  const currentImages = useMemo(
    () => (imagesObject ? imagesObject.slice(...indexCurrentImages) : []),
    [imagesObject, indexCurrentImages]
  );

  // Prev slider hình ảnh
  const prevSliderImages = () => {
    if (indexCurrentImages[0] > 0) {
      setIndexCurrentImages((prevState) => [prevState[0] - 1, prevState[1] - 1]);
    }
  };

  // Next slider hình ảnh
  const nextSliderImages = () => {
    if (imagesObject && indexCurrentImages[1] < imagesObject.length) {
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

  // Hiển thị danh sách hình ảnh
  const handleShowPreviewImages = () => {
    if (setShowPreviewImages && setPreviewImages && imagesObject && imagesObject.length > 0) {
      setShowPreviewImages(true);
      setPreviewImages(imagesObject.map((image) => image.name));
    }
  };

  return (
    <Fragment>
      <div
        className='overflow-hidden pt-[100%] relative hover:cursor-zoom-in'
        onMouseMove={handleZoomImage}
        onMouseLeave={handleRemoveZoomImage}
        onClick={handleShowPreviewImages}
      >
        <Image
          ref={imageRef}
          src={activeImage}
          fallbackImage={fallbackImage}
          alt={imagesObject[0]?.name}
          className='absolute inset-0 w-full h-full object-cover rounded'
        />
      </div>
      {imagesObject && imagesObject.length > 0 && (
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
          {indexCurrentImages[1] < imagesObject.length && (
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

export default SliderImages;
