import { GetMeResponse, GetUserResponse, GetUsersParams, UpdateMeRequestBody } from 'src/types/user.type';
import { OnlyMessageResponse } from 'src/types/utils.type';
import http from 'src/utils/http';

export const URL_USERS_LIST = '/users/list';

const userApi = {
  getList(params: GetUsersParams) {
    return http.get<GetUserResponse>(URL_USERS_LIST, { params });
  },
  getMe() {
    return http.get<GetMeResponse>('users/me');
  },
  updateMe(body: UpdateMeRequestBody) {
    return http.patch<OnlyMessageResponse>('/users/me', body);
  }
};

export default userApi;
