import { useQuery } from '@tanstack/react-query';
import moment from 'moment';
import { useMemo } from 'react';

import productApi from 'src/apis/product.api';
import { ProductReview } from 'src/types/product.type';
import { StarIcon } from '../Icons';

interface ProductReviewProps {
  review: ProductReview;
}

const ProductReview = ({ review }: ProductReviewProps) => {
  // Lấy danh sách trả lời đánh giá
  const getRepliesQuery = useQuery({
    queryKey: ['reviewReplies', review._id],
    queryFn: () => productApi.getReviewReplies(review._id)
  });

  // Danh sách trả lời đánh giá
  const replies = useMemo(
    () => getRepliesQuery.data?.data.data.product_review_replies,
    [getRepliesQuery.data?.data.data.product_review_replies]
  );

  return (
    <div key={review._id} className='border-b mt-4'>
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
          {/* Trả lời */}
          {replies && replies.length > 0 && !getRepliesQuery.isLoading && (
            <div>
              {replies.map((reply) => (
                <div key={reply._id} className='px-4 py-3 bg-[#ececec] rounded mb-4'>
                  <div className='flex items-center'>
                    <span className='text-sm text-primary font-semibold mr-2'>{reply.author.fullName}</span>
                    <span className='text-sm text-[#97999D]'>{moment(reply.created_at).format('DD-MM-YYYY')}</span>
                  </div>
                  <div className='text-sm mt-2'>{reply.comment}</div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductReview;
