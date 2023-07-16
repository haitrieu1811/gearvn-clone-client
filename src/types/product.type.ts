import { Category } from './category.type';
import { Pagination, SuccessResponse } from './utils.type';

interface Brand {
  _id: string;
  name: string;
  created_at: string;
  updated_at: string;
}

export interface Product {
  _id: string;
  name_vi: string;
  name_en: string;
  thumbnail: string;
  price: number;
  price_after_discount: number;
  created_at: string;
  updated_at: string;
  brand: Brand;
  category: Category;

  specifications?: string;
  general_info: string;
  description: string;
  brand_id?: string;
  category_id?: string;
  user_id?: string;
  images?: string[];
}

// Request
export interface GetProductsRequestParams {
  page?: string;
  limit?: string;
}

export interface CreateAndUpdateProductBody {
  name_vi: string;
  name_en: string;
  thumbnail: string;
  price: number;
  price_after_discount: number;
  general_info: string;
  description: string;
  images?: string[];
  brand_id: string;
  category_id: string;
  specifications: string;
}

// Response
export type GetProductsResponse = SuccessResponse<{
  products: Product[];
  pagination: Pagination;
}>;

export type GetProductDetailResponse = SuccessResponse<{
  product: Product;
}>;
