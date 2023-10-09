import { useMutation, useQuery } from '@tanstack/react-query';
import keyBy from 'lodash/keyBy';
import moment from 'moment';
import { useContext, useEffect, useMemo } from 'react';

import categoryApi from 'src/apis/category.api';
import Table from 'src/components/Table';
import PATH from 'src/constants/path';
import { AppContext } from 'src/contexts/app.context';
import useQueryParams from 'src/hooks/useQueryParams';
import { PaginationRequestParams } from 'src/types/utils.type';
import { convertMomentFromNowToVietnamese } from 'src/utils/utils';

type QueryConfig = {
  [key in keyof PaginationRequestParams]: string;
};

const CategoryList = () => {
  const { extendedCategories, setExtendedCategories } = useContext(AppContext);
  const queryParams: QueryConfig = useQueryParams();
  const queryConfig: QueryConfig = {
    page: queryParams.page || '1',
    limit: queryParams.limit || '10'
  };

  // Query: Lấy danh sách danh mục
  const getCategoriesQuery = useQuery({
    queryKey: ['categories', queryConfig],
    queryFn: () => categoryApi.getList(queryConfig)
  });

  // Mutation: Xóa danh mục
  const deleteCategoryMutation = useMutation(categoryApi.delete);

  // Danh sách danh mục
  const categories = useMemo(
    () => getCategoriesQuery.data?.data.data.categories || [],
    [getCategoriesQuery.data?.data.data.categories]
  );

  // Tổng số trang
  const categoriesPageSize = getCategoriesQuery.data?.data.data.pagination.page_size || 0;

  // Cập nhật danh sách danh mục
  useEffect(() => {
    if (!categories) return;
    setExtendedCategories((prevState) => {
      const extendedCategoriesObj = keyBy(prevState, '_id');
      return categories.map((category) => ({
        ...category,
        checked: !!extendedCategoriesObj[category._id]?.checked
      }));
    });
  }, [categories]);

  // Cột của bảng
  const columns = useMemo(
    () => [
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
      }
    ],
    []
  );

  // Dữ liệu của bảng
  const dataSource = useMemo(() => {
    return extendedCategories.map((category) => ({
      _id: category._id,
      checked: category.checked,
      nameVi: category.name_vi,
      nameEn: category.name_en,
      authorName: category.author.fullname,
      productCount: `${category.product_count} sản phẩm`,
      createdAt: convertMomentFromNowToVietnamese(moment(category.created_at).fromNow()),
      updatedAt: convertMomentFromNowToVietnamese(moment(category.updated_at).fromNow())
    }));
  }, [extendedCategories]);

  return (
    <Table
      data={extendedCategories}
      setData={setExtendedCategories}
      columns={columns}
      dataSource={dataSource}
      pageSize={categoriesPageSize}
      isLoading={getCategoriesQuery.isLoading}
      updateItemPath={PATH.DASHBOARD_CATEGORY_UPDATE_WITHOUT_ID}
      onDelete={(categoryIds) => deleteCategoryMutation.mutate(categoryIds)}
      tableName='Danh mục sản phẩm'
      addNewPath={PATH.DASHBOARD_CATEGORY_CREATE}
    />
  );
};

export default CategoryList;
