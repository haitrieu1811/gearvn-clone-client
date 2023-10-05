import { useQuery } from '@tanstack/react-query';
import isUndefined from 'lodash/isUndefined';
import omitBy from 'lodash/omitBy';
import { useMemo } from 'react';

import productApi from 'src/apis/product.api';
import Loading from 'src/components/Loading';
import Pagination from 'src/components/Pagination';
import ReviewItem from 'src/components/ReviewItem';
import useQueryParams from 'src/hooks/useQueryParams';
import { PaginationRequestParams } from 'src/types/utils.type';

type QueryConfig = {
  [key in keyof PaginationRequestParams]: string;
};

const ReviewList = () => {
  const queryParams: QueryConfig = useQueryParams();
  const queryConfig: QueryConfig = omitBy(
    {
      page: queryParams.page || 1,
      limit: queryParams.limit || 20
    },
    isUndefined
  );

  // Query: Lấy danh sách reviews
  const getReviewsQuery = useQuery({
    queryKey: ['reviews', queryConfig],
    queryFn: () => productApi.getReviews(queryConfig),
    keepPreviousData: true
  });

  // Danh sách reviews
  const reviews = useMemo(
    () => getReviewsQuery.data?.data.data.reviews || [],
    [getReviewsQuery.data?.data.data.reviews]
  );

  // Tổng số trang
  const pageSize = useMemo(
    () => getReviewsQuery.data?.data.data.pagination.page_size || 0,
    [getReviewsQuery.data?.data.data.pagination.page_size]
  );

  return (
    <div className='bg-white px-4 pb-10 pt-5'>
      <h1 className='text-2xl font-semibold mb-10'>Đánh giá sản phẩm</h1>
      {/* Danh sách review */}
      {reviews.length > 0 &&
        !getReviewsQuery.isLoading &&
        reviews.map((review) => <ReviewItem key={review._id} review={review} isAdminView={true} />)}
      <Pagination pageSize={pageSize} classNameWrapper='mt-10' />

      {/* Loading */}
      {getReviewsQuery.isLoading && (
        <div className='mt-10 flex justify-center items-center min-h-[400px]'>
          <Loading />
        </div>
      )}
    </div>
  );
};

export default ReviewList;
