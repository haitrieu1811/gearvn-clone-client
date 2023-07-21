import { useQuery } from '@tanstack/react-query';
import omitBy from 'lodash/omitBy';
import isUndefined from 'lodash/isUndefined';
import { useMemo } from 'react';

import ProductItem from 'src/components/ProductItem';
import productApi from 'src/apis/product.api';
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

  return (
    <div className='container min-h-screen bg-white my-4 rounded shadow-sm'>
      <div className='grid grid-cols-10 gap-3'>
        {products &&
          products.length > 0 &&
          products.map((product, index) => (
            <div key={index} className='col-span-2'>
              <ProductItem data={product} />
            </div>
          ))}
      </div>
    </div>
  );
};

export default Home;
