import { useQuery } from '@tanstack/react-query';
import moment from 'moment';
import { Fragment, useMemo } from 'react';

import productApi from 'src/apis/product.api';
import { getImageUrl } from 'src/utils/utils';
import { StarIcon } from '../Icons';
import Loading from '../Loading';

interface ProductReviewsProps {
  productId: string;
}

const ProductReviews = ({ productId }: ProductReviewsProps) => {
  // Lấy danh sách đánh giá sản phẩm
  const getReviewsQuery = useQuery({
    queryKey: ['getReviews', productId],
    queryFn: () => productApi.getReviews(productId)
  });

  // Danh sách đánh giá sản phẩm
  const reviews = useMemo(() => getReviewsQuery.data?.data.data.reviews, [getReviewsQuery.data?.data.data.reviews]);

  return (
    <Fragment>
      {reviews &&
        reviews.length > 0 &&
        !getReviewsQuery.isLoading &&
        reviews.map((review) => (
          <div key={review._id} className='border-b mt-4 pb-4'>
            <div className='flex items-center mb-2'>
              <span className='text-sm font-semibold mr-2'>{review.author.fullName}</span>
              <span className='text-sm text-[#97999D]'>{moment(review.created_at).format('DD-MM-YYYY')}</span>
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
                <div className='text-sm mb-4'>{review.comment}</div>
                {/* Hỉnh ảnh */}
                <div className='mb-4 flex'>
                  {review.images.map((image) => (
                    <img
                      key={image._id}
                      src={getImageUrl(image.name)}
                      className='w-14 h-14 object-cover mr-1 rounded'
                    />
                  ))}
                </div>
                {/* Trả lời */}
                {review.replies.map((reply) => (
                  <div key={reply._id} className='px-4 py-3 bg-[#ececec] rounded mb-4 last:mb-0'>
                    <div className='flex items-center'>
                      <span className='text-sm text-primary font-semibold mr-2'>Admin</span>
                      <span className='text-sm text-[#97999D]'>{moment(reply.created_at).format('DD-MM-YYYY')}</span>
                    </div>
                    <div className='text-sm mt-2'>{reply.comment}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}

      {getReviewsQuery.isLoading && <Loading />}
    </Fragment>
  );
};

export default ProductReviews;
