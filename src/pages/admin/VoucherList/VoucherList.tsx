import { useMutation, useQuery } from '@tanstack/react-query';
import isUndefined from 'lodash/isUndefined';
import keyBy from 'lodash/keyBy';
import omitBy from 'lodash/omitBy';
import moment from 'moment';
import { useContext, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

import voucherApi from 'src/apis/voucher.api';
import Badge from 'src/components/Badge';
import Table from 'src/components/Table';
import { VoucherDiscountUnit } from 'src/constants/enum';
import PATH from 'src/constants/path';
import { AppContext } from 'src/contexts/app.context';
import UseQueryParams from 'src/hooks/useQueryParams';
import { GetVouchersRequestParams } from 'src/types/voucher.type';
import { convertMomentFromNowToVietnamese, formatCurrency } from 'src/utils/utils';

const VoucherList = () => {
  const navigate = useNavigate();
  const queryParams: GetVouchersRequestParams = UseQueryParams();
  const queryConfig = omitBy(queryParams, isUndefined);
  const { extendedVouchers, setExtendedVouchers } = useContext(AppContext);

  // Query: Lấy danh sách voucher
  const getVouchersQuery = useQuery({
    queryKey: ['vouchers', queryConfig],
    queryFn: () => voucherApi.getVouchers(queryConfig),
    keepPreviousData: true
  });

  // Mutation: Xóa voucher
  const deleteVouchersMutation = useMutation({
    mutationFn: voucherApi.deleteVouchers,
    onSuccess: (data) => {
      toast.success(data.data.message);
      getVouchersQuery.refetch();
    }
  });

  // Vouchers
  const vouchers = useMemo(
    () => getVouchersQuery.data?.data.data.vouchers || [],
    [getVouchersQuery.data?.data.data.vouchers]
  );

  // Số lượng trang
  const pageSize = useMemo(
    () => getVouchersQuery.data?.data.data.pagination.page_size || 0,
    [getVouchersQuery.data?.data.data.pagination.page_size]
  );

  // Set extendedVouchers
  useEffect(() => {
    if (vouchers.length === 0) return;
    setExtendedVouchers((prevState) => {
      const extendedVouchersObj = keyBy(prevState, '_id');
      return vouchers.map((voucher) => ({
        ...voucher,
        checked: !!extendedVouchersObj[voucher._id]?.checked
      }));
    });
  }, [vouchers, setExtendedVouchers]);

  // Các cột của table
  const columns = useMemo(
    () => [
      {
        field: 'name',
        headerName: 'Tên',
        width: 15
      },
      {
        field: 'description',
        headerName: 'Mô tả',
        width: 15
      },
      {
        field: 'code',
        headerName: 'Mã giảm giá',
        width: 15
      },
      {
        field: 'discount',
        headerName: 'Giảm',
        width: 10
      },
      {
        field: 'status',
        headerName: 'Trạng thái',
        width: 10
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

  // Data source cho table
  const dataSource = useMemo(() => {
    return extendedVouchers.map((voucher) => ({
      _id: voucher._id,
      checked: voucher.checked,
      createdAt: convertMomentFromNowToVietnamese(moment(voucher.created_at).fromNow()),
      updatedAt: convertMomentFromNowToVietnamese(moment(voucher.updated_at).fromNow()),
      name: voucher.name,
      description: voucher.description,
      code: voucher.code,
      discount: `${
        voucher.discount_unit === VoucherDiscountUnit.Price
          ? `${formatCurrency(voucher.discount)}₫`
          : `${voucher.discount}%`
      }`,
      status: voucher.is_used ? <Badge type='Danger' name='Đã sử dụng' /> : <Badge type='Primary' name='Chưa sử dụng' />
    }));
  }, [extendedVouchers, navigate]);

  return (
    <div>
      <Table
        data={extendedVouchers}
        setData={setExtendedVouchers}
        pageSize={pageSize}
        isLoading={getVouchersQuery.isLoading}
        updateItemPath={PATH.DASHBOARD_VOUCHER_UPDATE_WITHOUT_ID}
        onDelete={(voucherIds) => deleteVouchersMutation.mutate(voucherIds)}
        columns={columns}
        dataSource={dataSource}
      />
    </div>
  );
};

export default VoucherList;
