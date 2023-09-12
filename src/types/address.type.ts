import { AddressType } from 'src/constants/enum';
import { SuccessResponse } from './utils.type';

// Type: Địa chỉ
export interface Address {
  _id: string;
  province: string;
  district: string;
  ward: string;
  street: string;
  type: AddressType;
  is_default: boolean;
  created_at: string;
  updated_at: string;
}

// Request: Thêm địa chỉ nhận hàng
export interface AddAddressRequestBody {
  province: string;
  district: string;
  ward: string;
  street: string;
  type: AddressType;
}

// Request: Cập nhật địa chỉ nhận hàng
export interface UpdateAddressRequestBody {
  province: string;
  district: string;
  ward: string;
  street: string;
  type: AddressType;
}

// Response: Lấy danh sách địa chỉ nhận hàng
export type GetAddressesResponse = SuccessResponse<{
  addresses: Address[];
}>;

// Response: Lấy thông tin chi tiết địa chỉ nhận hàng
export type GetAddressResponse = SuccessResponse<{
  address: Address;
}>;
