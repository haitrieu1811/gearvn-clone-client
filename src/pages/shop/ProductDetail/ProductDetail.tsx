import { useQuery } from '@tanstack/react-query';
import classNames from 'classnames';
import DOMPurify from 'dompurify';
import { useEffect, useMemo, useRef, useState } from 'react';
import { useParams } from 'react-router-dom';

import productApi from 'src/apis/product.api';
import { ArrowLeftIcon, ArrowRightIcon } from 'src/components/Icons';
import Loading from 'src/components/Loading';
import { formatCurrency, getIdFromNameId, getImageUrl, rateSale } from 'src/utils/utils';

const ProductDetail = () => {
  const { name_id } = useParams();
  const productId = getIdFromNameId(name_id as string);
  const [indexCurrentImages, setIndexCurrentImages] = useState<number[]>([0, 5]);
  const [activeImage, setActiveImage] = useState<string>('');
  const imageRef = useRef<HTMLImageElement>(null);

  // Lấy thông tin chi tiết sản phẩm
  const getProductQuery = useQuery({
    queryKey: ['product', productId],
    queryFn: () => productApi.getDetail(productId),
    enabled: Boolean(productId)
  });

  const product = useMemo(() => getProductQuery.data?.data.data.product, [getProductQuery.data?.data.data.product]);
  const currentImages = useMemo(
    () => (product && product.images ? product.images.slice(...indexCurrentImages) : []),
    [product, indexCurrentImages]
  );

  // Active hình ảnh đầu tiên của sản phẩm
  useEffect(() => {
    if (product && product.images && product.images.length > 0) {
      setActiveImage(product.images[0].name);
    }
  }, [product]);

  // Prev slider hình ảnh
  const prevSliderImages = () => {
    if (indexCurrentImages[0] > 0) {
      setIndexCurrentImages((prevState) => [prevState[0] - 1, prevState[1] - 1]);
    }
  };

  // Next slider hình ảnh
  const nextSliderImages = () => {
    if (product && product.images) {
      if (indexCurrentImages[1] < product.images.length) {
        setIndexCurrentImages((prevState) => [prevState[0] + 1, prevState[1] + 1]);
      }
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
    <div className='my-4'>
      {product && !getProductQuery.isLoading && (
        <div className='container'>
          <div className='flex justify-between bg-white rounded'>
            {/* Hình ảnh sản phẩm */}
            <div className='p-6 w-[420px]'>
              <div
                className='overflow-hidden pt-[100%] relative hover:cursor-zoom-in'
                onMouseMove={handleZoomImage}
                onMouseLeave={handleRemoveZoomImage}
              >
                <img
                  ref={imageRef}
                  src={getImageUrl(activeImage)}
                  alt={product.name_vi}
                  className='absolute inset-0 w-full h-full object-cover rounded'
                />
              </div>
              {product.images && product.images.length > 0 && (
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
                          className={classNames(
                            'col-span-2 bg-white border rounded cursor-pointer relative pt-[100%]',
                            {
                              'border-primary': isActive,
                              'border-transparent': !isActive
                            }
                          )}
                          onClick={() => setActiveImage(image.name)}
                        >
                          <img
                            src={getImageUrl(image.name)}
                            alt={image.name}
                            className='absolute inset-0 rounded object-cover w-full h-full'
                          />
                        </div>
                      );
                    })}
                  </div>
                  {indexCurrentImages[1] < product.images.length && (
                    <button
                      className='absolute right-1 top-1/2 -translate-y-1/2 border bg-white w-[32px] h-[32px] rounded-full hidden items-center justify-center shadow group-hover:flex'
                      onClick={nextSliderImages}
                    >
                      <ArrowRightIcon className='w-3 h-3' />
                    </button>
                  )}
                </div>
              )}
            </div>
            {/* Thông tin sản phẩm */}
            <div className='flex-1 p-6 border-l'>
              <h1 className='font-semibold text-2xl'>{product.name_vi}</h1>
              <div className='flex items-center mt-4'>
                <div className='text-primary font-semibold text-[32px]'>
                  {formatCurrency(product.price_after_discount)}đ
                </div>
                {product.price > product.price_after_discount && (
                  <div className='text-lg ml-3 line-through text-[#6D6E72]'>{formatCurrency(product.price)}đ</div>
                )}
                {rateSale(product.price, product.price_after_discount) > 0 && (
                  <span className='text-[12px] py-[3px] px-2 ml-3 text-primary border border-primary rounded-sm whitespace-nowrap'>
                    -{rateSale(product.price, product.price_after_discount)}%
                  </span>
                )}
              </div>
              <div className='flex mt-4'>
                <button className='border border-primary rounded text-primary text-lg px-6 py-2 bg-primary/10 hover:opacity-80'>
                  Thêm vào giỏ hàng
                </button>
                <button className='border border-primary rounded text-white text-lg px-6 py-2 bg-primary ml-4 hover:opacity-80'>
                  Mua ngay
                </button>
              </div>
              <div
                className='mt-6 text-[#333333] leading-loose'
                dangerouslySetInnerHTML={{
                  __html: DOMPurify.sanitize(product.general_info)
                }}
              />
            </div>
          </div>
          <div className='flex justify-between items-start mt-4'>
            {/* Mô tả sản phẩm */}
            <div className='flex-1 bg-white rounded'>
              <h2 className='font-semibold text-2xl py-4 px-6'>Mô tả sản phẩm</h2>
              <div
                dangerouslySetInnerHTML={{
                  __html: DOMPurify.sanitize(product.description)
                }}
                className='px-6 pb-6 text-[#333333] leading-loose'
              />
            </div>
            {/* Thông số kỹ thuật */}
            <div className='w-[40%] bg-white rounded ml-4'>
              <h2 className='font-semibold text-2xl py-4 px-6'>Thông số kỹ thuật</h2>
              <div
                dangerouslySetInnerHTML={{
                  __html: DOMPurify.sanitize(product.specifications || '')
                }}
                className='px-6 pb-6 text-[#333333] leading-loose'
              />
            </div>
          </div>
        </div>
      )}
      {getProductQuery.isLoading && (
        <div className='bg-white min-h-screen rounded shadow-sm flex justify-center pt-[50px]'>
          <Loading className='w-12 h-12' />
        </div>
      )}
    </div>
  );
};

export default ProductDetail;
