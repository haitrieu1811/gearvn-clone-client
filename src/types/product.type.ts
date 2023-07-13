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
}

// Request
export interface GetProductsRequestParams {
  page?: string;
  limit?: string;
}

// Response
export type GetProductsResponse = SuccessResponse<{
  products: Product[];
  pagination: Pagination;
}>;
