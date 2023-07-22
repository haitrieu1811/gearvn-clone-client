import { useQuery } from '@tanstack/react-query';
import DOMPurify from 'dompurify';
import { Fragment, useMemo } from 'react';
import { useParams } from 'react-router-dom';

import blogApi from 'src/apis/blog.api';
import { ClockIcon } from 'src/components/Icons';
import { getIdFromNameId, getImageUrl } from 'src/utils/utils';

const BlogDetail = () => {
  const { name_id } = useParams();
  const blogId = getIdFromNameId(name_id as string);

  const getBlogQuery = useQuery({
    queryKey: ['blog', blogId],
    queryFn: () => blogApi.getDetail(blogId),
    enabled: Boolean(blogId)
  });

  const blog = useMemo(() => getBlogQuery.data?.data.data.blog, [getBlogQuery.data?.data.data.blog]);

  return (
    <Fragment>
      {blog && (
        <div className='container bg-white rounded shadow-sm my-3'>
          <div className='px-[220px] py-4'>
            <img src={getImageUrl(blog.thumbnail)} alt={blog.name_vi} className='w-full object-contain rounded mb-4' />
            <h1 className='text-[28px] font-medium mb-4'>{blog.name_vi}</h1>
            <div className='flex items-center text-sm mb-4'>
              <span className='flex items-center'>
                <ClockIcon className='w-4 h-4' />
                <span className='text-slate-500 ml-1'>Thứ Năm 22,06,2023</span>
              </span>
              <span className='w-1 h-1 rounded-full bg-slate-500 block mx-2' />
              <span className='text-blue-600'>Lê Thị Mỹ Duyên</span>
            </div>
            <div
              dangerouslySetInnerHTML={{
                __html: DOMPurify.sanitize(blog.content_vi)
              }}
              className='leading-loose text-[17px] text-justify'
            />
          </div>
        </div>
      )}
    </Fragment>
  );
};

export default BlogDetail;
