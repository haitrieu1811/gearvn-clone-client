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
  }
};

export default userApi;
