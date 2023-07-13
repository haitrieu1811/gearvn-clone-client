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
import { SearchIcon } from 'src/components/Icons';
import Modal from 'src/components/Modal';
import Table from 'src/components/Table';
import TableAction from 'src/components/Table/TableAction';
import PATH from 'src/constants/path';
import { AppContext } from 'src/contexts/app.context';
import UseQueryParams from 'src/hooks/useQueryParams';
import { GetCategoriesRequestParams } from 'src/types/category.type';
import { LIMIT_OPTIONS } from './constants';

type QueryConfig = {
  [key in keyof GetCategoriesRequestParams]: string;
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
    onSuccess: (data) => {
      toast.success(data.data.message);
      getCategoriesQuery.refetch();
      stopDelete();
    }
  });

  const categories = useMemo(
    () => getCategoriesQuery.data?.data.data.categories,
    [getCategoriesQuery.data?.data.data.categories]
  );
  const pageSize = useMemo(
    () => getCategoriesQuery.data?.data.data.pagination.page_size,
    [getCategoriesQuery.data?.data.data.pagination.page_size]
  );
  const isAllChecked = extendedCategories.every((category) => category.checked);
  const checkedCategories = useMemo(
    () => extendedCategories.filter((category) => category.checked),
    [extendedCategories]
  );

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

  const startDelete = (categoryId?: string) => {
    setModalVisible(true);
    categoryId && setCurrentId(categoryId);
  };

  const stopDelete = () => {
    setModalVisible(false);
    setCurrentId(null);
  };

  const handleDeleteOne = () => {
    currentId && deleteCategoryMutation.mutate([currentId]);
  };

  const handleDeleteMany = () => {
    const dataDelete = checkedCategories.map((category) => category._id);
    deleteCategoryMutation.mutate(dataDelete);
  };

  const handleChangeLimit = (selectValue: string) => {
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
          <span className='text-white text-sm font-medium'>Tạo mới</span>
        </Link>
      </div>

      <Table
        initialData={categories || []}
        checkedData={checkedCategories}
        columns={[1, 3, 3, 2, 2, 1]}
        head={[
          <Checkbox checked={isAllChecked} onChange={handleCheckAll} />,
          'Tên tiếng Việt',
          'Tên tiếng Anh',
          'Thời gian tạo',
          'Cập nhật',
          'Thao tác'
        ]}
        body={extendedCategories.map((item, index) => [
          <Checkbox checked={item.checked} onChange={handleCheck(index)} />,
          item.name_vi,
          item.name_en,
          moment(item.created_at).fromNow(),
          moment(item.updated_at).fromNow(),
          <TableAction
            editPath={`${PATH.DASHBOARD_CATEGORY_UPDATE_WITHOUT_ID}/${item._id}`}
            deleteMethod={() => startDelete(item._id)}
          />
        ])}
        selectLimit={{
          defaultValue: '10',
          handleChangeLimit,
          options: LIMIT_OPTIONS
        }}
        pagination={{
          pageSize: pageSize || 10
        }}
        startDelete={startDelete}
        isLoading={getCategoriesQuery.isLoading}
      />
      <Modal isVisible={modalVisible} onOk={currentId ? handleDeleteOne : handleDeleteMany} onCancel={stopDelete}>
        {currentId
          ? 'Bạn có chắc muốn xóa danh mục này'
          : `Bạn có chắc muốn xóa ${checkedCategories.length} danh mục này`}
      </Modal>
    </Fragment>
  );
};

export default List;
