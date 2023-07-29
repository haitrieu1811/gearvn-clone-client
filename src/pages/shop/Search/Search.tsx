import { useQuery } from '@tanstack/react-query';
import isUndefined from 'lodash/isUndefined';
import omitBy from 'lodash/omitBy';
import { useMemo } from 'react';

import productApi from 'src/apis/product.api';
import { EmptyImage } from 'src/components/Icons';
import Loading from 'src/components/Loading';
import Pagination from 'src/components/Pagination';
import ProductItem from 'src/components/ProductItem';
import UseQueryParams from 'src/hooks/useQueryParams';
import { GetProductsRequestParams } from 'src/types/product.type';

type QueryConfig = {
  [key in keyof GetProductsRequestParams]: string;
};

const Search = () => {
  const queryParams: QueryConfig = UseQueryParams();
  const queryConfig: QueryConfig = omitBy(
    {
      name: queryParams.name,
      page: queryParams.page || 1
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

  const productsCount = useMemo(
    () => getProductsQuery.data?.data.data.pagination.total,
    [getProductsQuery.data?.data.data.pagination.total]
  );

  const pageSize = useMemo(
    () => getProductsQuery.data?.data.data.pagination.page_size,
    [getProductsQuery.data?.data.data.pagination.page_size]
  );

  return (
    <div>
      <div className='container bg-white my-4 rounded shadow-sm py-6'>
        <h1 className='uppercase text-2xl font-semibold text-[#333333] text-center mb-6'>Tìm kiếm</h1>

        {/* Hiển thị khi có dữ liệu */}
        {products && products.length > 0 && !getProductsQuery.isLoading && (
          <div>
            <div className='text-sm text-center mb-4'>
              Tìm kiếm theo <span className='font-bold'>"{queryConfig.name}"</span>. ({productsCount} sản phẩm)
            </div>
            <div className='grid grid-cols-10 gap-3'>
              {products.map((product) => (
                <div key={product._id} className='col-span-2'>
                  <ProductItem data={product} />
                </div>
              ))}
            </div>
            <div className='flex justify-center mt-10'>
              <Pagination pageSize={pageSize || 0} />
            </div>
          </div>
        )}

        {/* Hiển thị khi không có dữ liệu */}
        {products && products.length <= 0 && !getProductsQuery.isLoading && (
          <div className='flex flex-col justify-center items-center'>
            <EmptyImage />
            <form className='my-6 w-[500px] h-10 flex'>
              <input
                type='text'
                placeholder='Tìm kiếm'
                className='flex-1 h-full border border-black rounded-sm py-[5px] px-[10px] outline-none text-sm'
              />
              <button className='bg-black text-white rounded-sm w-[100px] ml-1 text-sm'>Tìm kiếm</button>
            </form>
            <div className='text-center text-sm'>
              <p className='mb-2'>Rất tiếc, chúng tôi không tìm thấy kết quả cho từ khóa của bạn</p>
              <p className='mb-2'>Vui lòng kiểm tra chính tả, sử dụng các từ tổng quát hơn và thử lại!</p>
            </div>
          </div>
        )}

        {/* Loading */}
        {getProductsQuery.isLoading && (
          <div className='py-[100px] flex justify-center'>
            <Loading className='w-12 h-12' />
          </div>
        )}
      </div>
    </div>
  );
};

export default Search;
