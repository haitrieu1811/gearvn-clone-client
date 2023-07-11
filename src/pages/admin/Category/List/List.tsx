import { useMutation, useQuery } from '@tanstack/react-query';
import { produce } from 'immer';
import isUndefined from 'lodash/isUndefined';
import keyBy from 'lodash/keyBy';
import omitBy from 'lodash/omitBy';
import moment from 'moment';
import { ChangeEvent, Fragment, useContext, useEffect, useMemo, useState } from 'react';
import { Link, createSearchParams, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

import categoryApi from 'src/apis/category.api';
import Checkbox from 'src/components/Checkbox';
import { PlusIcon, SearchIcon } from 'src/components/Icons';
import Modal from 'src/components/Modal';
import Pagination from 'src/components/Pagination';
import Select from 'src/components/Select';
import CLASSES from 'src/constants/classes';
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
        const extendedCategoriesObj = keyBy(prevState, '_id');
        return categories.map((category) => {
          return {
            ...category,
            checked: Boolean(extendedCategoriesObj[category._id]?.checked)
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
          <PlusIcon className='w-4 h-4 stroke-white mr-2' />
          <span className='text-white text-sm font-medium'>Tạo mới</span>
        </Link>
      </div>
      {categories && categories.length > 0 ? (
        <div className='bg-white rounded-lg shadow-sm'>
          {/* Head */}
          <div className={CLASSES.TABLE_HEAD}>
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
            <div key={category._id} className={CLASSES.TABLE_BODY}>
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
                  className='font-medium text-sm text-blue-400'
                >
                  Sửa
                </Link>
                <div className='w-[1px] h-4 bg-slate-200 mx-2'></div>
                <button className='font-medium text-sm text-red-500' onClick={() => startDelete(category._id)}>
                  Xóa
                </button>
              </div>
            </div>
          ))}
          <div className={CLASSES.TABLE_FOOT}>
            <div>
              {checkedCategories && checkedCategories.length > 0 && (
                <button className='font-medium text-sm'>Xóa {checkedCategories.length} mục đã chọn</button>
              )}
            </div>
            <div className='flex items-center'>
              <Select
                label='Danh mục mỗi trang'
                options={LIMIT_OPTIONS}
                defaultValue={queryConfig.limit}
                onChange={handleChangeLimit}
                classNameWrapper='mr-2'
              />
              <Pagination pageSize={pageSize as number} queryConfig={queryConfig} path={PATH.DASHBOARD_CATEGORY} />
            </div>
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
