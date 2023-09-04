import { useQuery } from '@tanstack/react-query';
import { useMemo } from 'react';
import { Helmet } from 'react-helmet-async';
import { useMediaQuery } from 'react-responsive';
import { Link } from 'react-router-dom';

import blogApi from 'src/apis/blog.api';
import productApi from 'src/apis/product.api';
import BlogVertical from 'src/components/BlogVertical';
import Carousel from 'src/components/Carousel';
import Loading from 'src/components/Loading';
import MegaMenu from 'src/components/MegaMenu';
import CONFIG from 'src/constants/config';
import PATH from 'src/constants/path';
import ProductSection from './ProductSection';

const Home = () => {
  const isTablet = useMediaQuery({ maxWidth: CONFIG.TABLET_SCREEN_SIZE });

  const getKeyboardsQuery = useQuery({
    queryKey: ['keyboards'],
    queryFn: () => productApi.getList({ category: '64afcf014a921a14beb05915', limit: '5' })
  });

  const getLaptopsQuery = useQuery({
    queryKey: ['laptops'],
    queryFn: () => productApi.getList({ category: '64afbb1839753e4263bc467e-64bcd8a8ae38e6a282211269', limit: '5' })
  });

  const getMousesQuery = useQuery({
    queryKey: ['mouses'],
    queryFn: () => productApi.getList({ category: '64b8f36ca692e0ad3a11afcc', limit: '5' })
  });

  const getBlogsQuery = useQuery({
    queryKey: ['blogs'],
    queryFn: () => blogApi.getList({ limit: '4' })
  });

  const keyboards = useMemo(
    () => getKeyboardsQuery.data?.data.data.products,
    [getKeyboardsQuery.data?.data.data.products]
  );
  const laptops = useMemo(() => getLaptopsQuery.data?.data.data.products, [getLaptopsQuery.data?.data.data.products]);
  const mouses = useMemo(() => getMousesQuery.data?.data.data.products, [getMousesQuery.data?.data.data.products]);
  const blogs = useMemo(() => getBlogsQuery.data?.data.data.blogs, [getBlogsQuery.data?.data.data.blogs]);

  return (
    <div className='my-2 lg:my-3'>
      <Helmet>
        <title>Gearvn clone | Trang chủ</title>
        <meta
          name='description'
          content='Mua sắm đồ công nghệ chính hãng với giá tốt nhất tại Gearvn-clone. Chúng tôi cung cấp đa dạng các sản phẩm công nghệ từ các thương hiệu nổi tiếng như Apple, Samsung, Huawei, Xiaomi,...'
        />
        <meta property='og:title' content='Gearvn clone | Trang chủ' />
        <meta
          property='og:description'
          content='Mua sắm đồ công nghệ chính hãng với giá tốt nhất tại Gearvn-clone. Chúng tôi cung cấp đa dạng các sản phẩm công nghệ từ các thương hiệu nổi tiếng như Apple, Samsung, Huawei, Xiaomi,...'
        />
        <meta
          property='og:image'
          content='https://gearvn-clone-ap-southeast-1.s3.ap-southeast-1.amazonaws.com/images/af998ec412e68932c8a77ba00.jpg'
        />
        <meta property='og:url' content={window.location.href} />
        <meta property='og:site_name' content='Trang chủ' />
        <meta property='og:type' content='website' />
      </Helmet>
      {/* Mega menu, carousel */}
      <div className='px-2 lg:container'>
        <div className='flex'>
          {!isTablet && <MegaMenu />}
          <div className='flex-1 grid grid-cols-12 gap-2 lg:ml-[15px]'>
            <div className='col-span-12 lg:col-span-8'>
              <Carousel />
            </div>
            <div className='col-span-12 lg:col-span-4'>
              <div className='grid grid-cols-12'>
                <Link to={PATH.HOME} className='col-span-6 lg:col-span-12 -ml-3 lg:ml-0'>
                  <img
                    src='https://file.hstatic.net/200000722513/file/banner_slider_-_bottom_1_5b6a8d4aa5b643a0b47e4afcc53f9592.png'
                    alt=''
                  />
                </Link>
                <Link to={PATH.HOME} className='col-span-6 lg:col-span-12 block lg:mt-2'>
                  <img
                    src='https://file.hstatic.net/200000722513/file/banner_slider_-_bottom_2_174ef77e3cab47abbc01abb351de4f25.png'
                    alt=''
                  />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* Laptop bán chạy */}
      <div className='lg:container mt-3'>
        {laptops && laptops.length > 0 && !getLaptopsQuery.isLoading && (
          <ProductSection
            headingTitle='Laptop bán chạy'
            data={laptops}
            viewAllTo={`${PATH.PRODUCT}?category=64afbb1839753e4263bc467e-64bcd8a8ae38e6a282211269`}
            subLinks={[
              {
                to: `${PATH.PRODUCT}?category=64afbb1839753e4263bc467e-64bcd8a8ae38e6a282211269&brand=64afcf2d4a921a14beb05916`,
                name: 'ASUS'
              },
              {
                to: `${PATH.PRODUCT}?category=64afbb1839753e4263bc467e-64bcd8a8ae38e6a282211269&brand=64bcda92ae38e6a282211272`,
                name: 'ACER'
              },
              {
                to: `${PATH.PRODUCT}?category=64afbb1839753e4263bc467e-64bcd8a8ae38e6a282211269&brand=64bcda92ae38e6a282211272`,
                name: 'LENOVO'
              }
            ]}
          />
        )}
        {getLaptopsQuery.isLoading && <Loading />}
      </div>
      {/* Bàn phím bán chạy */}
      <div className='lg:container mt-3'>
        {keyboards && keyboards.length > 0 && !getKeyboardsQuery.isLoading && (
          <ProductSection
            headingTitle='Bàn phím bán chạy'
            data={keyboards}
            viewAllTo={`${PATH.PRODUCT}?category=64afcf014a921a14beb05915`}
            subLinks={[
              {
                to: `${PATH.PRODUCT}?category=64afcf014a921a14beb05915&brand=64b9081ca692e0ad3a11afd6`,
                name: 'Akko'
              }
            ]}
          />
        )}
        {getKeyboardsQuery.isLoading && <Loading />}
      </div>
      {/* Chuột bán chạy */}
      <div className='lg:container mt-3'>
        {mouses && mouses.length > 0 && !getMousesQuery.isLoading && (
          <ProductSection
            headingTitle='Chuột bán chạy'
            data={mouses}
            viewAllTo={`${PATH.PRODUCT}?category=64b8f36ca692e0ad3a11afcc`}
            subLinks={[
              {
                to: `${PATH.PRODUCT}?category=64b8f36ca692e0ad3a11afcc&brand=64c3e3eb9267282e701739b6`,
                name: 'Dare-U'
              },
              {
                to: `${PATH.PRODUCT}?category=64b8f36ca692e0ad3a11afcc&brand=64bcdb59ae38e6a282211275`,
                name: 'Razer'
              },
              {
                to: `${PATH.PRODUCT}?category=64b8f36ca692e0ad3a11afcc&brand=64b8f385a692e0ad3a11afcd`,
                name: 'Cooler Master'
              }
            ]}
          />
        )}
        {getMousesQuery.isLoading && <Loading />}
      </div>
      {/* Tin tức công nghệ */}
      <div className='lg:container mt-3'>
        {blogs && blogs.length > 0 && !getBlogsQuery.isLoading && (
          <div className='bg-white rounded shadow-sm'>
            <div className='flex justify-between items-center py-3 px-4 md:px-6'>
              <h2 className='text-lg md:text-2xl font-semibold'>Tin tức công nghệ</h2>
              <Link to={PATH.BLOG} className='text-sm md:text-lg text-[#1982F9] hover:text-primary'>
                Xem tất cả
              </Link>
            </div>
            {blogs && blogs.length > 0 && (
              <div className='grid grid-cols-12 gap-4 px-4 md:px-6 pb-8'>
                {blogs.map((blog) => (
                  <div key={blog._id} className='col-span-6 lg:col-span-3'>
                    <BlogVertical data={blog} />
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
        {getBlogsQuery.isLoading && <Loading />}
      </div>
    </div>
  );
};

export default Home;
