import { useQuery } from '@tanstack/react-query';
import DOMPurify from 'dompurify';
import moment from 'moment';
import { useMemo } from 'react';
import { useParams } from 'react-router-dom';

import blogApi from 'src/apis/blog.api';
import BlogVertical from 'src/components/BlogVertical';
import { ClockIcon } from 'src/components/Icons';
import Loading from 'src/components/Loading';
import { getIdFromNameId, getImageUrl } from 'src/utils/utils';

const BlogDetail = () => {
  const { name_id } = useParams();
  const blogId = getIdFromNameId(name_id as string);

  // Chi tiết blog
  const getBlogQuery = useQuery({
    queryKey: ['blog', blogId],
    queryFn: () => blogApi.getDetail(blogId),
    enabled: Boolean(blogId)
  });

  // Danh sách blog khác
  const getBlogsQuery = useQuery({
    queryKey: ['blogs'],
    queryFn: () => blogApi.getList({ limit: '6' })
  });

  const blog = useMemo(() => getBlogQuery.data?.data.data.blog, [getBlogQuery.data?.data.data.blog]);
  const orderBlogs = useMemo(() => getBlogsQuery.data?.data.data.blogs, [getBlogsQuery.data?.data.data.blogs]);

  return (
    <div className='px-2 md:container bg-white rounded shadow-sm my-2 lg:my-4 pb-12'>
      {/* Chi tiết blog */}
      {blog && (
        <div className='md:px-[80px] lg:px-[220px] my-2 md:py-4'>
          <img src={getImageUrl(blog.thumbnail)} alt={blog.name_vi} className='w-full object-contain rounded mb-4' />
          <h1 className='text-[28px] font-semibold mb-4'>{blog.name_vi}</h1>
          <div className='flex items-center mb-4'>
            <span className='flex items-center'>
              <ClockIcon className='w-4 h-4' />
              <span className='text-[#535353] ml-1 text-sm'>{moment(blog.created_at).format('kk:mm, DD.MM.YYYY')}</span>
            </span>
            <span className='w-1 h-1 rounded-full bg-[#535353] block mx-[10px]' />
            <span className='text-[#005EC9] text-sm'>Lê Thị Mỹ Duyên</span>
          </div>
          <div className='text__content'>
            <div
              dangerouslySetInnerHTML={{
                __html: DOMPurify.sanitize(blog.content_vi)
              }}
              className='text-lg text-justify text-[#111111]'
            />
          </div>
        </div>
      )}

      {/* Danh sách blog khác */}
      {orderBlogs && orderBlogs.length > 0 && (
        <div className='md:px-[40px] lg:px-[110px] mt-4 md:mt-12'>
          <h2 className='text-2xl font-semibold uppercase md:mb-4 text-[#333333]'>Bài viết liên quan</h2>
          <div className='grid grid-cols-12 gap-2 md:gap-6'>
            {orderBlogs.map((blog) => (
              <div key={blog._id} className='col-span-6 md:col-span-4 mt-4 md:mt-0'>
                <BlogVertical data={blog} />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Loading */}
      {getBlogQuery.isLoading && getBlogsQuery.isLoading && (
        <div className='flex justify-center py-[200px]'>
          <Loading className='w-12 h-12' />
        </div>
      )}
    </div>
  );
};

export default BlogDetail;
