import {
  CreateCategoryBody,
  GetCategoriesRequestParams,
  GetCategoriesResponse,
  GetCategoryResponse,
  UpdateCategoryBody,
  UpdateCategoryResponse
} from 'src/types/category.type';
import { OnlyMessageResponse } from 'src/types/utils.type';
import http from 'src/utils/http';

const URL_GET_LIST = '/categories/list';
const URL_GET_ONE = '/categories';
const URL_CREATE = '/categories/create';
const URL_UPDATE = '/categories/update';
const URL_DELETE = '/categories';

const categoryApi = {
  getList(params?: GetCategoriesRequestParams) {
    return http.get<GetCategoriesResponse>(URL_GET_LIST, { params });
  },
  getOne(category_id: string) {
    return http.get<GetCategoryResponse>(`${URL_GET_ONE}/${category_id}`);
  },
  create(body: CreateCategoryBody) {
    return http.post<OnlyMessageResponse>(URL_CREATE, body);
  },
  update({ body, categoryId }: { body: UpdateCategoryBody; categoryId: string }) {
    return http.patch<UpdateCategoryResponse>(`${URL_UPDATE}/${categoryId}`, body);
  },
  delete(category_ids: string[]) {
    return http.delete<OnlyMessageResponse>(URL_DELETE, { data: { category_ids } });
  }
};

export default categoryApi;
