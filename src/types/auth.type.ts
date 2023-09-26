import { User } from './user.type';
import { SuccessResponse } from './utils.type';

// Type: Authenticated response
export type AuthResponse = SuccessResponse<{
  access_token: string;
  refresh_token: string;
  user: User;
}>;

// Type: Refresh token response
export type RefreshTokenResponse = SuccessResponse<{
  access_token: string;
  refresh_token: string;
}>;

// Request: Đăng ký
export interface RegisterRequestBody {
  email: string;
  password: string;
  confirm_password: string;
}

// Request: Đăng nhập
export interface LoginRequestBody {
  email: string;
  password: string;
}

// Response: Đăng xuất
export type LogoutResponse = SuccessResponse<{
  user_id: string;
}>;
