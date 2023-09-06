import { Pagination, SuccessResponse } from './utils.type';

export interface Category {
  _id: string;
  name_vi: string;
  name_en: string;
  created_at?: string;
  updated_at?: string;
}

export interface CreateCategoryBody {
  name_vi: string;
  name_en?: string;
}

export interface UpdateCategoryBody {
  name_vi: string;
  name_en?: string;
}

export interface GetCategoriesRequestParams {
  page?: string;
  limit?: string;
}

export type GetCategoriesResponse = SuccessResponse<{
  categories: Category[];
  pagination: Pagination;
}>;

export type GetCategoryResponse = SuccessResponse<{
  category: Category;
}>;

export type UpdateCategoryResponse = SuccessResponse<{
  category: Category;
}>;
