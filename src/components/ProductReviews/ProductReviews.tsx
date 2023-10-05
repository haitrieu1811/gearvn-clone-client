import { useQuery } from '@tanstack/react-query';
import PropTypes from 'prop-types';
import { Fragment, useMemo } from 'react';

import productApi from 'src/apis/product.api';
import Loading from '../Loading';
import ReviewItem from '../ReviewItem';

interface ProductReviewListProps {
  productId: string;
}

const ProductReviewList = ({ productId }: ProductReviewListProps) => {
  // Query: Lấy danh sách đánh giá sản phẩm
  const getReviewsQuery = useQuery({
    queryKey: ['reviews', productId],
    queryFn: () => productApi.getReviewsByProductId(productId)
  });

  // Danh sách đánh giá sản phẩm
  const reviews = useMemo(
    () => getReviewsQuery.data?.data.data.reviews || [],
    [getReviewsQuery.data?.data.data.reviews]
  );

  return (
    <Fragment>
      {/* Danh sách đánh giá */}
      {reviews.length > 0 && !getReviewsQuery.isLoading && (
        <Fragment>
          {reviews.map((review) => (
            <ReviewItem key={review._id} review={review} />
          ))}
        </Fragment>
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
