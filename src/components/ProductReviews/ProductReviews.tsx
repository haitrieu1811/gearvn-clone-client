import { useQuery } from '@tanstack/react-query';
import { Fragment, useMemo } from 'react';

import productApi from 'src/apis/product.api';
import ProductReview from '../ProductReview';

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
      {reviews && reviews.length > 0 && !getReviewsQuery.isLoading && (
        <div>
          {reviews.map((review) => (
            <ProductReview key={review._id} review={review} />
          ))}
        </div>
      )}
    </Fragment>
  );
};

export default ProductReviews;
