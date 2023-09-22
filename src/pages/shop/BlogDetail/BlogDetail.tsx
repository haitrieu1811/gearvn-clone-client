import { useQuery } from '@tanstack/react-query';
import DOMPurify from 'dompurify';
import { convert } from 'html-to-text';
import moment from 'moment';
import { Fragment, useMemo } from 'react';
import { Helmet } from 'react-helmet-async';
import { useParams } from 'react-router-dom';

import blogApi from 'src/apis/blog.api';
import BlogVertical from 'src/components/BlogVertical';
import { ClockIcon } from 'src/components/Icons';
import Loading from 'src/components/Loading';
import { getIdFromNameId, getImageUrl } from 'src/utils/utils';

const BlogDetail = () => {
  const { name_id } = useParams();
  const blogId = getIdFromNameId(name_id as string);

  // Query: Chi tiết blog
  const getBlogQuery = useQuery({
    queryKey: ['blog', blogId],
    queryFn: () => blogApi.getDetail(blogId),
    enabled: !!blogId
  });

  // Danh sách blog khác
  const getBlogsQuery = useQuery({
    queryKey: ['blogs'],
    queryFn: () => blogApi.getList({ limit: '6' })
  });

  // Lấy thông tin blog
  const blog = useMemo(() => getBlogQuery.data?.data.data.blog, [getBlogQuery.data?.data.data.blog]);

  // Danh sách blog khác
  const otherBlogs = useMemo(() => getBlogsQuery.data?.data.data.blogs, [getBlogsQuery.data?.data.data.blogs]);

  return (
    <Fragment>
      {blog && (
        <Helmet>
          <title>{blog.name_vi}</title>
          <meta
            name='description'
            content={convert(blog.content_vi, {
              limits: {
                maxInputLength: 150
              }
            })}
          />
          <meta property='og:title' content={blog.name_vi} />
          <meta
            property='og:description'
            content={convert(blog.content_vi, {
              limits: {
                maxInputLength: 150
              }
            })}
          />
          <meta property='og:image' content={getImageUrl(blog.thumbnail)} />
          <meta property='og:url' content={window.location.href} />
          <meta property='og:site_name' content={blog.name_vi} />
          <meta property='og:type' content='website' />
        </Helmet>
      )}

      <div className='px-2 md:container bg-white rounded shadow-sm my-2 lg:my-4 pb-12'>
        {/* Chi tiết blog */}
        {blog && !getBlogQuery.isLoading && (
          <div className='md:px-[80px] lg:px-[220px] my-2 md:py-4'>
            <img src={getImageUrl(blog.thumbnail)} alt={blog.name_vi} className='w-full object-contain rounded mb-4' />
            <h1 className='text-xl md:text-[28px] font-semibold mb-4 leading-normal'>{blog.name_vi}</h1>
            <div className='flex items-center mb-4'>
              <span className='flex items-center'>
                <ClockIcon className='w-4 h-4' />
                <span className='text-[#535353] ml-1 text-sm'>{moment(blog.created_at).format('DD.MM.YYYY')}</span>
              </span>
              <span className='w-1 h-1 rounded-full bg-[#535353] block mx-[10px]' />
              <span className='text-[#005EC9] text-sm'>{blog.author.fullname}</span>
            </div>
            <div className='text__content'>
              <div
                dangerouslySetInnerHTML={{
                  __html: DOMPurify.sanitize(blog.content_vi)
                }}
                className='text-base md:text-lg text-justify text-[#111111]'
              />
            </div>
          </div>
        )}

        {/* Danh sách blog khác */}
        {!!otherBlogs && otherBlogs.length > 0 && !getBlogsQuery.isLoading && (
          <div className='md:px-[40px] lg:px-[110px] mt-12'>
            <h2 className='text-lg md:text-2xl font-semibold uppercase md:mb-4 text-[#333333]'>Bài viết liên quan</h2>
            <div className='grid grid-cols-12 gap-2 md:gap-6'>
              {otherBlogs.map((blog) => (
                <div key={blog._id} className='col-span-6 md:col-span-4 mt-4 md:mt-0'>
                  <BlogVertical data={blog} />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Loading */}
        {(getBlogQuery.isLoading || getBlogsQuery.isLoading) && (
          <div className='min-h-[400px] flex justify-center items-center'>
            <Loading />
          </div>
        )}
      </div>
    </Fragment>
  );
};

export default BlogDetail;
