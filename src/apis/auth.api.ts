import { AuthResponse } from 'src/types/auth.type';
import { getRefreshTokenFromLS } from 'src/utils/auth';
import http from 'src/utils/http';

export const URL_REGISTER = '/users/register';
export const URL_LOGIN = '/users/login';
export const URL_LOGOUT = '/users/logout';
export const URL_REFRESH_TOKEN = '/users/refresh-token';

const authApi = {
  register(body: { email: string; password: string; confirm_password: string }) {
    return http.post<AuthResponse>(URL_REGISTER, body);
  },
  login(body: { email: string; password: string }) {
    return http.post<AuthResponse>(URL_LOGIN, body);
  },
  logout() {
    const refresh_token = getRefreshTokenFromLS();
    return http.post<{ message: string }>(URL_LOGOUT, { refresh_token });
  }
};

export default authApi;
