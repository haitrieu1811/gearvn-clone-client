import { Gender, UserRole, UserStatus, UserVerifyStatus } from 'src/constants/enum';
import { SuccessResponse } from './utils.type';

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
  addresses: never[];
  date_of_birth: string;
  created_at: Date;
  updated_at: Date;
}

export interface Pagination {
  total: number;
  page: number;
  limit: number;
  page_size: number;
}

export interface GetUsersParams {
  page?: string;
  limit?: string;
  gender?: string;
  status?: string;
  role?: string;
}

export type GetUserResponse = SuccessResponse<{ users: User[]; pagination: Pagination }>;
