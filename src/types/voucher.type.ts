import { VoucherDiscountUnit } from 'src/constants/enum';
import { Pagination, PaginationRequestParams, SuccessResponse } from './utils.type';

// Type: Voucher
export interface VoucherType {
  id: number;
  name: string;
  description: string;
  code: string;
  discount: number;
  discount_unit: VoucherDiscountUnit;
  created_at: string;
  updated_at: string;
}

// Request: Tạo voucher
export interface CreateVoucherRequestBody {
  name?: string;
  description?: string;
  code: string;
  discount: number;
  discount_unit: VoucherDiscountUnit;
}

// Request: Lấy danh sách voucher
export interface GetVouchersRequestParams extends PaginationRequestParams {
  unit?: VoucherDiscountUnit;
  is_used?: boolean;
}

// Request: Cập nhật voucher
export type UpdateVoucherRequestBody = CreateVoucherRequestBody;

// Request: Áp dụng voucher
export interface ApplyVoucherRequestBody {
  voucher_code: string;
  original_price: number;
}

// Response: Lấy danh sách voucher
export type GetVouchersResponse = SuccessResponse<{
  vouchers: VoucherType[];
  pagination: Pagination;
}>;

// Response: Lấy 1 voucher theo voucher_code hoặc voucher_id
export type GetVoucherResponse = SuccessResponse<{
  voucher: VoucherType;
}>;

// Response: Sử dụng voucher thành công
export type UseVoucherResponse = SuccessResponse<{
  voucher: VoucherType;
}>;

// Response: Áp dụng voucher thành công
export type ApplyVoucherResponse = SuccessResponse<{
  total_reduced: number;
  voucher: VoucherType;
}>;
