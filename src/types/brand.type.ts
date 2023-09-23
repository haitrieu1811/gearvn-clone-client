import { User } from './user.type';
import { Pagination, SuccessResponse } from './utils.type';

// Type: Thương hiệu
export interface Brand {
  _id: string;
  name: string;
  product_count: number;
  author: User;
  created_at: string;
  updated_at: string;
}

// Request: Tạo thương hiệu mới
export interface CreateBrandRequestBody {
  name: string;
}

// Request: Cập nhật thông tin thương hiệu
export interface UpdateBrandRequestBody {
  name: string;
}

// Response: Lấy danh sách thương hiệu
export type GetBrandsResponse = SuccessResponse<{
  brands: Brand[];
  pagination: Pagination;
}>;

// Response: Lấy thông tin chi tiết thương hiệu
export type GetBrandResponse = SuccessResponse<{
  brand: Brand;
}>;
