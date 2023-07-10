import { useMutation, useQuery } from '@tanstack/react-query';
import { produce } from 'immer';
import isUndefined from 'lodash/isUndefined';
import omitBy from 'lodash/omitBy';
import moment from 'moment';
import { ChangeEvent, Fragment, useContext, useEffect, useMemo, useState } from 'react';
import { Link, createSearchParams, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

import categoryApi from 'src/apis/category.api';
import Checkbox from 'src/components/Checkbox';
import { PencilIcon, PlusIcon, TrashIcon } from 'src/components/Icons';
import Modal from 'src/components/Modal';
import Pagination from 'src/components/Pagination';
import Select from 'src/components/Select';
import PATH from 'src/constants/path';
import { AppContext } from 'src/contexts/app.context';
import UseQueryParams from 'src/hooks/useQueryParams';
import { GetCategoriesParams } from 'src/types/category.type';
import { LIMIT_OPTIONS } from './constants';

type QueryConfig = {
  [key in keyof GetCategoriesParams]: string;
};

const List = () => {
  const navigate = useNavigate();
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

  const getCategoriesQuery = useQuery({
    queryKey: ['categories', queryConfig],
    queryFn: () => categoryApi.getList(queryConfig),
    keepPreviousData: true
  });

  const deleteCategoryMutation = useMutation({
    mutationFn: categoryApi.delete,
    onSuccess: () => {
      toast.success('Xóa danh mục thành công');
      getCategoriesQuery.refetch();
      stopDelete();
    }
  });

  const categories = useMemo(() => getCategoriesQuery.data?.data.data.categories, [getCategoriesQuery.data?.data.data]);
  const pageSize = useMemo(
    () => getCategoriesQuery.data?.data.data.pagination.page_size,
    [getCategoriesQuery.data?.data.data.pagination.page_size]
  );
  const isAllChecked = useMemo(() => extendedCategories.every((category) => category.checked), [extendedCategories]);
  const checkedCategories = useMemo(
    () => extendedCategories.filter((category) => category.checked),
    [extendedCategories]
  );

  useEffect(() => {
    if (categories) {
      setExtendedCategories((prevState) => {
        return categories.map((category) => {
          return {
            ...category,
            checked: false
          };
        });
      });
    }
  }, [categories]);

  const startDelete = (categoryId: string) => {
    setModalVisible(true);
    setCurrentId(categoryId);
  };

  const stopDelete = () => {
    setModalVisible(false);
    setCurrentId(null);
  };

  const handleDelete = () => {
    if (currentId) {
      deleteCategoryMutation.mutate(currentId);
    }
  };

  const handleChangeLimit = (selectValue: string | number) => {
    navigate({
      pathname: PATH.DASHBOARD_CATEGORY,
      search: createSearchParams({
        ...queryConfig,
        limit: selectValue.toString(),
        page: '1'
      }).toString()
    });
  };

  const handleCheck = (index: number) => (e: ChangeEvent<HTMLInputElement>) => {
    setExtendedCategories(
      produce((draft) => {
        draft[index].checked = e.target.checked;
      })
    );
  };

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
      <div className='flex justify-between items-center mb-6 bg-white p-4 rounded-lg shadow-sm'>
        <div>
          <Select
            label='Bản ghi mỗi trang'
            options={LIMIT_OPTIONS}
            defaultValue={queryConfig.limit}
            onChange={handleChangeLimit}
          />
        </div>
        <div>
          <Link
            to={PATH.DASHBOARD_CATEGORY_CREATE}
            className='p-2 rounded bg-blue-600 flex justify-center items-center'
          >
            <PlusIcon className='w-4 h-4 stroke-white mr-2' />
            <span className='text-white text-sm font-medium'>Tạo mới</span>
          </Link>
        </div>
      </div>
      {categories && categories.length > 0 ? (
        <div className='bg-white rounded-lg shadow-sm'>
          {/* Head */}
          <div className='grid grid-cols-12 font-semibold py-5 px-8 border-b text-sm'>
            <div className='col-span-1'>
              <Checkbox checked={isAllChecked} onChange={handleCheckAll} />
            </div>
            <div className='col-span-3'>Tên tiếng Việt</div>
            <div className='col-span-3'>Tên tiếng Anh</div>
            <div className='col-span-2'>Thời gian tạo</div>
            <div className='col-span-2'>Cập nhật</div>
            <div className='col-span-1'>Thao tác</div>
          </div>
          {extendedCategories?.map((category, index) => (
            <div
              key={category._id}
              className='grid grid-cols-12 py-4 px-8 border-b border-b-slate-100 text-slate-500 text-sm'
            >
              <div className='col-span-1 flex items-center'>
                <Checkbox checked={category.checked} onChange={handleCheck(index)} />
              </div>
              <div className='col-span-3 flex items-center capitalize'>{category.name_vi}</div>
              <div className='col-span-3 flex items-center capitalize'>{category.name_en}</div>
              <div className='col-span-2 flex items-center'>{moment(category.created_at).fromNow()}</div>
              <div className='col-span-2 flex items-center'>{moment(category.updated_at).fromNow()}</div>
              <div className='col-span-1 flex items-center'>
                <Link
                  to={`${PATH.DASHBOARD_CATEGORY_UPDATE_WITHOUT_ID}/${category._id}`}
                  className='rounded hover:bg-slate-200/50 p-2'
                >
                  <PencilIcon className='w-4 h-4 stroke-slate-500' />
                </Link>
                <button className='rounded hover:bg-slate-200/50 p-2 ml-1' onClick={() => startDelete(category._id)}>
                  <TrashIcon className='w-4 h-4 stroke-slate-500' />
                </button>
              </div>
            </div>
          ))}
          <div className='sticky bottom-0 bg-white py-5 px-10 flex justify-between items-center border-t'>
            <div>
              <button className='font-medium' onClick={handleCheckAll}>
                Chọn tất cả
              </button>
              {isAllChecked && <button className='font-medium ml-5'>Xóa</button>}
            </div>
            <Pagination pageSize={pageSize as number} queryConfig={queryConfig} path={PATH.DASHBOARD_CATEGORY} />
          </div>
          <Modal isVisible={modalVisible} onOk={handleDelete} onCancel={stopDelete}>
            Bạn có chắc muốn xóa danh mục này
          </Modal>
        </div>
      ) : (
        <div>Chưa có bản ghi nào</div>
      )}
    </Fragment>
  );
};

export default List;
