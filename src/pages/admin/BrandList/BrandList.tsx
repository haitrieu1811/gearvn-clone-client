import keyBy from 'lodash/keyBy';
import moment from 'moment';
import { Fragment, useContext, useEffect, useMemo } from 'react';

import Table from 'src/components/Table';
import PATH from 'src/constants/path';
import { AppContext } from 'src/contexts/app.context';
import useBrand from 'src/hooks/useBrand';
import UseQueryParams from 'src/hooks/useQueryParams';
import { PaginationRequestParams } from 'src/types/utils.type';
import { convertMomentFromNowToVietnamese } from 'src/utils/utils';

type QueryConfig = {
  [key in keyof PaginationRequestParams]: string;
};

const BrandList = () => {
  const { extendedBrands, setExtendedBrands } = useContext(AppContext);
  const queryParams: QueryConfig = UseQueryParams();
  const queryConfig: QueryConfig = {
    page: queryParams.page || '1',
    limit: queryParams.limit || '10'
  };
  const { brands, brandsPageSize, getBrandsQuery, deleteBrandMutation } = useBrand(queryConfig);

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
        tableName='Danh sách nhãn hiệu'
        addNewPath={PATH.DASHBOARD_BRAND_CREATE}
      />
    </Fragment>
  );
};

export default BrandList;
