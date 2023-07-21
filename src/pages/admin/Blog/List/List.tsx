import { useMutation, useQuery } from '@tanstack/react-query';
import { produce } from 'immer';
import isUndefined from 'lodash/isUndefined';
import keyBy from 'lodash/keyBy';
import omitBy from 'lodash/omitBy';
import moment from 'moment';
import { ChangeEvent, Fragment, useContext, useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';

import blogApi from 'src/apis/blog.api';
import Checkbox from 'src/components/Checkbox';
import Modal from 'src/components/Modal';
import Table from 'src/components/Table';
import TableAction from 'src/components/Table/TableAction';
import PATH from 'src/constants/path';
import { AppContext } from 'src/contexts/app.context';
import UseQueryParams from 'src/hooks/useQueryParams';
import { GetBlogListRequestQuery } from 'src/types/blog.type';

type QueryConfig = {
  [key in keyof GetBlogListRequestQuery]: string;
};

const List = () => {
  const queryParams: QueryConfig = UseQueryParams();
  const queryConfig: QueryConfig = omitBy(
    {
      page: queryParams.page || 1,
      limit: queryParams.limit || 10
    },
    isUndefined
  );

  const { extendedBlogs, setExtendedBlogs } = useContext(AppContext);
  const [currentId, setCurrentId] = useState<string | null>(null);
  const [modalOpen, setModalOpen] = useState<boolean>(false);

  // Lấy danh sách các blog
  const getBlogsQuery = useQuery({
    queryKey: ['products', queryConfig],
    queryFn: () => blogApi.getList(queryConfig)
  });

  const blogs = useMemo(() => getBlogsQuery.data?.data.data.blogs, [getBlogsQuery.data?.data.data.blogs]);
  const checkedBlogs = useMemo(() => extendedBlogs?.filter((blog) => blog.checked), [extendedBlogs]);
  const isAllChecked = useMemo(() => extendedBlogs.every((blog) => blog.checked), [extendedBlogs]);
  const pageSize = useMemo(
    () => getBlogsQuery.data?.data.data.pagination.page_size,
    [getBlogsQuery.data?.data.data.pagination.page_size]
  );

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

  // Check một item
  const handleCheck = (blogIndex: number) => (e: ChangeEvent<HTMLInputElement>) => {
    setExtendedBlogs(
      produce((draft) => {
        draft[blogIndex].checked = e.target.checked;
      })
    );
  };

  // Check tất cả item
  const handleCheckAll = () => {
    setExtendedBlogs((prevState) =>
      prevState.map((blog) => ({
        ...blog,
        checked: !isAllChecked
      }))
    );
  };

  const startDelete = (blogId?: string) => {
    setModalOpen(true);
    blogId && setCurrentId(blogId);
  };

  const stopDelete = () => {
    setModalOpen(false);
    currentId && setCurrentId(null);
  };

  const deleteBlogMutation = useMutation({
    mutationFn: blogApi.delete,
    onSuccess: (data) => {
      toast.success(data.data.message);
      stopDelete();
      getBlogsQuery.refetch();
    }
  });

  const handleDelete = () => {
    let deleteIds: string[];
    if (currentId) deleteIds = [currentId];
    else deleteIds = [...checkedBlogs.map((blog) => blog._id)];
    deleteBlogMutation.mutate(deleteIds);
  };

  return (
    <Fragment>
      <div>
        <div className='flex justify-between items-center mb-4 bg-white py-3 px-4 rounded-lg shadow-sm'>
          <div></div>
          <Link
            to={PATH.DASHBOARD_BLOG_CREATE}
            className='px-2 py-[6px] rounded bg-blue-600 flex justify-center items-center'
          >
            <span className='text-white text-sm font-medium'>Tạo mới</span>
          </Link>
        </div>
      </div>
      <Table
        initialData={blogs || []}
        checkedData={checkedBlogs}
        columns={[1, 5, 2, 2, 2]}
        head={[
          <Checkbox checked={isAllChecked} onChange={handleCheckAll} />,
          'Tên bài viết',
          'Tạo lúc',
          'Cập nhật',
          'Thao tác'
        ]}
        body={extendedBlogs.map((blog, index) => [
          <Checkbox checked={blog.checked} onChange={handleCheck(index)} />,
          blog.name_vi,
          moment(blog.created_at).fromNow(),
          moment(blog.updated_at).fromNow(),
          <TableAction
            editPath={`${PATH.DASHBOARD_BLOG_UPDATE_WITHOUT_ID}/${blog._id}`}
            deleteMethod={() => startDelete(blog._id)}
          />
        ])}
        pagination={{
          pageSize: pageSize || 0
        }}
        startDelete={startDelete}
        isLoading={getBlogsQuery.isLoading}
      />
      <Modal isVisible={modalOpen} onCancel={stopDelete} onOk={handleDelete}>
        {currentId
          ? 'Bạn có chắc muốn xóa sản phẩm này'
          : `Bạn có chắc muốn xóa ${checkedBlogs.length} bài viết đã chọn`}
      </Modal>
    </Fragment>
  );
};

export default List;
