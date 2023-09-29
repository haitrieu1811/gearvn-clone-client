import { useMutation, useQuery } from '@tanstack/react-query';
import isUndefined from 'lodash/isUndefined';
import keyBy from 'lodash/keyBy';
import omitBy from 'lodash/omitBy';
import moment from 'moment';
import { useContext, useEffect, useMemo } from 'react';
import { toast } from 'react-toastify';

import blogApi from 'src/apis/blog.api';
import Table from 'src/components/Table';
import PATH from 'src/constants/path';
import { AppContext } from 'src/contexts/app.context';
import UseQueryParams from 'src/hooks/useQueryParams';
import { PaginationRequestParams } from 'src/types/utils.type';
import { convertMomentFromNowToVietnamese } from 'src/utils/utils';

type QueryConfig = {
  [key in keyof PaginationRequestParams]: string;
};

const BlogList = () => {
  const { extendedBlogs, setExtendedBlogs } = useContext(AppContext);
  const queryParams: QueryConfig = UseQueryParams();
  const queryConfig: QueryConfig = omitBy(
    {
      page: queryParams.page || 1,
      limit: queryParams.limit || 10
    },
    isUndefined
  );

  // Query: Lấy danh sách các blog
  const getBlogsQuery = useQuery({
    queryKey: ['products', queryConfig],
    queryFn: () => blogApi.getList(queryConfig),
    keepPreviousData: true
  });

  // Danh sách các blog
  const blogs = useMemo(() => getBlogsQuery.data?.data.data.blogs, [getBlogsQuery.data?.data.data.blogs]);

  // Tổng số trang của bảng
  const pageSize = useMemo(
    () => getBlogsQuery.data?.data.data.pagination.page_size || 0,
    [getBlogsQuery.data?.data.data.pagination.page_size]
  );

  // Set giá trị cho extendedBlogs
  useEffect(() => {
    if (blogs) {
      setExtendedBlogs((prevState) => {
        const extendedBlogsObj = keyBy(prevState, '_id');
        return blogs.map((blog) => ({
          ...blog,
          checked: Boolean(extendedBlogsObj[blog._id]?.checked)
        }));
      });
    }
  }, [blogs]);

  // Mutation: Xóa blog
  const deleteBlogMutation = useMutation({
    mutationFn: blogApi.delete,
    onSuccess: (data) => {
      toast.success(data.data.message);
      getBlogsQuery.refetch();
    }
  });

  // Cột của bảng
  const columns = useMemo(
    () => [
      {
        field: 'blogName',
        headerName: 'Tên bài viết',
        width: 70
      },
      {
        field: 'createdAt',
        headerName: 'Tạo lúc',
        width: 10
      },
      {
        field: 'updatedAt',
        headerName: 'Cập nhật',
        width: 10
      },
      {
        field: 'actions',
        headerName: '',
        width: 5
      }
    ],
    []
  );

  // Dữ liệu của bảng
  const dataSource = useMemo(() => {
    return extendedBlogs.map((blog) => ({
      _id: blog._id,
      checked: blog.checked,
      blogName: blog.name_vi,
      createdAt: convertMomentFromNowToVietnamese(moment(blog.created_at).fromNow()),
      updatedAt: convertMomentFromNowToVietnamese(moment(blog.updated_at).fromNow())
    }));
  }, [extendedBlogs]);

  return (
    <Table
      data={extendedBlogs}
      setData={setExtendedBlogs}
      columns={columns}
      dataSource={dataSource}
      pageSize={pageSize}
      isLoading={getBlogsQuery.isLoading}
      updateItemPath={PATH.DASHBOARD_BLOG_UPDATE_WITHOUT_ID}
      onDelete={(blogIds) => deleteBlogMutation.mutate(blogIds)}
    />
  );
};

export default BlogList;
