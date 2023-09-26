import { OnlyMessageResponse } from 'src/types/utils.type';
import {
  CreateVoucherRequestBody,
  GetVoucherResponse,
  GetVouchersRequestParams,
  GetVouchersResponse,
  UpdateVoucherRequestBody,
  UseVoucherResponse,
  ApplyVoucherRequestBody,
  ApplyVoucherResponse
} from 'src/types/voucher.type';
import http from 'src/utils/http';

const voucherApi = {
  // Tạo voucher
  createVoucher(body: CreateVoucherRequestBody) {
    return http.post<OnlyMessageResponse>('/vouchers', body);
  },
  // Lấy danh sách voucher
  getVouchers(params?: GetVouchersRequestParams) {
    return http.get<GetVouchersResponse>('/vouchers', { params });
  },
  // Lấy voucher theo voucher code
  getVoucherByCode(voucherCode: string) {
    return http.get<GetVoucherResponse>(`/vouchers/code/${voucherCode}`);
  },
  // Lấy voucher theo voucher id
  getVoucherById(voucherId: string) {
    return http.get<GetVoucherResponse>(`/vouchers/${voucherId}`);
  },
  // Cập nhật voucher
  updateVoucher({ body, voucherId }: { body: UpdateVoucherRequestBody; voucherId: string }) {
    return http.put<OnlyMessageResponse>(`/vouchers/${voucherId}`, body);
  },
  // Xóa voucher (xóa một hoặc nhiều voucher)
  deleteVoucher(voucherIds: string[]) {
    return http.delete<OnlyMessageResponse>('vouchers', { data: { voucher_ids: voucherIds } });
  },
  // Áp dụng voucher
  applyVoucher(body: ApplyVoucherRequestBody) {
    return http.post<ApplyVoucherResponse>('/vouchers/apply', body);
  },
  // Sử dụng voucher
  useVoucher(voucherCode: string) {
    return http.patch<UseVoucherResponse>(`/vouchers/use/code/${voucherCode}`);
  }
};

export default voucherApi;
