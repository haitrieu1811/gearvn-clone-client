import keyBy from 'lodash/keyBy';
import moment from 'moment';
import { useContext, useEffect, useMemo, useState } from 'react';

import Table from 'src/components/Table';
import PATH from 'src/constants/path';
import { AppContext } from 'src/contexts/app.context';
import useDebounce from 'src/hooks/useDebounce';
import useProduct from 'src/hooks/useProduct';
import UseQueryParams from 'src/hooks/useQueryParams';
import { GetProductsRequestParams } from 'src/types/product.type';
import { convertMomentFromNowToVietnamese, formatCurrency } from 'src/utils/utils';

type QueryConfig = {
  [key in keyof GetProductsRequestParams]: string;
};

const ProductList = () => {
  const { extendedProducts, setExtendedProducts } = useContext(AppContext);
  const [keywordSearch, setKeywordSearch] = useState<string>('');
  const keywordSearchDebounce = useDebounce(keywordSearch, 1000);
  const queryParams: QueryConfig = UseQueryParams();
  const queryConfig: QueryConfig = {
    ...queryParams,
    name: keywordSearchDebounce
  };
  const { products, productsPageSize, getProductsQuery } = useProduct(queryConfig);

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
    />
  );
};

export default ProductList;
