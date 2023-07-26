import { useQuery } from '@tanstack/react-query';
import { useMemo, Fragment } from 'react';
import { Link } from 'react-router-dom';

import blogApi from 'src/apis/blog.api';
import { CaretDownIcon, ClockIcon } from 'src/components/Icons';
import Loading from 'src/components/Loading';
import PATH from 'src/constants/path';
import UseQueryParams from 'src/hooks/useQueryParams';
import { GetBlogListRequestQuery } from 'src/types/blog.type';
import { generateNameId, getImageUrl, htmlToPlainText } from 'src/utils/utils';

type QueryConfig = {
  [key in keyof GetBlogListRequestQuery]: string;
};

const Blog = () => {
  const queryParams: QueryConfig = UseQueryParams();
  const queryConfig: QueryConfig = {
    page: queryParams.page || '1',
    limit: queryParams.limit || '10'
  };

  const getBlogsQuery = useQuery({
    queryKey: ['blogs', queryConfig],
    queryFn: () => blogApi.getList(queryConfig),
    keepPreviousData: true
  });

  const blogs = useMemo(() => getBlogsQuery.data?.data.data.blogs, [getBlogsQuery.data?.data.data.blogs]);

  return (
    <Fragment>
      {blogs && blogs.length > 0 && !getBlogsQuery.isLoading && (
        <div className='container my-4 bg-white rounded shadow-sm pb-8'>
          <div className='grid grid-cols-12 gap-10 pt-4'>
            <div className='col-span-7'>
              <div>
                <Link
                  to={`${PATH.BLOG_DETAIL_WITHOUT_ID}/${generateNameId({ name: blogs[0].name_vi, id: blogs[0]._id })}`}
                >
                  <img
                    src={getImageUrl(blogs[0].thumbnail)}
                    alt={blogs[0].name_vi}
                    className='w-full h-[360px] object-top object-cover rounded-sm'
                  />
                </Link>
                <Link
                  to={`${PATH.BLOG_DETAIL_WITHOUT_ID}/${generateNameId({ name: blogs[0].name_vi, id: blogs[0]._id })}`}
                  className='font-semibold text-[22px] mt-4 block line-clamp-2'
                >
                  {blogs[0].name_vi}
                </Link>
              </div>
            </div>
            <div className='col-span-5'>
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
          <div className='grid grid-cols-12 gap-4 mt-6'>
            {blogs.slice(2, 6).map((blog) => (
              <div key={blog._id} className='col-span-3'>
                <Link to={`${PATH.BLOG_DETAIL_WITHOUT_ID}/${generateNameId({ name: blog.name_vi, id: blog._id })}`}>
                  <img src={getImageUrl(blog.thumbnail)} alt='' className='w-full h-[160px] object-cover rounded-sm' />
                </Link>
                <Link
                  to={`${PATH.BLOG_DETAIL_WITHOUT_ID}/${generateNameId({ name: blog.name_vi, id: blog._id })}`}
                  className='text-[#333333] font-semibold line-clamp-2 block mt-2'
                >
                  {blog.name_vi}
                </Link>
              </div>
            ))}
          </div>
          <div className='mt-6'>
            {blogs.slice(7, 15).map((blog) => (
              <div key={blog._id} className='border-t border-slate-300 py-6 flex items-start'>
                <Link to={`${PATH.BLOG_DETAIL_WITHOUT_ID}/${generateNameId({ name: blog.name_vi, id: blog._id })}`}>
                  <img
                    src={getImageUrl(blog.thumbnail)}
                    alt={blog.name_vi}
                    className='h-[122px] w-[218px] object-cover rounded'
                  />
                </Link>
                <div className='flex-1 ml-4'>
                  <Link
                    to={`${PATH.BLOG_DETAIL_WITHOUT_ID}/${generateNameId({ name: blog.name_vi, id: blog._id })}`}
                    className='font-semibold mb-[10px] block'
                  >
                    {blog.name_vi}
                  </Link>
                  <div className='flex items-center text-sm'>
                    <span className='flex items-center'>
                      <ClockIcon className='w-4 h-4' />
                      <span className='text-slate-500 ml-1'>Thứ Năm 22,06,2023</span>
                    </span>
                    <span className='w-1 h-1 rounded-full bg-slate-500 block mx-2' />
                    <span className='text-blue-600'>Lê Thị Mỹ Duyên</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div
            className='border border-[#CFCFCF] py-2 flex justify-center items-center text-[#1982F9] rounded'
            tabIndex={0}
            aria-hidden='true'
            role='button'
          >
            Xem thêm bài viết <CaretDownIcon className='w-3 h-3 fill-[#1982F9] ml-3' />
          </div>
        </div>
      )}
      {getBlogsQuery.isLoading && (
        <div className='container flex justify-center my-3 py-[100px] bg-white'>
          <Loading className='w-12 h-12' />
        </div>
      )}
    </Fragment>
  );
};

export default Blog;
