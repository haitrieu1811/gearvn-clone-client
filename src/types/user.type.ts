import { Gender, UserRole, UserStatus, UserVerifyStatus } from 'src/constants/enum';
import { Pagination, SuccessResponse } from './utils.type';

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

// Response
export type GetUserResponse = SuccessResponse<{ users: User[]; pagination: Pagination }>;

export type GetMeResponse = SuccessResponse<{
  user: User;
}>;
