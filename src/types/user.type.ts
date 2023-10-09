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
  fullname: string;
  avatar: string;
  gender: Gender;
  verify: UserVerifyStatus;
  status: UserStatus;
  phone_number: string;
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

// Type: Khách hàng
export interface Customer {
  _id: string;
  email: string;
  fullname: string;
  phone_number: string;
  status: number;
  role: number;
  avatar: string;
  gender: number;
  verify: number;
  orders_count: number;
  new_orders_count: number;
  processing_orders_count: number;
  delivering_orders_count: number;
  succeed_orders_count: number;
  canceled_orders_count: number;
  orders_total: number;
  new_orders_total: number;
  processing_orders_total: number;
  delivering_orders_total: number;
  succeed_orders_total: number;
  canceled_orders_total: number;
  addresses_count: number;
  date_of_birth: string;
  created_at: string;
  updated_at: string;
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
  fullname?: string;
  gender?: Gender;
  phone_number?: string;
  date_of_birth?: string;
  avatar?: string;
}

// Request: Đổi mật khẩu
export interface ChangePasswordRequestBody {
  old_password: string;
  password: string;
  confirm_password: string;
}

// Request: Xóa người dùng
export interface DeleteUsersRequestBody {
  user_ids: string[];
}

// Response: Lấy danh sách người dùng
export type GetUserResponse = SuccessResponse<{
  users: User[];
  pagination: Pagination;
}>;

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

// Response: Lấy danh sách khách hàng
export type GetCustomersResponse = SuccessResponse<{
  customers: Customer[];
  pagination: Pagination;
}>;

// Response: Lấy danh sách nhân viên bán hàng
export type GetSellersResponse = SuccessResponse<{
  sellers: User[];
}>;
