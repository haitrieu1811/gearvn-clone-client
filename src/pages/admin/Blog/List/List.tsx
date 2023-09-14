import { useMutation, useQuery } from '@tanstack/react-query';
import { produce } from 'immer';
import isUndefined from 'lodash/isUndefined';
import keyBy from 'lodash/keyBy';
import omitBy from 'lodash/omitBy';
import moment from 'moment';
import { ChangeEvent, Fragment, useContext, useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

import blogApi from 'src/apis/blog.api';
import Checkbox from 'src/components/Checkbox';
import ContextMenu from 'src/components/ContextMenu';
import { PencilIcon, TrashIcon } from 'src/components/Icons';
import Modal from 'src/components/Modal';
import Table from 'src/components/Table';
import PATH from 'src/constants/path';
import { AppContext } from 'src/contexts/app.context';
import UseQueryParams from 'src/hooks/useQueryParams';
import { PaginationRequestParams } from 'src/types/utils.type';
import { convertMomentFromNowToVietnamese } from 'src/utils/utils';

type QueryConfig = {
  [key in keyof PaginationRequestParams]: string;
};

const List = () => {
  const navigate = useNavigate();
  const { extendedBlogs, setExtendedBlogs } = useContext(AppContext);
  const [currentId, setCurrentId] = useState<string | null>(null);
  const [modalOpen, setModalOpen] = useState<boolean>(false);
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

  // Danh sách các blog đã được thêm thuộc tính checked
  const checkedBlogs = useMemo(() => extendedBlogs?.filter((blog) => blog.checked), [extendedBlogs]);

  // Kiểm tra tất cả các blog đã được check hay chưa
  const isAllChecked = useMemo(() => extendedBlogs.every((blog) => blog.checked), [extendedBlogs]);

  // Tổng số trang của bảng
  const pageSize = useMemo(
    () => getBlogsQuery.data?.data.data.pagination.page_size || 0,
    [getBlogsQuery.data?.data.data.pagination.page_size]
  );

  // Tổng số bản ghi của bảng
  const total = useMemo(
    () => getBlogsQuery.data?.data.data.pagination.total,
    [getBlogsQuery.data?.data.data.pagination.total]
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

  // Bắt đầu xóa
  const startDelete = (blogId?: string) => {
    setModalOpen(true);
    blogId && setCurrentId(blogId);
  };

  // Dừng xóa
  const stopDelete = () => {
    setModalOpen(false);
    currentId && setCurrentId(null);
  };

  // Mutation: Xóa blog
  const deleteBlogMutation = useMutation({
    mutationFn: blogApi.delete,
    onSuccess: (data) => {
      toast.success(data.data.message);
      stopDelete();
      getBlogsQuery.refetch();
    }
  });

  // Xử lý xóa blog
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
        ]}
        rows={extendedBlogs.map((blog, index) => ({
          checkbox: <Checkbox checked={blog.checked} onChange={handleCheck(index)} />,
          blogName: blog.name_vi,
          createdAt: convertMomentFromNowToVietnamese(moment(blog.created_at).fromNow()),
          updatedAt: convertMomentFromNowToVietnamese(moment(blog.updated_at).fromNow()),
          actions: (
            <ContextMenu
              items={[
                {
                  icon: <PencilIcon className='w-4 h-4 mr-3' />,
                  label: 'Cập nhật blog',
                  onClick: () => {
                    navigate(`${PATH.DASHBOARD_BLOG_UPDATE_WITHOUT_ID}/${blog._id}`);
                  }
                },
                {
                  icon: <TrashIcon className='w-4 h-4 mr-3' />,
                  label: 'Xóa blog',
                  onClick: () => startDelete(blog._id)
                }
              ]}
            />
          )
        }))}
        pageSize={pageSize}
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
