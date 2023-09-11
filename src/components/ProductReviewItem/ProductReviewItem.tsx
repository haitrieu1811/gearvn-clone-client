import moment from 'moment';
import PropTypes from 'prop-types';

import { ProductReview } from 'src/types/product.type';
import { getImageUrl } from 'src/utils/utils';
import { StarIcon } from '../Icons';

interface ProductReviewItemProps {
  review: ProductReview;
}

const ProductReviewItem = ({ review }: ProductReviewItemProps) => {
  return (
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
          {review.comment && review.comment.length > 0 && <div className='text-sm mb-2'>{review.comment}</div>}
          {/* Hỉnh ảnh */}
          {review.images.length > 0 && (
            <div className='mb-4 flex'>
              {review.images.map((image) => (
                <img key={image._id} src={getImageUrl(image.name)} className='w-16 h-16 object-cover mr-2 rounded' />
              ))}
            </div>
          )}
          {/* Danh sách trả lời */}
          {review.replies.map((reply) => (
            <div key={reply._id} className='px-4 py-3 bg-[#ececec] rounded mb-4 last:mb-0'>
              <div className='flex justify-between items-center'>
                <div className='flex items-center'>
                  <span className='text-sm text-primary font-semibold mr-2'>{reply.author?.fullName}</span>
                  <span className='text-sm text-[#97999D]'>{moment(reply.created_at).format('DD-MM-YYYY')}</span>
                </div>
              </div>
              <div className='text-sm mt-2'>{reply.comment}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

ProductReviewItem.propTypes = {
  review: PropTypes.object.isRequired
};

export default ProductReviewItem;
