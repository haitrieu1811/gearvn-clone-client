import isUndefined from 'lodash/isUndefined';
import keyBy from 'lodash/keyBy';
import omitBy from 'lodash/omitBy';
import moment from 'moment';
import { useContext, useEffect, useMemo, useState } from 'react';

import { useQuery } from '@tanstack/react-query';
import productApi from 'src/apis/product.api';
import Table from 'src/components/Table';
import PATH from 'src/constants/path';
import { ExtendedContext } from 'src/contexts/extended.context';
import useDebounce from 'src/hooks/useDebounce';
import useQueryParams from 'src/hooks/useQueryParams';
import { GetProductsRequestParams } from 'src/types/product.type';
import { convertMomentFromNowToVietnamese, formatCurrency } from 'src/utils/utils';

type QueryConfig = {
  [key in keyof GetProductsRequestParams]: string;
};

const ProductList = () => {
  const { extendedProducts, setExtendedProducts } = useContext(ExtendedContext);
  const [keywordSearch, setKeywordSearch] = useState<string>('');
  const keywordSearchDebounce = useDebounce(keywordSearch, 1000);
  const queryParams: QueryConfig = useQueryParams();
  const queryConfig: QueryConfig = omitBy(
    {
      page: queryParams.page || '1',
      limit: queryParams.limit || '20',
      category: queryParams.category,
      brand: queryParams.brand,
      name: keywordSearchDebounce,
      orderBy: queryParams.orderBy,
      sortBy: queryParams.sortBy
    },
    isUndefined
  );

  // Query: Lấy danh sách sản phẩm
  const getProductsQuery = useQuery({
    queryKey: ['products', queryConfig],
    queryFn: () => productApi.getList(queryConfig),
    keepPreviousData: true,
    staleTime: Infinity
  });

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

  // Cập nhật extendedProducts khi có thay đổi từ products
  useEffect(() => {
    if (!products) return;
    setExtendedProducts((prevState) => {
      const extendedProductsObj = keyBy(prevState, '_id');
      return products.map((product) => ({
        ...product,
        checked: !!extendedProductsObj[product._id]?.checked
      }));
    });
  }, [products]);

  // Các cột của bảng
  const columns = useMemo(
    () => [
      {
        field: 'productName',
        headerName: 'Tên sản phẩm',
        width: 30
      },
      {
        field: 'price',
        headerName: 'Giá gốc',
        width: 10
      },
      {
        field: 'priceAfterDiscount',
        headerName: 'Giảm còn',
        width: 10
      },
      {
        field: 'category',
        headerName: 'Danh mục',
        width: 10
      },
      {
        field: 'brand',
        headerName: 'Nhãn hiệu',
        width: 10
      },
      {
        field: 'createdAt',
        headerName: 'Tạo lúc',
        width: 10
      },
      {
        field: 'updatedAt',
        headerName: 'Cập nhật',
        width: 10
      }
    ],
    []
  );

  // Dữ liệu của bảng
  const dataSource = useMemo(() => {
    return extendedProducts.map((product) => ({
      _id: product._id,
      checked: product.checked,
      productName: product.name_vi,
      price: formatCurrency(product.price),
      priceAfterDiscount: formatCurrency(product.price_after_discount),
      category: product.category?.name_vi as string,
      brand: product.brand?.name as string,
      createdAt: convertMomentFromNowToVietnamese(moment(product.created_at).fromNow()),
      updatedAt: convertMomentFromNowToVietnamese(moment(product.updated_at).fromNow())
    }));
  }, [extendedProducts]);

  return (
    <Table
      data={extendedProducts}
      setData={setExtendedProducts}
      columns={columns}
      dataSource={dataSource}
      pageSize={productsPageSize}
      isLoading={getProductsQuery.isLoading}
      onSearch={(value) => setKeywordSearch(value)}
      updateItemPath={PATH.DASHBOARD_PRODUCT_UPDATE_WITHOUT_ID}
      onDelete={(productIds) => console.log(productIds)}
      tableName='Danh sách sản phẩm'
      addNewPath={PATH.DASHBOARD_PRODUCT_CREATE}
    />
  );
};

export default ProductList;
