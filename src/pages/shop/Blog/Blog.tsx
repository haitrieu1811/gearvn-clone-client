import { useQuery } from '@tanstack/react-query';
import { Fragment, useMemo } from 'react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import moment from 'moment';

import blogApi from 'src/apis/blog.api';
import BlogVertical from 'src/components/BlogVertical';
import { CaretDownIcon, ClockIcon } from 'src/components/Icons';
import Loading from 'src/components/Loading';
import PATH from 'src/constants/path';
import UseQueryParams from 'src/hooks/useQueryParams';
import { PaginationRequestParams } from 'src/types/utils.type';
import { generateNameId, getImageUrl, htmlToPlainText } from 'src/utils/utils';

type QueryConfig = {
  [key in keyof PaginationRequestParams]: string;
};

const Blog = () => {
  const queryParams: QueryConfig = UseQueryParams();
  const queryConfig: QueryConfig = {
    page: queryParams.page || '1',
    limit: queryParams.limit || '10'
  };

  // Query: Lấy danh sách blog
  const getBlogsQuery = useQuery({
    queryKey: ['blogs', queryConfig],
    queryFn: () => blogApi.getList(queryConfig),
    keepPreviousData: true
  });

  // Lấy danh sách blog
  const blogs = useMemo(() => getBlogsQuery.data?.data.data.blogs, [getBlogsQuery.data?.data.data.blogs]);
  const _blogs = useMemo(() => blogs?.slice(2, 6) || [], [blogs]);
  const __blogs = useMemo(() => blogs?.slice(7, 15) || [], [blogs]);

  return (
    <Fragment>
      <Helmet>
        <title>Tin công nghệ</title>
        <meta
          name='description'
          content='Mua sắm đồ công nghệ chính hãng với giá tốt nhất tại Gearvn-clone. Chúng tôi cung cấp đa dạng các sản phẩm công nghệ từ các thương hiệu nổi tiếng như Apple, Samsung, Huawei, Xiaomi,...'
        />
        <meta property='og:title' content='Tin công nghệ' />
        <meta
          property='og:description'
          content='Mua sắm đồ công nghệ chính hãng với giá tốt nhất tại Gearvn-clone. Chúng tôi cung cấp đa dạng các sản phẩm công nghệ từ các thương hiệu nổi tiếng như Apple, Samsung, Huawei, Xiaomi,...'
        />
        <meta
          property='og:image'
          content='https://gearvn-clone-ap-southeast-1.s3.ap-southeast-1.amazonaws.com/images/af998ec412e68932c8a77ba00.jpg'
        />
        <meta property='og:url' content={window.location.href} />
        <meta property='og:site_name' content='Tin công nghệ' />
        <meta property='og:type' content='website' />
      </Helmet>

      {/* Danh sách blog */}
      {blogs && blogs.length > 0 && !getBlogsQuery.isLoading && (
        <div className='px-2 md:container my-2 lg:my-4 bg-white rounded shadow-sm pb-8'>
          {/* Blog lớn */}
          <div className='grid grid-cols-12 gap-2 md:gap-6 lg:gap-10 pt-4'>
            <div className='col-span-12 md:col-span-7'>
              <div>
                <Link
                  to={`${PATH.BLOG_DETAIL_WITHOUT_ID}/${generateNameId({ name: blogs[0].name_vi, id: blogs[0]._id })}`}
                >
                  <img
                    src={getImageUrl(blogs[0].thumbnail)}
                    alt={blogs[0].name_vi}
                    className='w-full h-[240px] md:h-[360px] object-top object-cover rounded-sm'
                  />
                </Link>
                <Link
                  to={`${PATH.BLOG_DETAIL_WITHOUT_ID}/${generateNameId({ name: blogs[0].name_vi, id: blogs[0]._id })}`}
                  className='font-semibold text-lg md:text-[22px] mt-4 block line-clamp-2'
                >
                  {blogs[0].name_vi}
                </Link>
              </div>
            </div>
            <div className='col-span-12 md:col-span-5 mt-4 md:mt-0'>
              <Link
                to={`${PATH.BLOG_DETAIL_WITHOUT_ID}/${generateNameId({ name: blogs[1].name_vi, id: blogs[1]._id })}`}
              >
                <img
                  src={getImageUrl(blogs[1].thumbnail)}
                  alt={blogs[1].name_vi}
                  className='w-full h-[240px] object-cover'
                />
              </Link>
              <Link
                to={`${PATH.BLOG_DETAIL_WITHOUT_ID}/${generateNameId({ name: blogs[1].name_vi, id: blogs[1]._id })}`}
                className='line-clamp-2 font-semibold block my-2'
              >
                {blogs[1].name_vi}
              </Link>
              <p className='text-[#333333] text-sm leading-loose line-clamp-3'>
                {htmlToPlainText(blogs[1].content_vi)}
              </p>
            </div>
          </div>
          {/* 4 blog nằm ngang */}
          <div className='grid grid-cols-12 gap-4 mt-6'>
            {_blogs.map((blog) => (
              <div key={blog._id} className='col-span-6 md:col-span-3'>
                <BlogVertical data={blog} />
              </div>
            ))}
          </div>
          {/* Các blog nằm dọc */}
          <div className='mt-6'>
            {__blogs.map((blog) => (
              <div key={blog._id} className='border-t border-slate-300 py-6 flex items-start'>
                <Link to={`${PATH.BLOG_DETAIL_WITHOUT_ID}/${generateNameId({ name: blog.name_vi, id: blog._id })}`}>
                  <img
                    src={getImageUrl(blog.thumbnail)}
                    alt={blog.name_vi}
                    className='w-[120px] md:h-[122px] md:w-[218px] object-cover rounded'
                  />
                </Link>
                <div className='flex-1 ml-2 md:ml-4'>
                  <Link
                    to={`${PATH.BLOG_DETAIL_WITHOUT_ID}/${generateNameId({ name: blog.name_vi, id: blog._id })}`}
                    className='mb-[10px] block'
                  >
                    <span className='line-clamp-2 text-sm md:text-base font-semibold'>{blog.name_vi}</span>
                  </Link>
                  <div className='flex items-center'>
                    <span className='flex items-center'>
                      <ClockIcon className='w-3 h-3 md:w-4 md:h-4' />
                      <span className='text-slate-500 ml-1 text-xs md:text-sm'>
                        {moment(blog.created_at).format('DD.MM.YYYY')}
                      </span>
                    </span>
                    <span className='w-1 h-1 rounded-full bg-slate-500 block mx-2' />
                    <span className='text-blue-600 text-xs md:text-sm'>{blog.author.fullname}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
          {/* Xem thêm */}
          <div
            className='border border-[#CFCFCF] py-2 flex justify-center items-center text-[#1982F9] rounded'
            tabIndex={0}
            aria-hidden='true'
            role='button'
          >
            <span className='text-sm md:text-base'>Xem thêm bài viết</span>{' '}
            <CaretDownIcon className='w-2 h-2 md:w-3 md:h-3 fill-[#1982F9] ml-3' />
          </div>
        </div>
      )}

      {/* Loading */}
      {getBlogsQuery.isLoading && (
        <div className='min-h-[400px] bg-white rounded flex justify-center items-center my-4 container'>
          <Loading />
        </div>
      )}
    </Fragment>
  );
};

export default Blog;
