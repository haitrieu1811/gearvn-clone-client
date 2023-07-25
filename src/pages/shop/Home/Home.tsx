import { useQuery } from '@tanstack/react-query';
import isUndefined from 'lodash/isUndefined';
import omitBy from 'lodash/omitBy';
import { Fragment, useMemo } from 'react';

import brandApi from 'src/apis/brand.api';
import categoryApi from 'src/apis/category.api';
import productApi from 'src/apis/product.api';
import Filter from 'src/components/Filter';
import Loading from 'src/components/Loading';
import ProductItem from 'src/components/ProductItem';
import Sort from 'src/components/Sort';
import UseQueryParams from 'src/hooks/useQueryParams';
import { GetProductsRequestParams } from 'src/types/product.type';

type QueryConfig = {
  [key in keyof GetProductsRequestParams]: string;
};

const Home = () => {
  const queryParams: QueryConfig = UseQueryParams();
  const queryConfig: QueryConfig = omitBy(
    {
      page: queryParams.page || 1,
      limit: queryParams.limit || 10,
      category: queryParams.category,
      brand: queryParams.brand,
      sortBy: queryParams.sortBy,
      orderBy: queryParams.orderBy
    },
    isUndefined
  );

  const getProductsQuery = useQuery({
    queryKey: ['products', queryConfig],
    queryFn: () => productApi.getList(queryConfig),
    keepPreviousData: true
  });

  const getBrandsQuery = useQuery({
    queryKey: ['brands'],
    queryFn: () => brandApi.getList()
  });

  const getCategoriesQuery = useQuery({
    queryKey: ['categories'],
    queryFn: () => categoryApi.getList()
  });

  const products = useMemo(
    () => getProductsQuery.data?.data.data.products,
    [getProductsQuery.data?.data.data.products]
  );
  const brands = useMemo(() => getBrandsQuery.data?.data.data.brands, [getBrandsQuery.data?.data.data.brands]);
  const categories = useMemo(
    () => getCategoriesQuery.data?.data.data.categories,
    [getCategoriesQuery.data?.data.data.categories]
  );

  return (
    <Fragment>
      <div className='container bg-white my-4 rounded shadow-sm pb-10'>
        {/* Bộ lọc sản phẩm */}
        <div className='py-6 px-3 flex'>
          {categories && categories.length > 0 && (
            <Filter
              queryName='category'
              label='Danh mục sản phẩm'
              data={categories.map((category) => ({
                value: category._id,
                text: category.name_vi
              }))}
            />
          )}
          <div className='mx-1' />
          {brands && brands.length > 0 && (
            <Filter
              queryName='brand'
              label='Nhãn hiệu'
              data={brands.map((brand) => ({
                value: brand._id,
                text: brand.name
              }))}
            />
          )}
        </div>
        {/* Sắp xếp sản phẩm */}
        <div className='flex justify-end mb-4'>
          <Sort
            data={[
              {
                orderBy: 'desc',
                sortBy: 'created_at',
                name: 'Nổi bật'
              },
              {
                orderBy: 'desc',
                sortBy: 'price_after_discount',
                name: 'Giá giảm dần'
              },
              {
                orderBy: 'asc',
                sortBy: 'price_after_discount',
                name: 'Giá tăng dần'
              }
            ]}
          />
        </div>
        {/* Danh sách sản phẩm */}
        {products && products.length > 0 && !getProductsQuery.isLoading && (
          <div className='grid grid-cols-10 gap-3'>
            {products.map((product, index) => (
              <div key={index} className='col-span-2'>
                <ProductItem data={product} />
              </div>
            ))}
          </div>
        )}
        {/* Không có sản phẩm nào phù hợp */}
        {products && products.length <= 0 && !getProductsQuery.isLoading && (
          <div className='p-[15px] bg-[#fcf8e3] border border-[#faebcc] text-sm text-[#8a6d3b]'>
            Chưa có sản phẩm nào trong danh mục này
          </div>
        )}
        {/* Loading */}
        {getProductsQuery.isLoading && (
          <div className='flex justify-center py-[50px]'>
            <Loading className='w-12 h-12' />
          </div>
        )}
      </div>
    </Fragment>
  );
};

export default Home;
