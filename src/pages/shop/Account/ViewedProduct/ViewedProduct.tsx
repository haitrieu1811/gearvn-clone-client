import { useQuery } from '@tanstack/react-query';
import { Fragment, useMemo } from 'react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';

import userApi from 'src/apis/user.api';
import { EmptyImage } from 'src/components/Icons';
import Loading from 'src/components/Loading';
import ProductItem from 'src/components/ProductItem';
import PATH from 'src/constants/path';

const ViewedProduct = () => {
  // Query: Lấy danh sách sản phẩm đã xem
  const getViewedProductsQuery = useQuery({
    queryKey: ['viewed_products'],
    queryFn: () => userApi.getViewedProducts()
  });

  // Danh sách sản phẩm đã xem
  const viewedProducts = useMemo(
    () => getViewedProductsQuery.data?.data.data.viewed_products,
    [getViewedProductsQuery.data?.data.data.viewed_products]
  );

  return (
    <div className='bg-white rounded shadow-sm'>
      <Helmet>
        <title>Sản phẩm đã xem</title>
        <meta
          name='description'
          content='Mua sắm đồ công nghệ chính hãng với giá tốt nhất tại Gearvn-clone. Chúng tôi cung cấp đa dạng các sản phẩm công nghệ từ các thương hiệu nổi tiếng như Apple, Samsung, Huawei, Xiaomi,...'
        />
        <meta property='og:title' content='Sản phẩm đã xem' />
        <meta
          property='og:description'
          content='Mua sắm đồ công nghệ chính hãng với giá tốt nhất tại Gearvn-clone. Chúng tôi cung cấp đa dạng các sản phẩm công nghệ từ các thương hiệu nổi tiếng như Apple, Samsung, Huawei, Xiaomi,...'
        />
        <meta
          property='og:image'
          content='https://gearvn-clone-ap-southeast-1.s3.ap-southeast-1.amazonaws.com/images/af998ec412e68932c8a77ba00.jpg'
        />
        <meta property='og:url' content={window.location.href} />
        <meta property='og:site_name' content='Sản phẩm đã xem' />
        <meta property='og:type' content='website' />
      </Helmet>

      {/* Hiển thị khi có dữ liệu */}
      {viewedProducts && viewedProducts.length > 0 && !getViewedProductsQuery.isLoading && (
        <Fragment>
          <h2 className='py-4 px-2 md:px-6 text-xl md:text-2xl font-semibold'>Sản phẩm đã xem</h2>
          <div className='grid grid-cols-12 gap-3 py-2 md:py-6 px-3'>
            {viewedProducts.map((viewedProduct) => (
              <div key={viewedProduct._id} className='col-span-6 md:col-span-4 lg:col-span-3'>
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

      {/* Loading */}
      {getViewedProductsQuery.isLoading && (
        <div className='min-h-[400px] flex justify-center items-center'>
          <Loading />
        </div>
      )}
    </div>
  );
};

export default ViewedProduct;
