import { useQuery } from '@tanstack/react-query';
import isUndefined from 'lodash/isUndefined';
import omitBy from 'lodash/omitBy';
import { FormEvent, useMemo, useState } from 'react';
import { createSearchParams, useNavigate } from 'react-router-dom';

import productApi from 'src/apis/product.api';
import { EmptyImage } from 'src/components/Icons';
import Loading from 'src/components/Loading';
import Pagination from 'src/components/Pagination';
import ProductItem from 'src/components/ProductItem';
import PATH from 'src/constants/path';
import UseQueryParams from 'src/hooks/useQueryParams';
import { GetProductsRequestParams } from 'src/types/product.type';

type QueryConfig = {
  [key in keyof GetProductsRequestParams]: string;
};

const Search = () => {
  const navigate = useNavigate();
  const queryParams: QueryConfig = UseQueryParams();
  const queryConfig: QueryConfig = omitBy(
    {
      name: queryParams.name,
      page: queryParams.page || 1
    },
    isUndefined
  );

  const [keywordSearch, setKeywordSearch] = useState<string>('');

  const getProductsQuery = useQuery({
    queryKey: ['products', queryConfig],
    queryFn: () => productApi.getList(queryConfig),
    keepPreviousData: true
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

  // Tìm kiếm lại
  const searchAgain = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    navigate({
      pathname: PATH.SEARCH,
      search: createSearchParams({
        ...queryConfig,
        name: keywordSearch
      }).toString()
    });
  };

  return (
    <div>
      <div className='px-2 lg:container bg-white my-2 md:my-4 rounded shadow-sm py-6'>
        <h1 className='uppercase text-2xl font-semibold text-[#333333] text-center mb-6'>Tìm kiếm</h1>

        {/* Hiển thị khi có dữ liệu */}
        {products && products.length > 0 && !getProductsQuery.isLoading && (
          <div>
            <div className='text-sm text-center mb-4'>
              Tìm kiếm theo <span className='font-bold'>"{queryConfig.name}"</span>. ({productsCount} sản phẩm)
            </div>
            <div className='grid grid-cols-12 lg:grid-cols-10 gap-3'>
              {products.map((product) => (
                <div key={product._id} className='col-span-6 md:col-span-4   lg:col-span-2'>
                  <ProductItem data={product} />
                </div>
              ))}
            </div>
            <div className='flex justify-center mt-10'>
              <Pagination
                pageSize={pageSize || 0}
                classNameItem='w-10 h-10 mx-1 rounded-full flex justify-center items-center font-semibold text-base select-none'
                classNameItemActive='bg-black text-white select-none'
                classNameItemUnActive='bg-[#f3f3f3]'
              />
            </div>
          </div>
        )}

        {/* Hiển thị khi không có dữ liệu */}
        {products && products.length <= 0 && !getProductsQuery.isLoading && (
          <div className='flex flex-col justify-center items-center'>
            <EmptyImage />
            <div className='w-[500px] text-center'>
              <h2 className='font-semibold text-[#333333] mb-[10px]'>Không tìm thấy nội dung bạn yêu cầu</h2>
              <p className='text-sm mb-5'>
                Không tìm thấy <span className='font-bold'>"{queryConfig.name}"</span>. Vui lòng kiểm tra chính tả, sử
                dụng các từ tổng quát hơn và thử lại!
              </p>
            </div>
            <form className='mb-5 w-[500px] h-10 flex' onSubmit={searchAgain}>
              <input
                type='text'
                placeholder='Tìm kiếm'
                value={keywordSearch}
                onChange={(e) => setKeywordSearch(e.target.value)}
                className='flex-1 h-full border border-black rounded-sm py-[5px] px-[10px] outline-none text-sm'
              />
              <button className='bg-black text-white rounded-sm w-[100px] ml-1 text-sm'>Tìm kiếm</button>
            </form>
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
