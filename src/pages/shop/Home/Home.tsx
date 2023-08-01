import { useQuery } from '@tanstack/react-query';
import { useMemo } from 'react';
import { Link } from 'react-router-dom';

import blogApi from 'src/apis/blog.api';
import productApi from 'src/apis/product.api';
import BlogVertical from 'src/components/BlogVertical';
import Carousel from 'src/components/Carousel';
import Loading from 'src/components/Loading';
import PATH from 'src/constants/path';
import MegaMenu from 'src/layouts/components/Header/MegaMenu';
import ProductSection from './ProductSection';

const Home = () => {
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
    <div className='my-3'>
      {/* Mega menu, carousel */}
      <div className='container'>
        <div className='flex'>
          <MegaMenu />
          <div className='grid grid-cols-12 gap-1 ml-[15px]'>
            <div className='col-span-8'>
              <Carousel />
            </div>
            <div className='col-span-4'>
              <Link to={PATH.HOME}>
                <img
                  src='https://file.hstatic.net/200000722513/file/banner_slider_-_right_1_04cb85fcde584ec0a0818d9e5e212282.png'
                  alt=''
                />
              </Link>
              <Link to={PATH.HOME}>
                <img
                  src='https://file.hstatic.net/200000722513/file/banner_slider_-_right_2_5f844c8513ea42628d4e5e49c7a28d70.png'
                  alt=''
                />
              </Link>
            </div>
          </div>
        </div>
      </div>
      {/* Laptop bán chạy */}
      <div className='container mt-3'>
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
                name: 'Acer'
              },
              {
                to: `${PATH.PRODUCT}?category=64afbb1839753e4263bc467e-64bcd8a8ae38e6a282211269&brand=64bcda92ae38e6a282211272`,
                name: 'LENOVO'
              }
            ]}
          />
        )}
        {getLaptopsQuery.isLoading && (
          <div className='bg-white rounded shadow-sm flex justify-center py-[100px]'>
            <Loading className='w-12 h-12' />
          </div>
        )}
      </div>
      {/* Bàn phím bán chạy */}
      <div className='container mt-3'>
        {keyboards && keyboards.length > 0 && !getKeyboardsQuery.isLoading && (
          <ProductSection
            headingTitle='Bàn phím bán chạy'
            data={keyboards}
            viewAllTo={`${PATH.PRODUCT}?category=64afcf014a921a14beb05915`}
            subLinks={[
              {
                to: `${PATH.PRODUCT}?category=64afcf014a921a14beb05915&brand=64b9081ca692e0ad3a11afd6`,
                name: 'AKKO'
              }
            ]}
          />
        )}
        {getKeyboardsQuery.isLoading && (
          <div className='bg-white rounded shadow-sm flex justify-center py-[100px]'>
            <Loading className='w-12 h-12' />
          </div>
        )}
      </div>
      {/* Chuột bán chạy */}
      <div className='container mt-3'>
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
                name: 'Cooler master'
              }
            ]}
          />
        )}
        {getMousesQuery.isLoading && (
          <div className='bg-white rounded shadow-sm flex justify-center py-[100px]'>
            <Loading className='w-12 h-12' />
          </div>
        )}
      </div>
      {/* Tin tức công nghệ */}
      <div className='container mt-3'>
        {blogs && blogs.length > 0 && !getBlogsQuery.isLoading && (
          <div className='bg-white rounded shadow-sm'>
            <div className='flex justify-between items-center py-3 px-6'>
              <h2 className='text-2xl font-semibold'>Tin tức công nghệ</h2>
              <Link to={PATH.BLOG} className='text-lg text-[#1982F9] hover:text-primary'>
                Xem tất cả
              </Link>
            </div>
            {blogs && blogs.length > 0 && (
              <div className='grid grid-cols-12 gap-4 px-6 pb-8'>
                {blogs.map((blog) => (
                  <div key={blog._id} className='col-span-3'>
                    <BlogVertical data={blog} />
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
        {getBlogsQuery.isLoading && (
          <div className='bg-white rounded shadow-sm flex justify-center py-[100px]'>
            <Loading className='w-12 h-12' />
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;
