import { useMutation, useQuery } from '@tanstack/react-query';
import { produce } from 'immer';
import isUndefined from 'lodash/isUndefined';
import keyBy from 'lodash/keyBy';
import omitBy from 'lodash/omitBy';
import moment from 'moment';
import { ChangeEvent, Fragment, useContext, useEffect, useMemo, useState } from 'react';
import { toast } from 'react-toastify';

import blogApi from 'src/apis/blog.api';
import Checkbox from 'src/components/Checkbox';
import Modal from 'src/components/Modal';
import Table from 'src/components/Table';
import TableAction from 'src/components/Table/TableAction';
import PATH from 'src/constants/path';
import { AppContext } from 'src/contexts/app.context';
import UseQueryParams from 'src/hooks/useQueryParams';
import { PaginationRequestParams } from 'src/types/utils.type';
import { convertMomentFromNowToVietnamese } from 'src/utils/utils';

type QueryConfig = {
  [key in keyof PaginationRequestParams]: string;
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
    queryFn: () => blogApi.getList(queryConfig),
    keepPreviousData: true
  });

  const blogs = useMemo(() => getBlogsQuery.data?.data.data.blogs, [getBlogsQuery.data?.data.data.blogs]);
  const checkedBlogs = useMemo(() => extendedBlogs?.filter((blog) => blog.checked), [extendedBlogs]);
  const isAllChecked = useMemo(() => extendedBlogs.every((blog) => blog.checked), [extendedBlogs]);
  const pageSize = useMemo(
    () => getBlogsQuery.data?.data.data.pagination.page_size,
    [getBlogsQuery.data?.data.data.pagination.page_size]
  );
  const total = useMemo(
    () => getBlogsQuery.data?.data.data.pagination.total,
    [getBlogsQuery.data?.data.data.pagination.total]
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
      <Table
        tableName='Danh sách blog'
        data={extendedBlogs}
        totalRows={total || 0}
        columns={[
          {
            field: 'checkbox',
            headerName: <Checkbox checked={isAllChecked} onChange={handleCheckAll} />,
            width: 5
          },
          {
            field: 'blogName',
            headerName: 'Tên bài viết',
            width: 65
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
            headerName: 'Thao tác',
            width: 10
          }
        ]}
        rows={extendedBlogs.map((blog, index) => ({
          checkbox: <Checkbox checked={blog.checked} onChange={handleCheck(index)} />,
          blogName: blog.name_vi,
          createdAt: convertMomentFromNowToVietnamese(moment(blog.created_at).fromNow()),
          updatedAt: convertMomentFromNowToVietnamese(moment(blog.updated_at).fromNow()),
          actions: (
            <TableAction
              editPath={`${PATH.DASHBOARD_BLOG_UPDATE_WITHOUT_ID}/${blog._id}`}
              deleteMethod={() => startDelete(blog._id)}
            />
          )
        }))}
        pageSize={pageSize || 0}
        isLoading={getBlogsQuery.isLoading}
        addNewPath={PATH.DASHBOARD_BLOG_CREATE}
        tableFootLeft={
          <Fragment>
            {checkedBlogs.length > 0 && (
              <button
                className='font-medium text-sm text-white bg-red-600/90 rounded py-1 px-4 mr-4 hover:bg-red-600'
                onClick={() => startDelete()}
              >
                Xóa {checkedBlogs.length} mục đã chọn
              </button>
            )}
          </Fragment>
        }
      />
      <Modal name='Xác nhận xóa blog' isVisible={modalOpen} onCancel={stopDelete} onOk={handleDelete}>
        <div className='text-center leading-loose'>
          <div>
            {currentId
              ? 'Bạn có chắc muốn xóa blog này ?'
              : `Bạn có chắc muốn xóa ${checkedBlogs.length} blog đã chọn ?`}
          </div>
          <div className='font-medium text-red-500 underline'>Blog sẽ bị xóa vĩnh viễn và không thể khôi phục.</div>
        </div>
      </Modal>
    </Fragment>
  );
};

export default List;
