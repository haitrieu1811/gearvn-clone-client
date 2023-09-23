import { produce } from 'immer';
import keyBy from 'lodash/keyBy';
import moment from 'moment';
import { ChangeEvent, Fragment, useContext, useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

import Checkbox from 'src/components/Checkbox';
import ContextMenu from 'src/components/ContextMenu';
import { PencilIcon, TrashIcon } from 'src/components/Icons';
import Modal from 'src/components/Modal';
import Table from 'src/components/Table';
import PATH from 'src/constants/path';
import { AppContext } from 'src/contexts/app.context';
import useCategory from 'src/hooks/useCategory';
import UseQueryParams from 'src/hooks/useQueryParams';
import { PaginationRequestParams } from 'src/types/utils.type';
import { convertMomentFromNowToVietnamese } from 'src/utils/utils';

type QueryConfig = {
  [key in keyof PaginationRequestParams]: string;
};

const List = () => {
  const navigate = useNavigate();
  const { extendedCategories, setExtendedCategories } = useContext(AppContext);
  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const [currentId, setCurrentId] = useState<string | null>(null);
  const queryParams: QueryConfig = UseQueryParams();
  const queryConfig: QueryConfig = {
    page: queryParams.page || '1',
    limit: queryParams.limit || '10'
  };
  const { categories, categoriesPageSize, getCategoriesQuery, deleteCategoryMutation } = useCategory(queryConfig);

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
          checked: !!extendedCategoriesObj[category._id]?.checked
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
    if (currentId) {
      deleteCategoryMutation.mutate([currentId], {
        onSuccess: (data) => {
          toast.success(data.data.message);
          getCategoriesQuery.refetch();
          stopDelete();
        }
      });
    } else {
      deleteCategoryMutation.mutate(
        checkedCategories.map((category) => category._id),
        {
          onSuccess: (data) => {
            toast.success(data.data.message);
            getCategoriesQuery.refetch();
            stopDelete();
          }
        }
      );
    }
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
            headerName: 'Tên tiếng Việt',
            width: 20
          },
          {
            field: 'nameEn',
            headerName: 'Tên tiếng Anh',
            width: 20
          },
          {
            field: 'authorName',
            headerName: 'Người tạo',
            width: 15
          },
          {
            field: 'productCount',
            headerName: 'Số sản phẩm',
            width: 15
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
        rows={extendedCategories.map((category, index) => ({
          checkbox: <Checkbox checked={category.checked} onChange={handleCheckOne(index)} />,
          nameVi: category.name_vi,
          nameEn: category.name_en,
          authorName: category.author.fullname,
          productCount: `${category.product_count} sản phẩm`,
          createdAt: convertMomentFromNowToVietnamese(moment(category.created_at).fromNow()),
          updatedAt: convertMomentFromNowToVietnamese(moment(category.updated_at).fromNow()),
          actions: (
            <ContextMenu
              items={[
                {
                  icon: <PencilIcon className='w-4 h-4 mr-3' />,
                  label: 'Cập nhật danh mục',
                  onClick: () => navigate(`${PATH.DASHBOARD_CATEGORY_UPDATE_WITHOUT_ID}/${category._id}`)
                },
                {
                  icon: <TrashIcon className='w-4 h-4 mr-3' />,
                  label: 'Xóa danh mục',
                  onClick: () => startDelete(category._id)
                }
              ]}
            />
          )
        }))}
        pageSize={categoriesPageSize}
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
