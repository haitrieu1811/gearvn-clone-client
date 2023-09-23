import { useMutation, useQuery } from '@tanstack/react-query';
import { useMemo } from 'react';
import isUndefined from 'lodash/isUndefined';
import omitBy from 'lodash/omitBy';

import categoryApi from 'src/apis/category.api';
import { PaginationRequestParams } from 'src/types/utils.type';

type QueryConfig = {
  [key in keyof PaginationRequestParams]: string;
};

const useCategory = (queryConfig?: QueryConfig) => {
  const _queryConfig: QueryConfig = omitBy(queryConfig, isUndefined);

  // Query: Lấy danh sách danh mục
  const getCategoriesQuery = useQuery({
    queryKey: ['categories', _queryConfig],
    queryFn: () => categoryApi.getList(_queryConfig)
  });

  // Mutation: Xóa danh mục
  const deleteCategoryMutation = useMutation(categoryApi.delete);

  // Danh sách danh mục
  const categories = useMemo(
    () => getCategoriesQuery.data?.data.data.categories || [],
    [getCategoriesQuery.data?.data.data.categories]
  );

  // Tổng số trang
  const categoriesPageSize = getCategoriesQuery.data?.data.data.pagination.page_size || 0;

  return {
    categories,
    categoriesPageSize,
    getCategoriesQuery,
    deleteCategoryMutation
  };
};

export default useCategory;
