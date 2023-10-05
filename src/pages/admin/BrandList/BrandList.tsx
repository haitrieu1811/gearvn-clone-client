import { useMutation, useQuery } from '@tanstack/react-query';
import keyBy from 'lodash/keyBy';
import moment from 'moment';
import { Fragment, useContext, useEffect, useMemo } from 'react';

import brandApi from 'src/apis/brand.api';
import Table from 'src/components/Table';
import PATH from 'src/constants/path';
import { ExtendedContext } from 'src/contexts/extended.context';
import useQueryParams from 'src/hooks/useQueryParams';
import { PaginationRequestParams } from 'src/types/utils.type';
import { convertMomentFromNowToVietnamese } from 'src/utils/utils';

type QueryConfig = {
  [key in keyof PaginationRequestParams]: string;
};

const BrandList = () => {
  const { extendedBrands, setExtendedBrands } = useContext(ExtendedContext);
  const queryParams: QueryConfig = useQueryParams();
  const queryConfig: QueryConfig = {
    page: queryParams.page || '1',
    limit: queryParams.limit || '10'
  };

  // Query: Lấy danh sách nhãn hiệu
  const getBrandsQuery = useQuery({
    queryKey: ['brands', queryConfig],
    queryFn: () => brandApi.getList(queryConfig),
    keepPreviousData: true
  });

  // Xóa nhãn hiệu
  const deleteBrandMutation = useMutation(brandApi.delete);

  // Danh sách nhãn hiệu
  const brands = useMemo(() => getBrandsQuery.data?.data.data.brands || [], [getBrandsQuery.data?.data.data.brands]);

  // Tổng số nhãn hiệu
  const brandsPageSize = useMemo(
    () => getBrandsQuery.data?.data.data.pagination.page_size || 0,
    [getBrandsQuery.data?.data.data.pagination.page_size]
  );

  // Cập nhật danh sách nhãn hiệu (có thêm trường checked)
  useEffect(() => {
    if (!brands) return;
    setExtendedBrands(() => {
      const extendedBrandsObj = keyBy(extendedBrands, '_id');
      return brands.map((brand) => ({
        ...brand,
        checked: !!extendedBrandsObj[brand._id]?.checked
      }));
    });
  }, [brands]);

  // Cột của bảng
  const columns = useMemo(
    () => [
      {
        headerName: 'Nhãn hiệu',
        field: 'name',
        width: 30
      },
      {
        headerName: 'Người tạo',
        field: 'authorName',
        width: 15
      },
      {
        headerName: 'Số sản phẩm',
        field: 'productCount',
        width: 15
      },
      {
        headerName: 'Tạo lúc',
        field: 'createdAt',
        width: 15
      },
      {
        headerName: 'Cập nhật',
        field: 'updatedAt',
        width: 15
      }
    ],
    []
  );

  // Dữ liệu của bảng
  const dataSource = useMemo(() => {
    return extendedBrands.map((brand) => ({
      _id: brand._id,
      checked: brand.checked,
      name: brand.name,
      authorName: brand.author.fullname,
      productCount: `${brand.product_count} sản phẩm`,
      createdAt: convertMomentFromNowToVietnamese(moment(brand.created_at).fromNow()),
      updatedAt: convertMomentFromNowToVietnamese(moment(brand.updated_at).fromNow())
    }));
  }, [extendedBrands]);

  return (
    <Fragment>
      <Table
        data={extendedBrands}
        setData={setExtendedBrands}
        columns={columns}
        dataSource={dataSource}
        pageSize={brandsPageSize}
        isLoading={getBrandsQuery.isLoading}
        updateItemPath={PATH.DASHBOARD_BRAND_UPDATE_WITHOUT_ID}
        onDelete={(brandIds) => deleteBrandMutation.mutate(brandIds)}
        tableName='Nhãn hiệu sản phẩm'
        addNewPath={PATH.DASHBOARD_BRAND_CREATE}
      />
    </Fragment>
  );
};

export default BrandList;
