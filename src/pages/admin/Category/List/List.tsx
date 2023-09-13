import { useMutation, useQuery } from '@tanstack/react-query';
import { produce } from 'immer';
import isUndefined from 'lodash/isUndefined';
import keyBy from 'lodash/keyBy';
import omitBy from 'lodash/omitBy';
import moment from 'moment';
import { ChangeEvent, Fragment, useContext, useEffect, useMemo, useState } from 'react';
import { toast } from 'react-toastify';

import categoryApi from 'src/apis/category.api';
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

  // Query: Lấy danh sách danh mục
  const getCategoriesQuery = useQuery({
    queryKey: ['categories', queryConfig],
    queryFn: () => categoryApi.getList(queryConfig),
    keepPreviousData: true
  });

  // Mutation: Xóa danh mục
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
      <Table
        tableName='Danh sách danh mục'
        totalRows={getCategoriesQuery.data?.data.data.pagination.total || 0}
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
          createdAt: convertMomentFromNowToVietnamese(moment(category.created_at).fromNow()),
          updatedAt: convertMomentFromNowToVietnamese(moment(category.updated_at).fromNow()),
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
        addNewPath={PATH.DASHBOARD_CATEGORY_CREATE}
      />
      <Modal name='Xác nhận xóa danh mục sản phẩm' isVisible={modalVisible} onOk={handleDelete} onCancel={stopDelete}>
        <div className='text-center leading-loose'>
          <div>
            {currentId
              ? 'Bạn có chắc muốn xóa danh mục sản phẩm này ?'
              : `Bạn có chắc muốn xóa ${checkedCategories.length} danh mục sản phẩm đã chọn ?`}
          </div>
          <div className='font-medium text-red-500 underline'>
            Danh mục sản phẩm và các sản phẩm thuộc danh mục này <br /> sẽ bị xóa vĩnh viễn và không thể khôi phục.
          </div>
        </div>
      </Modal>
    </Fragment>
  );
};

export default List;
