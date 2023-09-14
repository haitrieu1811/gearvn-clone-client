import { useQuery } from '@tanstack/react-query';
import isEmpty from 'lodash/isEmpty';
import PropTypes from 'prop-types';
import { Fragment, useContext, useEffect, useMemo } from 'react';

import moment from 'moment';
import productApi from 'src/apis/product.api';
import socket from 'src/utils/socket';
import { StarIcon } from '../Icons';
import Image from '../Image';
import Loading from '../Loading';
import { ProductDetailContext } from 'src/pages/shop/ProductDetail/ProductDetail';

interface ProductReviewListProps {
  productId: string;
}

const ProductReviewList = ({ productId }: ProductReviewListProps) => {
  const { setShowPreviewImages, setPreviewImages } = useContext(ProductDetailContext);

  // Kết nối socket
  useEffect(() => {
    socket.on('receive_product_review', () => {
      getReviewsQuery.refetch();
    });
  }, []);

  // Lấy danh sách đánh giá sản phẩm
  const getReviewsQuery = useQuery({
    queryKey: ['reviews', productId],
    queryFn: () => productApi.getReviews(productId)
  });

  // Danh sách đánh giá sản phẩm
  const reviews = useMemo(() => getReviewsQuery.data?.data.data.reviews, [getReviewsQuery.data?.data.data.reviews]);

  // Xem danh sách hình ảnh đính kèm của đánh giá sản phẩm
  const handlePreviewImages = (images: string[]) => {
    setPreviewImages(images);
    setShowPreviewImages(true);
  };

  return (
    <Fragment>
      {reviews && reviews.length > 0 && !getReviewsQuery.isLoading && (
        <div>
          {reviews.map((review) => (
            <div key={review._id} className='border-b mt-4 pb-4'>
              <div className='flex justify-between items-center mb-2'>
                <div className='flex items-center'>
                  <span className='text-sm font-semibold mr-2'>{review.author.fullName}</span>
                  <span className='text-sm text-[#97999D]'>{moment(review.created_at).format('DD-MM-YYYY')}</span>
                </div>
              </div>
              <div className='flex items-start'>
                <div className='flex items-center w-1/6'>
                  {Array(review.rating)
                    .fill(0)
                    .map((_, index) => (
                      <StarIcon key={index} className='text-[#fdd835] w-[14px] h-[14px] mr-[1px]' />
                    ))}
                </div>
                <div className='flex-1 pl-4'>
                  {review.comment && review.comment.trim().length > 0 && (
                    <div className='text-sm mb-2'>{review.comment}</div>
                  )}
                  {/* Hỉnh ảnh */}
                  {review.images.length > 0 && (
                    <div className='mb-4 flex'>
                      {review.images.map((image) => (
                        <Image
                          key={image._id}
                          src={image.name}
                          onClick={() => handlePreviewImages(review.images.map((image) => image.name))}
                          className='w-20 h-20 object-cover mr-2 rounded cursor-pointer'
                        />
                      ))}
                    </div>
                  )}
                  {/* Danh sách trả lời */}
                  {review.replies.map((reply) => {
                    if (isEmpty(reply)) return null;
                    return (
                      <div key={reply._id} className='px-4 py-3 bg-[#ececec] rounded mb-4 last:mb-0'>
                        <div className='flex justify-between items-center'>
                          <div className='flex items-center'>
                            <span className='text-sm text-primary font-semibold mr-2'>{reply.author?.fullName}</span>
                            <span className='text-sm text-[#97999D]'>
                              {moment(reply.created_at).format('DD-MM-YYYY')}
                            </span>
                          </div>
                        </div>
                        <div className='text-sm mt-2'>{reply.comment}</div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
      {/* Loading */}
      {getReviewsQuery.isLoading && <Loading />}
    </Fragment>
  );
};

ProductReviewList.propTypes = {
  productId: PropTypes.string.isRequired
};

export default ProductReviewList;
