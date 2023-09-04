import moment from 'moment';
import { ChangeEvent, FormEvent, useContext, useEffect, useState } from 'react';
import PropTypes from 'prop-types';

import { ProductReview, ProductReviewReply } from 'src/types/product.type';
import { StarIcon } from '../Icons';
import { getImageUrl } from 'src/utils/utils';
import { AppContext } from 'src/contexts/app.context';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import productApi from 'src/apis/product.api';
import { toast } from 'react-toastify';

interface ProductReviewItemProps {
  review: ProductReview;
  currentReview: string | null;
  startReply: (reviewId: string) => void;
  stopReply: () => void;
  handleReply: (e: FormEvent<HTMLFormElement>) => void;
  changeCommentReply: (e: ChangeEvent<HTMLInputElement>) => void;
}

const REPLIES_LIMIT = 3;

const ProductReviewItem = ({
  review,
  currentReview,
  startReply,
  stopReply,
  handleReply,
  changeCommentReply
}: ProductReviewItemProps) => {
  const queryClient = useQueryClient();
  const [repliesIndex, setRepliesIndex] = useState<number[]>([0, REPLIES_LIMIT]);
  const [displayedReplies, setDisplayedReplies] = useState<ProductReviewReply[]>([]);
  const { profile } = useContext(AppContext);

  // Đặt lại danh sách phản hồi
  useEffect(() => {
    const newReplies = review.replies.slice(...repliesIndex);
    setDisplayedReplies(newReplies);
  }, [review.replies, repliesIndex]);

  // Xem thêm phản hồi
  const handleSeeMoreReplies = () => {
    setRepliesIndex([0, repliesIndex[1] + REPLIES_LIMIT]);
  };

  // Ẩn bớt phản hồi
  const handleSeeLessReplies = () => {
    setRepliesIndex([0, REPLIES_LIMIT]);
  };

  // Mutation xóa đánh giá
  const deleteMutation = useMutation({
    mutationFn: productApi.deleteReview,
    onSuccess: (data) => {
      toast.success(data.data.message);
      queryClient.invalidateQueries(['getReviews']);
      queryClient.invalidateQueries(['product']);
      queryClient.invalidateQueries(['getReviewDetail']);
    }
  });

  // Xóa đánh giá
  const handleDelete = () => {
    if (profile?._id !== review.author._id) return;
    deleteMutation.mutate(review._id);
  };

  return (
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
          {review.comment.length > 0 && <div className='text-sm mb-2'>{review.comment}</div>}
          {/* Hỉnh ảnh */}
          {review.images.length > 0 && (
            <div className='mb-2 flex'>
              {review.images.map((image) => (
                <img key={image._id} src={getImageUrl(image.name)} className='w-14 h-14 object-cover mr-1 rounded-sm' />
              ))}
            </div>
          )}
          <form onSubmit={handleReply}>
            <div className='flex items-center'>
              {review.comment.length > 0 && (
                <button onClick={() => startReply(review._id)} className='text-xs text-slate-500 hover:underline'>
                  Phản hồi
                </button>
              )}
              {profile?._id === review.author._id && (
                <button onClick={handleDelete} className='text-xs text-slate-500 hover:underline ml-3'>
                  Xóa
                </button>
              )}
            </div>
            {review._id === currentReview && (
              <div className='my-2'>
                <input
                  type='text'
                  placeholder='Nhập phản hồi của bạn vào đây'
                  className='border border-[#cfcfcf] bg-[#f8f8f8] outline-none text-sm w-full py-2 px-3 rounded'
                  onBlur={stopReply}
                  onChange={changeCommentReply}
                />
              </div>
            )}
          </form>
          {/* Trả lời */}
          <div className='mt-6'>
            {displayedReplies.slice(...repliesIndex).map((reply) => (
              <div key={reply._id} className='px-4 py-3 bg-[#ececec] rounded mb-4 last:mb-0'>
                <div className='flex items-center'>
                  <span className='text-sm text-primary font-semibold mr-2'>Admin</span>
                  <span className='text-sm text-[#97999D]'>{moment(reply.created_at).format('DD-MM-YYYY')}</span>
                </div>
                <div className='text-sm mt-2'>{reply.comment}</div>
              </div>
            ))}
            {/* Xem thêm phản hồi */}
            {review.replies.length > displayedReplies.length && (
              <div className='flex justify-center'>
                <button className='text-sm text-blue-600' onClick={handleSeeMoreReplies}>
                  Xem thêm {review.replies.length - displayedReplies.length} phản hồi
                </button>
              </div>
            )}
            {/* Ẩn bớt phản hồi */}
            {review.replies.length === displayedReplies.length && review.replies.length > REPLIES_LIMIT && (
              <div className='flex justify-center'>
                <button className='text-sm text-blue-600' onClick={handleSeeLessReplies}>
                  Ẩn bớt phản hồi
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

ProductReviewItem.propTypes = {
  review: PropTypes.object.isRequired,
  currentReview: PropTypes.string,
  startReply: PropTypes.func.isRequired,
  stopReply: PropTypes.func.isRequired,
  handleReply: PropTypes.func.isRequired,
  changeCommentReply: PropTypes.func.isRequired
};

export default ProductReviewItem;
