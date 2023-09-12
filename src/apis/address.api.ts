import {
  AddAddressRequestBody,
  GetAddressResponse,
  GetAddressesResponse,
  UpdateAddressRequestBody
} from 'src/types/address.type';
import { OnlyMessageResponse } from 'src/types/utils.type';
import http from 'src/utils/http';

const addressApi = {
  // Thêm địa chỉ
  addAddress(body: AddAddressRequestBody) {
    return http.post<OnlyMessageResponse>('/addresses', body);
  },
  // Lấy danh sách địa chỉ
  getAddresses() {
    return http.get<GetAddressesResponse>(`/addresses`);
  },
  // Lấy thông tin chi tiết địa chỉ
  getAddress(address_id: string) {
    return http.get<GetAddressResponse>(`/addresses/${address_id}`);
  },
  // Cập nhật địa chỉ
  updateAddress({ body, address_id }: { body: UpdateAddressRequestBody; address_id: string }) {
    return http.put<OnlyMessageResponse>(`/addresses/${address_id}`, body);
  },
  // Xóa địa chỉ
  deleteAddress(address_id: string) {
    return http.delete<OnlyMessageResponse>(`/addresses/${address_id}`);
  },
  // Đặt địa chỉ mặc định
  setDefaultAddress(address_id: string) {
    return http.put<OnlyMessageResponse>(`/addresses/set-default/${address_id}`);
  }
};

export default addressApi;
