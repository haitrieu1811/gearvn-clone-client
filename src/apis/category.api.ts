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

const categoryApi = {
  // Lấy danh sách danh mục
  getList(params?: GetCategoriesRequestParams) {
    return http.get<GetCategoriesResponse>('/categories', { params });
  },
  // Lấy thông tin danh mục
  getOne(category_id: string) {
    return http.get<GetCategoryResponse>(`/categories/${category_id}`);
  },
  // Tạo mới danh mục
  create(body: CreateCategoryBody) {
    return http.post<OnlyMessageResponse>('/categories', body);
  },
  // Cập nhật thông tin danh mục
  update({ body, categoryId }: { body: UpdateCategoryBody; categoryId: string }) {
    return http.patch<UpdateCategoryResponse>(`/categories/${categoryId}`, body);
  },
  // Xóa danh mục
  delete(category_ids: string[]) {
    return http.delete<OnlyMessageResponse>('/categories', { data: { category_ids } });
  }
};

export default categoryApi;
