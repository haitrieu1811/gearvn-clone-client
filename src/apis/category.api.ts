import {
  CreateCategoryBody,
  GetCategoriesResponse,
  GetCategoryResponse,
  UpdateCategoryBody,
  UpdateCategoryResponse
} from 'src/types/category.type';
import { OnlyMessageResponse, PaginationRequestParams } from 'src/types/utils.type';
import http from 'src/utils/http';

const categoryApi = {
  // Lấy danh sách danh mục
  getList(params?: PaginationRequestParams) {
    return http.get<GetCategoriesResponse>('/categories', { params });
  },
  // Lấy thông tin danh mục
  getOne(categoryId: string) {
    return http.get<GetCategoryResponse>(`/categories/${categoryId}`);
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
  delete(categoryIds: string[]) {
    return http.delete<OnlyMessageResponse>('/categories', { data: { category_ids: categoryIds } });
  }
};

export default categoryApi;
