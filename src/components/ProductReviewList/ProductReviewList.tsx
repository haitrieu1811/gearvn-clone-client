import { useMutation, useQuery } from '@tanstack/react-query';
import PropTypes from 'prop-types';
import { ChangeEvent, FormEvent, Fragment, useMemo, useState } from 'react';

import productApi from 'src/apis/product.api';
import Loading from '../Loading';
import ProductReviewItem from '../ProductReviewItem';

interface ProductReviewListProps {
  productId: string;
}

const ProductReviewList = ({ productId }: ProductReviewListProps) => {
  const [currentReview, setCurrentReview] = useState<string | null>(null);
  const [commentReply, setCommentReply] = useState<string>('');

  // Lấy danh sách đánh giá sản phẩm
  const getReviewsQuery = useQuery({
    queryKey: ['getReviews', productId],
    queryFn: () => productApi.getReviews(productId)
  });

  // Danh sách đánh giá sản phẩm
  const reviews = useMemo(() => getReviewsQuery.data?.data.data.reviews, [getReviewsQuery.data?.data.data.reviews]);

  // Mutation phản hồi đánh giá
  const replyReviewMutation = useMutation({
    mutationFn: productApi.addReview,
    onSuccess: () => {
      getReviewsQuery.refetch();
      stopReply();
    }
  });

  // Bắt đầu phản hồi đánh giá
  const startReply = (reviewId: string) => {
    setCurrentReview(reviewId);
  };

  // Dừng phản hồi đánh giá
  const stopReply = () => {
    setCurrentReview(null);
    setCommentReply('');
  };

  // Thay đổi bình luận phản hồi
  const changeCommentReply = (e: ChangeEvent<HTMLInputElement>) => {
    setCommentReply(e.target.value);
  };

  // Xử lý phản hồi đánh giá
  const handleReply = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!currentReview || commentReply.trim().length <= 0) return;
    replyReviewMutation.mutate({
      productId,
      body: {
        parent_id: currentReview,
        comment: commentReply
      }
    });
  };

  return (
    <Fragment>
      {reviews &&
        reviews.length > 0 &&
        !getReviewsQuery.isLoading &&
        reviews.map((review) => (
          <ProductReviewItem
            review={review}
            currentReview={currentReview}
            startReply={startReply}
            stopReply={stopReply}
            changeCommentReply={changeCommentReply}
            handleReply={handleReply}
          />
        ))}
      {/* Loading */}
      {getReviewsQuery.isLoading && <Loading />}
    </Fragment>
  );
};

ProductReviewList.propTypes = {
  productId: PropTypes.string.isRequired
};

export default ProductReviewList;
