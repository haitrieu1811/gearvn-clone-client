import { useQuery } from '@tanstack/react-query';
import { Fragment, useMemo } from 'react';
import { Link } from 'react-router-dom';

import userApi from 'src/apis/user.api';
import { EmptyImage } from 'src/components/Icons';
import Loading from 'src/components/Loading';
import ProductItem from 'src/components/ProductItem';
import PATH from 'src/constants/path';

const ViewedProduct = () => {
  const getViewedProductsQuery = useQuery({
    queryKey: ['viewed_products'],
    queryFn: () => userApi.getViewedProducts()
  });

  const viewedProducts = useMemo(
    () => getViewedProductsQuery.data?.data.data.viewed_products,
    [getViewedProductsQuery.data?.data.data.viewed_products]
  );

  return (
    <div className='bg-white rounded shadow-sm'>
      {/* Hiển thị khi có dữ liệu */}
      {viewedProducts && viewedProducts.length > 0 && !getViewedProductsQuery.isLoading && (
        <Fragment>
          <h2 className='py-4 px-6 text-2xl font-semibold'>Sản phẩm đã xem</h2>
          <div className='grid grid-cols-12 gap-3 py-6 px-3'>
            {viewedProducts.map((viewedProduct) => (
              <div key={viewedProduct._id} className='col-span-3'>
                <ProductItem data={viewedProduct.product} />
              </div>
            ))}
          </div>
        </Fragment>
      )}

      {/* Hiển thị khi không có dữ liệu */}
      {viewedProducts && viewedProducts.length <= 0 && !getViewedProductsQuery.isLoading && (
        <div className='flex justify-center items-center flex-col py-[100px]'>
          <EmptyImage />
          <p className='mt-4'>Bạn chưa xem sản phẩm nào</p>
          <Link to={PATH.HOME} className='bg-primary text-white rounded py-2 px-6 mt-4 hover:bg-primary/90'>
            Xem sản phẩm
          </Link>
        </div>
      )}

      {/* Tải trang */}
      {getViewedProductsQuery.isLoading && (
        <div className='flex justify-center py-[100px]'>
          <Loading className='w-12 h-12' />
        </div>
      )}
    </div>
  );
};

export default ViewedProduct;
