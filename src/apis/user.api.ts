import { AuthResponse } from 'src/types/auth.type';
import {
  AddAddressRequestBody,
  GetAddressResponse,
  GetMeResponse,
  GetUserResponse,
  GetUsersParams,
  GetViewedProductsResponse,
  UpdateAddressRequestBody,
  UpdateMeRequestBody
} from 'src/types/user.type';
import { OnlyMessageResponse } from 'src/types/utils.type';
import http from 'src/utils/http';

export const URL_USERS_LIST = '/users/list';
export const URL_UPDATE_ME = '/users/me';
export const URL_USER_ADDRESS = '/users/address';

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
  addAddress(body: AddAddressRequestBody) {
    return http.post<AuthResponse>(URL_USER_ADDRESS, body);
  },
  getAddress(addressId: string) {
    return http.get<GetAddressResponse>(`${URL_USER_ADDRESS}/${addressId}`);
  },
  updateAddress({ body, addressId }: { body: UpdateAddressRequestBody; addressId: string }) {
    return http.put<AuthResponse>(`${URL_USER_ADDRESS}/${addressId}`, body);
  },
  deleteAddress(addressId: string) {
    return http.delete<AuthResponse>(`${URL_USER_ADDRESS}/${addressId}`);
  },
  setDefaultAddress(addressId: string) {
    return http.put<AuthResponse>(`/users/address/set-default/${addressId}`);
  },
  getViewedProducts() {
    return http.get<GetViewedProductsResponse>('/users/viewed-product');
  },
  addViewedProduct(body: { product_id: string }) {
    return http.post<OnlyMessageResponse>('/users/viewed-product', body);
  }
};

export default userApi;
