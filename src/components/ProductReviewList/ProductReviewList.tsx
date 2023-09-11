import { useQuery } from '@tanstack/react-query';
import PropTypes from 'prop-types';
import { Fragment, useEffect, useMemo } from 'react';

import productApi from 'src/apis/product.api';
import socket from 'src/utils/socket';
import Loading from '../Loading';
import ProductReviewItem from '../ProductReviewItem';

interface ProductReviewListProps {
  productId: string;
}

const ProductReviewList = ({ productId }: ProductReviewListProps) => {
  // Kết nối socket
  useEffect(() => {
    socket.on('receive_product_review', () => {
      getReviewsQuery.refetch();
    });
  }, []);

  // Lấy danh sách đánh giá sản phẩm
  const getReviewsQuery = useQuery({
    queryKey: ['reviews', productId],
    queryFn: () => productApi.getReviews(productId)
  });

  // Danh sách đánh giá sản phẩm
  const reviews = useMemo(() => getReviewsQuery.data?.data.data.reviews, [getReviewsQuery.data?.data.data.reviews]);

  return (
    <Fragment>
      {reviews &&
        reviews.length > 0 &&
        !getReviewsQuery.isLoading &&
        reviews.map((review) => <ProductReviewItem key={review._id} review={review} />)}
      {/* Loading */}
      {getReviewsQuery.isLoading && <Loading />}
    </Fragment>
  );
};

ProductReviewList.propTypes = {
  productId: PropTypes.string.isRequired
};

export default ProductReviewList;
