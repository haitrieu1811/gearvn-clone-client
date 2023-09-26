import { AuthResponse, LoginRequestBody, LogoutResponse, RegisterRequestBody } from 'src/types/auth.type';
import { getRefreshTokenFromLS } from 'src/utils/auth';
import http from 'src/utils/http';

export const URL_REGISTER = '/users/register';
export const URL_LOGIN = '/users/login';
export const URL_LOGOUT = '/users/logout';
export const URL_REFRESH_TOKEN = '/users/refresh-token';

const authApi = {
  // Đăng ký
  register(body: RegisterRequestBody) {
    return http.post<AuthResponse>(URL_REGISTER, body);
  },
  // Đăng nhập
  login(body: LoginRequestBody) {
    return http.post<AuthResponse>(URL_LOGIN, body);
  },
  // Đăng xuất
  logout() {
    const refresh_token = getRefreshTokenFromLS();
    return http.post<LogoutResponse>(URL_LOGOUT, { refresh_token });
  }
};

export default authApi;
