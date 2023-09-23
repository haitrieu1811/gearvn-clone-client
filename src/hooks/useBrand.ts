import { useMutation, useQuery } from '@tanstack/react-query';
import { useMemo } from 'react';
import isUndefined from 'lodash/isUndefined';
import omitBy from 'lodash/omitBy';

import brandApi from 'src/apis/brand.api';
import { PaginationRequestParams } from 'src/types/utils.type';

type QueryConfig = {
  [key in keyof PaginationRequestParams]: string;
};

const useBrand = (queryConfig: QueryConfig) => {
  const _queryConfig: QueryConfig = omitBy(queryConfig, isUndefined);

  // Query: Lấy danh sách nhãn hiệu
  const getBrandsQuery = useQuery({
    queryKey: ['brands', _queryConfig],
    queryFn: () => brandApi.getList(_queryConfig),
    keepPreviousData: true
  });

  // Xóa nhãn hiệu
  const deleteBrandMutation = useMutation(brandApi.delete);

  // Danh sách nhãn hiệu
  const brands = useMemo(() => getBrandsQuery.data?.data.data.brands || [], [getBrandsQuery.data?.data.data.brands]);

  // Tổng số nhãn hiệu
  const brandsPageSize = useMemo(
    () => getBrandsQuery.data?.data.data.pagination.page_size || 0,
    [getBrandsQuery.data?.data.data.pagination.page_size]
  );

  return {
    brands,
    brandsPageSize,
    getBrandsQuery,
    deleteBrandMutation
  };
};

export default useBrand;
