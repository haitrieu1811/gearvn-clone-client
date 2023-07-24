import { AuthResponse } from 'src/types/auth.type';
import {
  AddAddressRequestBody,
  GetMeResponse,
  GetUserResponse,
  GetUsersParams,
  UpdateMeRequestBody
} from 'src/types/user.type';
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
  deleteAddress(addressId: string) {
    return http.delete<AuthResponse>(`${URL_USER_ADDRESS}/${addressId}`);
  },
  setDefaultAddress(addressId: string) {
    return http.put<AuthResponse>(`/users/address/set-default/${addressId}`);
  }
};

export default userApi;
