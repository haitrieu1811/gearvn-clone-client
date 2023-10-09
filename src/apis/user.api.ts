import { AuthResponse } from 'src/types/auth.type';
import {
  ChangePasswordRequestBody,
  DeleteUsersRequestBody,
  GetCustomersResponse,
  GetMeResponse,
  GetQuantityPerCollectionResponse,
  GetSellersResponse,
  GetUserResponse,
  GetUsersParams,
  GetViewedProductsResponse,
  UpdateMeRequestBody
} from 'src/types/user.type';
import { OnlyMessageResponse, PaginationRequestParams } from 'src/types/utils.type';
import http from 'src/utils/http';

export const URL_USERS_LIST = '/users';
export const URL_ME = '/users/me';
export const URL_CHANGE_PASSWORD = '/users/change-password';
export const URL_VIEWED_PRODUCTS = '/users/viewed-product';
export const URL_QUANTITY_PER_COLLECTION = '/users/quantity-per-collection';
export const URL_FORGOT_PASSWORD = '/users/forgot-password';
export const URL_VERIFY_FORGOT_PASSWORD_TOKEN = '/users/verify-forgot-password-token';
export const URL_RESET_PASSWORD = '/users/reset-password';
export const URL_RESEND_VERIFY_EMAIL = '/users/resend-email-verify';
export const URL_VERIFY_EMAIL = '/users/verify-email';

const userApi = {
  // Lấy danh sách user
  getList(params: GetUsersParams) {
    return http.get<GetUserResponse>(URL_USERS_LIST, { params });
  },
  // Lấy thông tin user
  getMe() {
    return http.get<GetMeResponse>(URL_ME);
  },
  // Cập nhật thông tin user
  updateMe(body: UpdateMeRequestBody) {
    return http.patch<AuthResponse>(URL_ME, body);
  },
  changePassword(body: ChangePasswordRequestBody) {
    return http.put<OnlyMessageResponse>(URL_CHANGE_PASSWORD, body);
  },
  // Lấy danh sách sản phẩm đã xem
  getViewedProducts() {
    return http.get<GetViewedProductsResponse>(URL_VIEWED_PRODUCTS);
  },
  // Thêm sản phẩm đã xem
  addViewedProduct(body: { product_id: string }) {
    return http.post<OnlyMessageResponse>(URL_VIEWED_PRODUCTS, body);
  },
  // Lấy số lượng sản phẩm theo collection
  getQuantityPerCollection() {
    return http.get<GetQuantityPerCollectionResponse>(URL_QUANTITY_PER_COLLECTION);
  },
  // Gửi lại email xác thực
  resendVerifyEmail() {
    return http.post<OnlyMessageResponse>(URL_RESEND_VERIFY_EMAIL);
  },
  // Xác thực email
  verifyEmail(body: { email_verify_token: string }) {
    return http.post<AuthResponse>(URL_VERIFY_EMAIL, body);
  },
  // Quên mật khẩu
  forgotPassword(body: { email: string }) {
    return http.post<OnlyMessageResponse>(URL_FORGOT_PASSWORD, body);
  },
  // Xác nhận token quên mật khẩu
  verifyForgotPasswordToken(body: { forgot_password_token: string }) {
    return http.post<OnlyMessageResponse>(URL_VERIFY_FORGOT_PASSWORD_TOKEN, body);
  },
  // Đặt lại mật khẩu
  resetPassword(body: { forgot_password_token: string; password: string; confirm_password: string }) {
    return http.put<AuthResponse>(URL_RESET_PASSWORD, body);
  },
  // Lấy danh sách khách hàng
  getCustomers(params: PaginationRequestParams) {
    return http.get<GetCustomersResponse>('/users/customers', { params });
  },
  // Xóa người dụng
  deleteUsers(body: DeleteUsersRequestBody) {
    return http.delete<OnlyMessageResponse>('/users', { data: body });
  },
  // Lấy danh sách nhân viên bán hàng
  getSellers() {
    return http.get<GetSellersResponse>('/users/sellers');
  }
};

export default userApi;
