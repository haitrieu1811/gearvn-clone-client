import http from 'src/utils/http';
import { GetUserResponse, GetUsersParams } from 'src/types/user.type';

export const URL_USERS_LIST = '/users/list';

const userApi = {
  getList(params: GetUsersParams) {
    return http.get<GetUserResponse>(URL_USERS_LIST, { params });
  }
};

export default userApi;
