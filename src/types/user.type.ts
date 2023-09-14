import { Gender, UserRole, UserStatus, UserVerifyStatus } from 'src/constants/enum';
import { Address } from './address.type';
import { Product } from './product.type';
import { Pagination, SuccessResponse } from './utils.type';

// Type: Sản phẩm đã xem
export interface ViewedProduct {
  _id: string;
  product: Product;
  created_at: string;
  updated_at: string;
}

// Type: Người dùng
export interface User {
  _id: string;
  email: string;
  role: UserRole;
  fullName: string;
  avatar: string;
  gender: Gender;
  verify: UserVerifyStatus;
  status: UserStatus;
  phoneNumber: string;
  addresses: Address[];
  date_of_birth: string;
  created_at: Date;
  updated_at: Date;
}

// Type: Số lượng người dùng, sản phẩm, đơn hàng, danh mục, thương hiệu, bài viết
export interface QuantityPerCollection {
  users: number;
  products: number;
  orders: number;
  categories: number;
  brands: number;
  blogs: number;
}

// Request: Lấy danh sách người dùng
export interface GetUsersParams {
  page?: string;
  limit?: string;
  gender?: string;
  status?: string;
  role?: string;
}

// Request: Cập nhật thông tin tài khoản đăng nhập
export interface UpdateMeRequestBody {
  fullName?: string;
  gender?: Gender;
  phoneNumber?: string;
  date_of_birth?: string;
  avatar?: string;
}

// Request: Đổi mật khẩu
export interface ChangePasswordRequestBody {
  old_password: string;
  password: string;
  confirm_password: string;
}

// Response: Lấy danh sách người dùng
export type GetUserResponse = SuccessResponse<{ users: User[]; pagination: Pagination }>;

// Response: Lấy thông tin tài khoản đăng nhập
export type GetMeResponse = SuccessResponse<{
  user: User;
}>;

// Response: Lấy danh sách sản phẩm đã xem
export type GetViewedProductsResponse = SuccessResponse<{
  viewed_products: ViewedProduct[];
}>;

// Response: Lấy số lượng người dùng, sản phẩm, đơn hàng, danh mục, thương hiệu, bài viết
export type GetQuantityPerCollectionResponse = SuccessResponse<QuantityPerCollection>;
