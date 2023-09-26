import { useQuery } from '@tanstack/react-query';
import isUndefined from 'lodash/isUndefined';
import omitBy from 'lodash/omitBy';
import { useMemo } from 'react';

import voucherApi from 'src/apis/voucher.api';
import Table from 'src/components/Table';
import { VoucherDiscountUnit } from 'src/constants/enum';
import PATH from 'src/constants/path';
import UseQueryParams from 'src/hooks/useQueryParams';
import { GetVouchersRequestParams } from 'src/types/voucher.type';
import { formatCurrency } from 'src/utils/utils';

const VoucherList = () => {
  const queryParams: GetVouchersRequestParams = UseQueryParams();
  const queryConfig = omitBy(queryParams, isUndefined);

  // Query: Lấy danh sách voucher
  const getVouchersQuery = useQuery({
    queryKey: ['vouchers', queryConfig],
    queryFn: () => voucherApi.getVouchers(queryConfig),
    keepPreviousData: true
  });

  // Vouchers
  const vouchers = useMemo(
    () => getVouchersQuery.data?.data.data.vouchers || [],
    [getVouchersQuery.data?.data.data.vouchers]
  );

  // Số lượng voucher
  const totalVouchers = useMemo(
    () => getVouchersQuery.data?.data.data.pagination.total || 0,
    [getVouchersQuery.data?.data.data.pagination.total]
  );

  // Số lượng trang
  const pageSize = useMemo(
    () => getVouchersQuery.data?.data.data.pagination.page_size || 0,
    [getVouchersQuery.data?.data.data.pagination.page_size]
  );

  return (
    <div>
      <Table
        tableName='Danh sách voucher'
        addNewPath={PATH.DASHBOARD_VOUCHER_CREATE}
        columns={[
          {
            field: 'name',
            headerName: 'Tên',
            width: 20
          },
          {
            field: 'description',
            headerName: 'Mô tả',
            width: 20
          },
          {
            field: 'code',
            headerName: 'Mã giảm giá',
            width: 20
          },
          {
            field: 'discount',
            headerName: 'Giảm',
            width: 20
          },
          {
            field: 'discount_unit',
            headerName: 'Đơn vị giảm',
            width: 20
          }
        ]}
        rows={vouchers.map((voucher) => ({
          name: voucher.name,
          description: voucher.description,
          code: voucher.code,
          discount: `${
            voucher.discount_unit === VoucherDiscountUnit.Price
              ? `${formatCurrency(voucher.discount)}₫`
              : `${voucher.discount}%`
          }`,
          discount_unit: voucher.discount_unit
        }))}
        data={vouchers}
        pageSize={pageSize}
        totalRows={totalVouchers}
        isLoading={getVouchersQuery.isLoading}
      />
    </div>
  );
};

export default VoucherList;
