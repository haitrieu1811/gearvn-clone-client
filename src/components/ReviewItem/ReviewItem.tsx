import { useMutation, useQueryClient } from '@tanstack/react-query';
import classNames from 'classnames';
import moment from 'moment';
import PropTypes from 'prop-types';
import { FormEvent, useContext, useState } from 'react';
import { toast } from 'react-toastify';

import { Link } from 'react-router-dom';
import productApi from 'src/apis/product.api';
import PATH from 'src/constants/path';
import { ProductReview } from 'src/types/product.type';
import { generateNameId, getImageUrl } from 'src/utils/utils';
import Button from '../Button';
import ContextMenu from '../ContextMenu';
import { StarIcon, TrashIcon } from '../Icons';
import Image from '../Image';
import Input from '../Input';
import { AppContext } from 'src/contexts/app.context';

interface ReviewItemProps {
  review: ProductReview;
  isAdminView?: boolean;
}

const ReviewItem = ({ review, isAdminView }: ReviewItemProps) => {
  const queryClient = useQueryClient();
  const [replies, setReplies] = useState<string | null>(null);
  const { profile } = useContext(AppContext);

  // Mutation: Phản hồi đánh giá
  const replyReviewMutation = useMutation({
    mutationFn: productApi.addReview,
    onSuccess: () => {
      setReplies(null);
      queryClient.invalidateQueries(['reviews']);
    }
  });

  // Mutation: Xóa đánh giá
  const deleteReplyMutation = useMutation({
    mutationFn: productApi.deleteReview,
    onSuccess: (data) => {
      toast.success(data.data.message);
      queryClient.invalidateQueries(['reviews']);
    }
  });

  // Bắt đầu phản hồi
  const startReply = () => {
    if (replies === null) setReplies('');
    else setReplies(null);
  };

  // Gửi phản hồi
  const handleReply = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (replies === null || !replies.trim()) return;
    replyReviewMutation.mutate({
      productId: review.product._id,
      body: {
        comment: replies,
        parent_id: review._id
      }
    });
  };

  // Xóa phản hồi
  const handleDeleteReply = (replyId: string) => {
    deleteReplyMutation.mutate(replyId);
  };

  return (
    <div
      className={classNames('border-b py-4 flex items-center', {
        'px-4': isAdminView
      })}
    >
      <div className='flex-1'>
        <div className='flex justify-between items-center mb-2'>
          <div className='flex items-center'>
            <span className='text-sm font-semibold mr-2'>{review.author.fullname}</span>
            <span className='text-sm text-[#97999D]'>{moment(review.created_at).format('DD-MM-YYYY')}</span>
          </div>
        </div>
        <div className='flex items-start'>
          <div className='w-1/6'>
            <div className='flex items-center'>
              {Array(review.rating)
                .fill(0)
                .map((_, index) => (
                  <StarIcon key={index} className='text-[#fdd835] w-[14px] h-[14px] mr-[1px]' />
                ))}
            </div>
            {isAdminView && (
              <button
                onClick={startReply}
                className='text-sm bg-slate-100 p-1 uppercase border font-semibold rounded mt-3'
              >
                {replies === null ? 'Phản hồi' : 'Hủy bỏ'}
              </button>
            )}
          </div>
          <div className='flex-1 pl-4'>
            {review.comment && review.comment.trim().length > 0 && <div className='text-sm mb-2'>{review.comment}</div>}
            {/* Hỉnh ảnh */}
            {review.images.length > 0 && (
              <div className='mb-4 flex'>
                {review.images.map((image) => (
                  <Link key={image._id} to={getImageUrl(image.name)} target='_blank'>
                    <Image
                      key={image._id}
                      src={image.name}
                      className='w-16 h-16 rounded-sm object-cover mr-2 cursor-pointer'
                    />
                  </Link>
                ))}
              </div>
            )}
            {/* Danh sách trả lời */}
            {review.replies.map((reply) => (
              <div key={reply._id} className='px-4 py-3 bg-[#ececec] rounded mb-4 last:mb-0'>
                <div className='flex justify-between items-center'>
                  <div className='flex items-center'>
                    <span className='text-sm text-primary font-semibold mr-2'>{reply.author?.fullname}</span>
                    <span className='text-sm text-[#97999D]'>{moment(reply.created_at).format('DD-MM-YYYY')}</span>
                  </div>
                  {profile?._id === reply.author._id && (
                    <div>
                      <ContextMenu
                        items={[
                          {
                            icon: <TrashIcon />,
                            label: 'Xóa phản hồi',
                            onClick: () => handleDeleteReply(reply._id)
                          }
                        ]}
                      />
                    </div>
                  )}
                </div>
                <div className='text-sm mt-2'>{reply.comment}</div>
              </div>
            ))}
          </div>
        </div>
        {/* Phản hồi */}
        {isAdminView && replies !== null && (
          <form onSubmit={handleReply} className='flex mt-6'>
            <Input
              type='text'
              value={replies}
              placeholder='Nhập phản hồi'
              classNameWrapper='flex-1'
              onChange={(e) => setReplies(e.target.value)}
            />
            <Button className='bg-blue-500 text-white h-full px-4 ml-3 rounded hover:bg-blue-600'>Gửi phản hồi</Button>
          </form>
        )}
      </div>
      {isAdminView && (
        <div className='basis-1/4 flex ml-10'>
          <Image src={review.product.thumbnail} className='w-14 h-14 object-cover' />
          <Link
            target='_blank'
            to={`${PATH.PRODUCT_DETAIL_WITHOUT_ID}/${generateNameId({
              name: review.product.name_vi,
              id: review.product._id
            })}`}
          >
            <span className='line-clamp-2 text-sm ml-5'>{review.product.name_vi}</span>
          </Link>
        </div>
      )}
    </div>
  );
};

ReviewItem.propTypes = {
  review: PropTypes.object.isRequired,
  isAdminView: PropTypes.bool
};

export default ReviewItem;
