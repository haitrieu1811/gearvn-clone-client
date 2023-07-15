import { useQuery } from '@tanstack/react-query';
import omitBy from 'lodash/omitBy';
import isUndefined from 'lodash/isUndefined';
import { useContext, useEffect, useMemo } from 'react';
import keyBy from 'lodash/keyBy';
import moment from 'moment';
import { Link } from 'react-router-dom';

import productApi from 'src/apis/product.api';
import UseQueryParams from 'src/hooks/useQueryParams';
import { GetProductsRequestParams } from 'src/types/product.type';
import { AppContext } from 'src/contexts/app.context';
import Table from 'src/components/Table';
import Checkbox from 'src/components/Checkbox';
import TableAction from 'src/components/Table/TableAction';
import { formatCurrency } from 'src/utils/utils';
import { SearchIcon } from 'src/components/Icons';
import PATH from 'src/constants/path';

type QueryConfig = {
  [key in keyof GetProductsRequestParams]: string;
};

const List = () => {
  const { extendedProducts, setExtendedProducts } = useContext(AppContext);

  const queryParams: QueryConfig = UseQueryParams();
  const queryConfig: QueryConfig = omitBy(
    {
      page: queryParams.page || 1,
      limit: queryParams.limit || 10
    },
    isUndefined
  );

  const getProductsQuery = useQuery({
    queryKey: ['products', queryConfig],
    queryFn: () => productApi.getList(queryConfig)
  });

  const products = useMemo(
    () => getProductsQuery.data?.data.data.products,
    [getProductsQuery.data?.data.data.products]
  );

  useEffect(() => {
    if (products) {
      setExtendedProducts((prevState) => {
        const extendedProductsObj = keyBy(prevState, '_id');
        return products.map((product) => ({
          ...product,
          checked: Boolean(extendedProductsObj[product._id]?.checked)
        }));
      });
    }
  }, [products]);

  return (
    <div>
      <div className='flex justify-between items-center mb-4 bg-white py-3 px-4 rounded-lg shadow-sm'>
        <div>
          <div className='relative'>
            <input
              type='text'
              placeholder='Tìm kiếm'
              className='border rounded py-[6px] px-3 text-sm outline-none w-[180px] pr-11 bg-slate-100'
            />
            <button className='absolute top-1/2 -translate-y-1/2 right-0 h-full w-10 flex justify-center items-center'>
              <SearchIcon className='w-4 h-4' />
            </button>
          </div>
        </div>
        <Link
          to={PATH.DASHBOARD_PRODUCT_CREATE}
          className='px-2 py-[6px] rounded bg-blue-600 flex justify-center items-center'
        >
          <span className='text-white text-sm font-medium'>Tạo mới</span>
        </Link>
      </div>

      <Table
        initialData={products || []}
        columns={[1, 3, 1, 1, 1, 1, 1, 1, 1, 1]}
        head={[
          <Checkbox checked={false} onChange={() => {}} />,
          'Tên sản phẩm',
          'Giá gốc',
          'Giá gốc',
          'Giá sau khi giảm',
          'Danh mục',
          'Nhãn hiệu',
          'Tạo lúc',
          'Cập nhật',
          'Thao tác'
        ]}
        body={extendedProducts.map((product) => [
          <Checkbox checked={false} onChange={() => {}} />,
          product.name_vi,
          formatCurrency(product.price),
          formatCurrency(product.price),
          formatCurrency(product.price_after_discount),
          product.category.name_vi,
          product.brand.name,
          moment(product.created_at).fromNow(),
          moment(product.updated_at).fromNow(),
          <TableAction editPath={`${PATH.DASHBOARD_PRODUCT_UPDATE_WITHOUT_ID}/${product._id}`} />
        ])}
      />
    </div>
  );
};

export default List;
