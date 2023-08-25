import { AddressType, Gender, UserRole, UserStatus, UserVerifyStatus } from 'src/constants/enum';
import { Pagination, SuccessResponse } from './utils.type';
import { Product } from './product.type';

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

export interface ViewedProduct {
  _id: string;
  product: Product;
  created_at: string;
  updated_at: string;
}

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

export interface QuantityPerCollection {
  users: number;
  products: number;
  orders: number;
  categories: number;
  brands: number;
  blogs: number;
}

// Request
export interface GetUsersParams {
  page?: string;
  limit?: string;
  gender?: string;
  status?: string;
  role?: string;
}

export interface UpdateMeRequestBody {
  fullName?: string;
  gender?: Gender;
  phoneNumber?: string;
  date_of_birth?: string;
  avatar?: string;
}

export interface AddAddressRequestBody {
  province: string;
  district: string;
  ward: string;
  street: string;
  type: AddressType;
}

export interface UpdateAddressRequestBody {
  province: string;
  district: string;
  ward: string;
  street: string;
  type: AddressType;
}

// Response
export type GetUserResponse = SuccessResponse<{ users: User[]; pagination: Pagination }>;

export type GetMeResponse = SuccessResponse<{
  user: User;
}>;

export type GetAddressResponse = SuccessResponse<{
  address: Address;
}>;

export type GetViewedProductsResponse = SuccessResponse<{
  viewed_products: ViewedProduct[];
}>;

export type GetQuantityPerCollectionResponse = SuccessResponse<QuantityPerCollection>;

export type GetAddressesListResponse = SuccessResponse<{
  addresses: Address[];
}>;
