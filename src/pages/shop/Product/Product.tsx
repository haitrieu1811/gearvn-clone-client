import { useQuery } from '@tanstack/react-query';
import isUndefined from 'lodash/isUndefined';
import omitBy from 'lodash/omitBy';
import { Fragment, useMemo } from 'react';
import { Helmet } from 'react-helmet-async';

import brandApi from 'src/apis/brand.api';
import categoryApi from 'src/apis/category.api';
import productApi from 'src/apis/product.api';
import Filter from 'src/components/Filter';
import Loading from 'src/components/Loading';
import Pagination from 'src/components/Pagination/Pagination';
import ProductItem from 'src/components/ProductItem';
import Sort from 'src/components/Sort';
import UseQueryParams from 'src/hooks/useQueryParams';
import { GetProductsRequestParams } from 'src/types/product.type';

type QueryConfig = {
  [key in keyof GetProductsRequestParams]: string;
};

const Product = () => {
  const queryParams: QueryConfig = UseQueryParams();
  const queryConfig: QueryConfig = omitBy(
    {
      page: queryParams.page || 1,
      limit: queryParams.limit || 20,
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
  const pageSize = useMemo(
    () => getProductsQuery.data?.data.data.pagination.page_size,
    [getProductsQuery.data?.data.data.pagination.page_size]
  );

  return (
    <div className='lg:container'>
      <Helmet>
        <title>Danh sách sản phẩm</title>
        <meta
          name='description'
          content='Mua sắm đồ công nghệ chính hãng với giá tốt nhất tại Gearvn-clone. Chúng tôi cung cấp đa dạng các sản phẩm công nghệ từ các thương hiệu nổi tiếng như Apple, Samsung, Huawei, Xiaomi,...'
        />
        <meta property='og:title' content='Danh sách sản phẩm' />
        <meta
          property='og:description'
          content='Mua sắm đồ công nghệ chính hãng với giá tốt nhất tại Gearvn-clone. Chúng tôi cung cấp đa dạng các sản phẩm công nghệ từ các thương hiệu nổi tiếng như Apple, Samsung, Huawei, Xiaomi,...'
        />
        <meta
          property='og:image'
          content='https://gearvn-clone-ap-southeast-1.s3.ap-southeast-1.amazonaws.com/images/af998ec412e68932c8a77ba00.jpg'
        />
        <meta property='og:url' content={window.location.href} />
        <meta property='og:site_name' content='Danh sách sản phẩm' />
        <meta property='og:type' content='website' />
      </Helmet>
      <div className='bg-white my-2 lg:my-4 rounded shadow-sm pb-10 px-3'>
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
          <Fragment>
            <div className='grid grid-cols-12 lg:grid-cols-10 gap-3'>
              {products.map((product, index) => (
                <div key={index} className='col-span-6 md:col-span-4 lg:col-span-2'>
                  <ProductItem data={product} />
                </div>
              ))}
            </div>
            <div className='flex justify-center mt-10'>
              <Pagination
                pageSize={pageSize || 0}
                classNameItem='w-8 h-8 md:w-10 md:h-10 mx-1 rounded-full flex justify-center items-center font-semibold text-sm md:text-base select-none'
                classNameItemActive='bg-black text-white pointer-events-none'
                classNameItemUnActive='bg-[#f3f3f3]'
              />
            </div>
          </Fragment>
        )}
        {/* Không có sản phẩm nào phù hợp */}
        {products && products.length <= 0 && !getProductsQuery.isLoading && (
          <div className='p-2 md:p-[15px] bg-[#fcf8e3] border border-[#faebcc] text-xs md:text-sm text-[#8a6d3b]'>
            Chưa có sản phẩm nào trong danh mục này
          </div>
        )}
        {/* Loading */}
        {getProductsQuery.isLoading && <Loading />}
      </div>
    </div>
  );
};

export default Product;
