import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import classNames from 'classnames';
import { Fragment, useContext, useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import PropTypes from 'prop-types';

import productApi from 'src/apis/product.api';
import PATH from 'src/constants/path';
import { AppContext } from 'src/contexts/app.context';
import { Product } from 'src/types/product.type';
import { getImageUrl } from 'src/utils/utils';
import Button from '../Button';
import { CloseIcon, SendReviewIcon, StarIcon, UploadIcon } from '../Icons';
import Modal from '../Modal';

interface SendReviewProps {
  product: Product;
}

const SendReview = ({ product }: SendReviewProps) => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const [isVisible, setIsVisible] = useState<boolean>(false);
  const [comment, setComment] = useState<string>('');
  const [currentStart, setCurrentStart] = useState<number | null>(null);
  const [reaction, setReaction] = useState<string>('');
  const [selected, setSelected] = useState<boolean>(false);
  const { isAuthenticated } = useContext(AppContext);

  // Lấy chi tiết đánh giá
  const getReviewDetailQuery = useQuery({
    queryKey: ['getReviewDetail', product._id],
    queryFn: () => productApi.getReviewDetail(product._id)
  });

  // Chi tiết đánh giá
  const review = useMemo(
    () => getReviewDetailQuery.data?.data.data.review,
    [getReviewDetailQuery.data?.data.data.review]
  );

  // Điền dữ liệu vào form khi đã đánh giá
  useEffect(() => {
    if (review) {
      setComment(review.comment);
      setCurrentStart(review.rating);
      setSelected(true);
    }
  }, [review]);

  // Mở modal
  const openModal = () => {
    if (!isAuthenticated) return navigate(PATH.LOGIN);
    setIsVisible(true);
  };

  // Đóng modal
  const closeModal = () => {
    setIsVisible(false);
  };

  // Chọn mức độ đánh giá
  const handleSelectStart = (value: number) => {
    setCurrentStart(value);
  };

  // Rời chuột khỏi mức độ đánh giá
  const handleLeaveRating = () => {
    !selected && setCurrentStart(null);
  };

  // Thay đổi reaction
  useEffect(() => {
    switch (currentStart) {
      case 1:
        setReaction('Rất không hài lòng');
        break;
      case 2:
        setReaction('Không hài lòng');
        break;
      case 3:
        setReaction('Bình thường');
        break;
      case 4:
        setReaction('Tốt');
        break;
      case 5:
        setReaction('Xuất sắc');
        break;
      default:
        setReaction('');
        break;
    }
  }, [currentStart]);

  // Gửi đánh giá
  const addReviewMutation = useMutation({
    mutationFn: productApi.addReview,
    onSuccess: (data) => {
      closeModal();
      toast.success(data.data.message);

      queryClient.invalidateQueries(['getReviews', product._id]);
      queryClient.invalidateQueries(['product', product._id]);
    }
  });

  // Gửi đánh giá
  const handleSendReview = () => {
    if (!currentStart) return;
    addReviewMutation.mutate({
      productId: product._id,
      body: {
        comment: comment || undefined,
        rating: currentStart
      }
    });
  };

  return (
    <Fragment>
      <button
        onClick={openModal}
        className='bg-[#1982F9] rounded flex items-center justify-center w-[400px] max-w-full h-10'
      >
        <SendReviewIcon className='w-[18px] h-[18px] mr-3' />
        <span className='text-sm text-white font-medium'>Gửi đánh giá của bạn</span>
      </button>

      <Modal isVisible={isVisible} modalHeader={false} cancelButton={false} okButton={false} onCancel={closeModal}>
        <div className='flex'>
          <div className='w-[340px] bg-primary p-4'>
            <img src={getImageUrl(product.thumbnail)} alt={product.name_vi} className='w-full' />
            <div className='mt-4 mb-[10px] text-sm text-white font-semibold text-center'>{product.name_vi}</div>
          </div>
          <div className='w-[800px]'>
            <div className='flex justify-between items-center p-4 border-b'>
              <h3>
                Đánh giá của bạn về: <strong className='font-bold'>{product.name_vi}</strong>
              </h3>
              <button onClick={closeModal}>
                <CloseIcon className='w-6 h-6' />
              </button>
            </div>
            <div className='p-4 flex justify-between items-center border-b'>
              <div className='flex items-center'>
                <div className='text-[13px] font-bold'>Mức độ đánh giá *</div>
                <div className='flex mx-4' onMouseLeave={handleLeaveRating}>
                  {Array(5)
                    .fill(0)
                    .map((_, index) => {
                      const value = index + 1;
                      const isActive = currentStart && value <= currentStart;
                      return (
                        <div
                          key={index}
                          onMouseEnter={() => handleSelectStart(value)}
                          onClick={() => setSelected(true)}
                          className={classNames(
                            'py-[1px] px-[2px] border-r border-white cursor-pointer first:rounded-tl first:rounded-bl last:rounded-tr last:rounded-br ',
                            {
                              'bg-[#cfcfcf] hover:bg-primary': !isActive,
                              'bg-primary': isActive
                            }
                          )}
                        >
                          <StarIcon className='w-[18px] h-[18px] text-white' />
                        </div>
                      );
                    })}
                </div>
                <div className='text-xs'>{reaction || 'Click vào để review!'}</div>
              </div>
              <div
                className={classNames('flex items-center border rounded-full px-2 py-1', {
                  'opacity-0': selected
                })}
              >
                <span className='text-xs text-primary'>Vui lòng chọn mức độ đánh giá</span>
                <span className='w-5 h-5 bg-primary rounded-full inline-flex justify-center items-center ml-[5px]'>
                  <CloseIcon className='w-[14px] h-[14px] stroke-white' />
                </span>
              </div>
            </div>
            <div className='p-4 border-b'>
              <strong className='font-bold text-[13px]'>Đánh giá</strong>
              <div className='mt-3'>
                <textarea
                  className='w-full resize-none border rounded outline-none p-[10px] text-xs'
                  placeholder='Ví dụ: Tôi đã mua sản phẩm cách đây 1 tháng và rất hài lòng về nó ...'
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                ></textarea>
              </div>
            </div>
            <div className='p-4'>
              <button className='flex justify-center items-center flex-col w-20 h-20 border border-dashed border-[#333333] rounded'>
                <UploadIcon className='w-7 h-7 mb-[5px]' />
                <span className='text-xs capitalize'>Gửi ảnh</span>
              </button>
            </div>
            <div className='p-4 flex justify-end'>
              <Button
                onClick={handleSendReview}
                isLoading={addReviewMutation.isLoading}
                className='px-7 py-[10px] flex items-center justify-center rounded bg-primary text-white font-medium text-sm hover:bg-primary/90'
              >
                Gửi đánh giá
              </Button>
            </div>
          </div>
        </div>
      </Modal>
    </Fragment>
  );
};

SendReview.propTypes = {
  product: PropTypes.object.isRequired
};

export default SendReview;
