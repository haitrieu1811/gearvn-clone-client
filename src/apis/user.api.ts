import { AuthResponse } from 'src/types/auth.type';
import {
  GetMeResponse,
  GetQuantityPerCollectionResponse,
  GetUserResponse,
  GetUsersParams,
  GetViewedProductsResponse,
  UpdateMeRequestBody
} from 'src/types/user.type';
import { OnlyMessageResponse } from 'src/types/utils.type';
import http from 'src/utils/http';

export const URL_USERS_LIST = '/users/list';
export const URL_UPDATE_ME = '/users/me';
export const URL_FORGOT_PASSWORD = '/users/forgot-password';
export const URL_VERIFY_FORGOT_PASSWORD_TOKEN = '/users/verify-forgot-password-token';
export const URL_RESET_PASSWORD = '/users/reset-password';

const userApi = {
  getList(params: GetUsersParams) {
    return http.get<GetUserResponse>(URL_USERS_LIST, { params });
  },
  getMe() {
    return http.get<GetMeResponse>('users/me');
  },
  updateMe(body: UpdateMeRequestBody) {
    return http.patch<AuthResponse>(URL_UPDATE_ME, body);
  },
  getViewedProducts() {
    return http.get<GetViewedProductsResponse>('/users/viewed-product');
  },
  addViewedProduct(body: { product_id: string }) {
    return http.post<OnlyMessageResponse>('/users/viewed-product', body);
  },
  getQuantityPerCollection() {
    return http.get<GetQuantityPerCollectionResponse>('/users/quantity-per-collection');
  },
  forgotPassword(body: { email: string }) {
    return http.post<OnlyMessageResponse>(URL_FORGOT_PASSWORD, body);
  },
  verifyForgotPasswordToken(body: { forgot_password_token: string }) {
    return http.post<OnlyMessageResponse>(URL_VERIFY_FORGOT_PASSWORD_TOKEN, body);
  },
  resetPassword(body: { forgot_password_token: string; password: string; confirm_password: string }) {
    return http.put<AuthResponse>(URL_RESET_PASSWORD, body);
  }
};

export default userApi;
