import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import { Fragment, memo, useContext, useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

import mediaApi from 'src/apis/media.api';
import productApi from 'src/apis/product.api';
import { NotificationType } from 'src/constants/enum';
import PATH from 'src/constants/path';
import { AppContext } from 'src/contexts/app.context';
import { Product } from 'src/types/product.type';
import { getImageUrl } from 'src/utils/utils';
import Button from '../Button';
import { CloseIcon, SendReviewIcon, StarIcon, UploadIcon } from '../Icons';
import InputFile from '../InputFile';
import Modal from '../Modal';
import { Notification } from 'src/types/notification.type';

interface SendReviewProps {
  product: Product;
}

const SendReview = ({ product }: SendReviewProps) => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { isAuthenticated, profile, socket } = useContext(AppContext);
  const [isVisible, setIsVisible] = useState<boolean>(false);
  const [comment, setComment] = useState<string>('');
  const [currentStar, setCurrentStar] = useState<number | null>(null);
  const [reaction, setReaction] = useState<string>('');
  const [selected, setSelected] = useState<boolean>(false);
  const [images, setImages] = useState<File[]>([]);

  // Query: Lấy chi tiết đánh giá
  const getReviewDetailQuery = useQuery({
    queryKey: ['review_detail', product._id],
    queryFn: () => productApi.getReviewDetail(product._id),
    enabled: isAuthenticated
  });

  // Thông tin chi tiết đánh giá
  const review = useMemo(
    () => getReviewDetailQuery.data?.data.data.review,
    [getReviewDetailQuery.data?.data.data.review]
  );

  // Danh sách hình ảnh đính kèm của đánh giá hiện tại (nếu có)
  const defaultImages = useMemo(() => review?.images || [], [review?.images]);

  // Điền dữ liệu vào form khi đã đánh giá
  useEffect(() => {
    if (review) {
      setComment(review.comment);
      setCurrentStar(review.rating);
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
    setCurrentStar(value);
  };

  // Rời chuột khỏi mức độ đánh giá
  const handleLeaveRating = () => {
    !selected && setCurrentStar(null);
  };

  // Thay đổi reaction
  useEffect(() => {
    switch (currentStar) {
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
  }, [currentStar]);

  // Thay đổi hình ảnh đính kèm
  const handleChangeImages = (files?: File[]) => {
    files && setImages((prevState) => [...prevState, ...files]);
  };

  // Xem trước hình ảnh đính kèm
  const reviewImages = useMemo(() => images.map((image) => URL.createObjectURL(image)), [images]);

  // Hủy hình ảnh đính kèm
  const cancelImage = (index: number) => {
    setImages((prevState) => prevState.filter((_, i) => i !== index));
  };

  // Upload hình ảnh đính kèm
  const uploadImageMutation = useMutation(mediaApi.uploadImage);

  // Mutation gửi đánh giá
  const addReviewMutation = useMutation({
    mutationFn: productApi.addReview,
    onSuccess: (data) => {
      closeModal();
      toast.success(data.data.message);
      setImages([]);
      setComment('');
      setCurrentStar(null);
      setSelected(false);
      queryClient.invalidateQueries(['reviews', product._id]);
      queryClient.invalidateQueries(['product', product._id]);
      queryClient.invalidateQueries(['review_detail', product._id]);
      // Gửi thông báo
      const new_notification: Notification = {
        _id: new Date().getTime().toString(),
        type: NotificationType.NewReview,
        title: 'Có đánh giá mới',
        content: `<strong>${profile?.fullname || ''}</strong> đã đánh giá sản phẩm <strong>${product.name_vi}</strong>`,
        path: PATH.DASHBOARD_REVIEW_LIST,
        is_read: false,
        sender: {
          _id: profile?._id || '',
          email: profile?.email || '',
          fullname: profile?.fullname || '',
          avatar: profile?.avatar || '',
          phone_number: profile?.phone_number || ''
        },
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };
      socket.emit('new_notification', {
        payload: {
          new_notification
        }
      });
    }
  });

  // Gửi đánh giá
  const handleSendReview = async () => {
    let imagesData: string[] | undefined = undefined;
    if (!currentStar || [...defaultImages, ...images].length > 5) return;
    if (defaultImages.length <= 4 && images.length > 0) {
      const formData = new FormData();
      images.forEach((image) => formData.append('image', image));
      const { data: mediasData } = await uploadImageMutation.mutateAsync(formData);
      imagesData = mediasData.data.medias.map((media) => media.name);
    }
    addReviewMutation.mutate({
      productId: product._id,
      body: {
        comment: comment || undefined,
        rating: currentStar,
        images: imagesData
      }
    });
  };

  // Mutation: Xóa hình ảnh đính kèm
  const deleteReviewImageMutation = useMutation({
    mutationFn: productApi.deleteReviewImage,
    onSuccess: () => {
      queryClient.invalidateQueries(['review_detail', product._id]);
      queryClient.invalidateQueries(['reviews', product._id]);
    }
  });

  // Xử lý xóa hình ảnh đính kèm
  const handleDeleteReviewImage = async (imageId: string) => {
    if (!review) return;
    deleteReviewImageMutation.mutate({ reviewId: review._id, imageId });
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
      {/* Modal */}
      <Modal
        isVisible={isVisible}
        icon={false}
        closeButton={false}
        cancelButton={false}
        okButton={false}
        paddingBody={false}
        onCancel={closeModal}
      >
        <div className='flex'>
          <div className='hidden md:block w-[340px] bg-primary p-4'>
            <img src={getImageUrl(product.thumbnail)} alt={product.name_vi} className='w-full' />
            <div className='mt-4 mb-[10px] text-sm text-white font-semibold text-center'>{product.name_vi}</div>
          </div>
          <div className='w-[800px]'>
            <div className='flex justify-between items-center p-4 border-b'>
              <h3 className='line-clamp-1 md:line-clamp-none'>
                Đánh giá của bạn về: <strong className='font-bold'>{product.name_vi}</strong>
              </h3>
              <button onClick={closeModal} className='ml-3'>
                <CloseIcon className='w-6 h-6' />
              </button>
            </div>
            <div className='relative p-4 flex justify-between items-center border-b'>
              <div className='flex-col md:flex-row flex items-center'>
                <div className='text-[13px] font-bold'>Mức độ đánh giá *</div>
                <div className='flex md:mx-4' onMouseLeave={handleLeaveRating}>
                  {Array(5)
                    .fill(0)
                    .map((_, index) => {
                      const value = index + 1;
                      const isActive = currentStar && value <= currentStar;
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
                <div className='hidden md:block text-xs'>{reaction || 'Click vào để review!'}</div>
              </div>
              <div
                className={classNames(
                  'absolute md:relative top-3 right-3 md:top-0 md:right-0 flex items-center border rounded-full px-2 py-1 bg-white',
                  {
                    'opacity-0': selected
                  }
                )}
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
                />
              </div>
            </div>
            <div className='p-4'>
              <div className='flex flex-wrap'>
                <InputFile multiple={true} onChange={handleChangeImages}>
                  <button className='flex justify-center items-center flex-col w-20 h-20 mr-2 mb-2 border border-dashed border-[#333333] rounded'>
                    <UploadIcon className='w-7 h-7 mb-[5px]' />
                    <span className='text-xs capitalize'>Gửi ảnh</span>
                  </button>
                </InputFile>
                {/* Danh sách hình ảnh */}
                <div className='flex flex-wrap w-full md:w-auto lg:mt-0'>
                  {[...defaultImages, ...reviewImages].map((image, index) => {
                    const isDefault = typeof image !== 'string';
                    return (
                      <div
                        key={index}
                        className='relative w-20 h-20 flex justify-center items-center px-[6px] py-2 lg:py-5 bg-[#00000033] mr-2 mt-2 md:mt-0 rounded'
                      >
                        <img
                          src={isDefault ? getImageUrl(image.name) : image}
                          alt={product.name_vi}
                          className='w-[85%] object-contain'
                        />
                        <button
                          onClick={() =>
                            isDefault ? handleDeleteReviewImage(image._id) : cancelImage(index - defaultImages.length)
                          }
                          className='absolute top-1 right-1 w-4 h-4 border border-white rounded-full flex justify-center items-center z-10'
                        >
                          <CloseIcon className='w-3 h-3 stroke-white' />
                        </button>
                      </div>
                    );
                  })}
                </div>
              </div>
              <div
                className={classNames('text-[#dc3545] mt-[10px] text-sm pointer-events-none', {
                  'opacity-0': [...defaultImages, ...images].length <= 5
                })}
              >
                Chỉ được gửi tối đa 5 hình ảnh
              </div>
            </div>
            <div className='p-4 flex justify-end'>
              <Button
                onClick={handleSendReview}
                isLoading={addReviewMutation.isLoading || uploadImageMutation.isLoading}
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

export default memo(SendReview);
