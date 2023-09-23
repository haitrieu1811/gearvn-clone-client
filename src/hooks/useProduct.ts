import { useMutation, useQuery } from '@tanstack/react-query';
import isUndefined from 'lodash/isUndefined';
import omitBy from 'lodash/omitBy';
import { useMemo } from 'react';

import productApi from 'src/apis/product.api';
import { GetProductsRequestParams } from 'src/types/product.type';

type QueryConfig = {
  [key in keyof GetProductsRequestParams]: string;
};

const useProduct = (queryConfig: QueryConfig) => {
  // Bỏ đi những tham số undefined
  const _queryConfig: QueryConfig = omitBy(queryConfig, isUndefined);

  // Query: Lấy danh sách sản phẩm
  const getProductsQuery = useQuery({
    queryKey: ['products', _queryConfig],
    queryFn: () => productApi.getList(_queryConfig),
    keepPreviousData: true
  });

  // Mutation: Xóa sản phẩm
  const deleteProductMutation = useMutation(productApi.delete);

  // Danh sách sản phẩm
  const products = useMemo(
    () => getProductsQuery.data?.data.data.products || [],
    [getProductsQuery.data?.data.data.products]
  );

  // Số lượng trang của danh sách sản phẩm
  const productsPageSize = useMemo(
    () => getProductsQuery.data?.data.data.pagination.page_size || 0,
    [getProductsQuery.data?.data.data.pagination.page_size]
  );

  // Lấy tổng số sản phẩm
  const productsTotal = useMemo(
    () => getProductsQuery.data?.data.data.pagination.total || 0,
    [getProductsQuery.data?.data.data.pagination.total]
  );

  return {
    getProductsQuery,
    deleteProductMutation,
    products,
    productsPageSize,
    productsTotal
  };
};

export default useProduct;
