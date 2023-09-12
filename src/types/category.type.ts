import { Pagination, SuccessResponse } from './utils.type';

// Type: Danh mục
export interface Category {
  _id: string;
  name_vi: string;
  name_en: string;
  created_at?: string;
  updated_at?: string;
}

// Request: Tạo danh mục mới
export interface CreateCategoryBody {
  name_vi: string;
  name_en?: string;
}

// Request: Cập nhật thông tin danh mục
export interface UpdateCategoryBody {
  name_vi: string;
  name_en?: string;
}

// Response: Lấy danh sách danh mục
export type GetCategoriesResponse = SuccessResponse<{
  categories: Category[];
  pagination: Pagination;
}>;

// Response: Lấy thông tin chi tiết danh mục
export type GetCategoryResponse = SuccessResponse<{
  category: Category;
}>;

// Response: Cập nhật thông tin danh mục
export type UpdateCategoryResponse = SuccessResponse<{
  category: Category;
}>;
