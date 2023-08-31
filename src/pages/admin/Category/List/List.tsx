import { useMutation, useQuery } from '@tanstack/react-query';
import { produce } from 'immer';
import isUndefined from 'lodash/isUndefined';
import keyBy from 'lodash/keyBy';
import omitBy from 'lodash/omitBy';
import moment from 'moment';
import { ChangeEvent, Fragment, useContext, useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';

import categoryApi from 'src/apis/category.api';
import Checkbox from 'src/components/Checkbox';
import { SearchIcon } from 'src/components/Icons';
import Modal from 'src/components/Modal';
import Table from 'src/components/Table';
import TableAction from 'src/components/Table/TableAction';
import PATH from 'src/constants/path';
import { AppContext } from 'src/contexts/app.context';
import UseQueryParams from 'src/hooks/useQueryParams';
import { GetCategoriesRequestParams } from 'src/types/category.type';

type QueryConfig = {
  [key in keyof GetCategoriesRequestParams]: string;
};

const List = () => {
  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const [currentId, setCurrentId] = useState<string | null>(null);
  const { extendedCategories, setExtendedCategories } = useContext(AppContext);
  const queryParams: QueryConfig = UseQueryParams();
  const queryConfig: QueryConfig = omitBy(
    {
      page: queryParams.page || '1',
      limit: queryParams.limit || '10'
    },
    isUndefined
  );

  // Lấy danh sách danh mục
  const getCategoriesQuery = useQuery({
    queryKey: ['categories', queryConfig],
    queryFn: () => categoryApi.getList(queryConfig),
    keepPreviousData: true
  });

  // Xóa danh mục
  const deleteCategoryMutation = useMutation({
    mutationFn: categoryApi.delete,
    onSuccess: (data) => {
      toast.success(data.data.message);
      getCategoriesQuery.refetch();
      stopDelete();
    }
  });

  // Danh sách danh mục
  const categories = useMemo(
    () => getCategoriesQuery.data?.data.data.categories,
    [getCategoriesQuery.data?.data.data.categories]
  );
  // Tổng số trang
  const pageSize = getCategoriesQuery.data?.data.data.pagination.page_size;
  // Kiểm tra tất cả danh mục đã được chọn hay chưa
  const isAllChecked = useMemo(() => extendedCategories.every((category) => category.checked), [extendedCategories]);
  // Danh sách danh mục đã chọn
  const checkedCategories = useMemo(
    () => extendedCategories.filter((category) => category.checked),
    [extendedCategories]
  );

  // Cập nhật danh sách danh mục
  useEffect(() => {
    if (categories) {
      setExtendedCategories((prevState) => {
        const extendedCategoriesObj = keyBy(prevState, '_id');
        return categories.map((category) => ({
          ...category,
          checked: Boolean(extendedCategoriesObj[category._id]?.checked)
        }));
      });
    }
  }, [categories]);

  // Bắt đầu xóa
  const startDelete = (categoryId?: string) => {
    setModalVisible(true);
    categoryId && setCurrentId(categoryId);
  };

  // Dừng xóa
  const stopDelete = () => {
    setModalVisible(false);
    setCurrentId(null);
  };

  // Xác nhận xóa
  const handleDelete = () => {
    if (currentId) deleteCategoryMutation.mutate([currentId]);
    else deleteCategoryMutation.mutate(checkedCategories.map((category) => category._id));
  };

  // Check 1 danh mục
  const handleCheckOne = (index: number) => (e: ChangeEvent<HTMLInputElement>) => {
    setExtendedCategories(
      produce((draft) => {
        draft[index].checked = e.target.checked;
      })
    );
  };

  // Check tất cả danh mục
  const handleCheckAll = () => {
    setExtendedCategories((prevState) =>
      prevState.map((category) => ({
        ...category,
        checked: !isAllChecked
      }))
    );
  };

  return (
    <Fragment>
      <div className='flex justify-between items-center mb-4 bg-white py-3 px-4 rounded-lg shadow-sm'>
        <div>
          <div className='relative'>
            <input
              type='text'
              placeholder='Tìm kiếm'
              className='border rounded py-[6px] px-3 text-sm outline-none w-[180px] pr-11 bg-slate-100'
            />
            <button className='absolute top-1/2 -translate-y-1/2 right-0 h-full w-10 flex justify-center items-center'>
              <SearchIcon className='w-4 h-4' />
            </button>
          </div>
        </div>
        <Link
          to={PATH.DASHBOARD_CATEGORY_CREATE}
          className='px-2 py-[6px] rounded bg-blue-600 flex justify-center items-center'
        >
          <span className='text-white text-sm font-medium'>Tạo mới</span>
        </Link>
      </div>

      <Table
        data={extendedCategories}
        columns={[
          {
            field: 'checkbox',
            headerName: <Checkbox checked={isAllChecked} onChange={handleCheckAll} />,
            width: 5
          },
          {
            field: 'nameVi',
            headerName: 'Danh mục',
            width: 30
          },
          {
            field: 'createdAt',
            headerName: 'Thời gian tạo',
            width: 25
          },
          {
            field: 'updatedAt',
            headerName: 'Cập nhật',
            width: 25
          },
          {
            field: 'actions',
            headerName: 'Thao tác',
            width: 15
          }
        ]}
        rows={extendedCategories.map((category, index) => ({
          checkbox: <Checkbox checked={category.checked} onChange={handleCheckOne(index)} />,
          nameVi: category.name_vi,
          nameEn: category.name_en,
          createdAt: moment(category.created_at).fromNow(),
          updatedAt: moment(category.updated_at).fromNow(),
          actions: (
            <TableAction
              editPath={`${PATH.DASHBOARD_CATEGORY_UPDATE_WITHOUT_ID}/${category._id}`}
              deleteMethod={() => startDelete(category._id)}
            />
          )
        }))}
        pageSize={pageSize || 0}
        tableFootLeft={
          checkedCategories.length > 0 && (
            <button
              className='font-medium text-sm text-white bg-red-600/90 rounded py-1 px-4 mr-4 hover:bg-red-600'
              onClick={() => startDelete()}
            >
              Xóa {checkedCategories.length} mục đã chọn
            </button>
          )
        }
        isLoading={getCategoriesQuery.isLoading}
      />
      <Modal isVisible={modalVisible} onOk={handleDelete} onCancel={stopDelete}>
        {currentId
          ? 'Bạn có chắc muốn xóa danh mục này'
          : `Bạn có chắc muốn xóa ${checkedCategories.length} danh mục này`}
      </Modal>
    </Fragment>
  );
};

export default List;
