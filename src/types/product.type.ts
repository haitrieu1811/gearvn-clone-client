import { MediaType } from 'src/constants/enum';
import { Category } from './category.type';
import { Pagination, SuccessResponse } from './utils.type';

interface Brand {
  _id: string;
  name: string;
  created_at: string;
  updated_at: string;
}
interface Image {
  _id: string;
  name: string;
  type: MediaType;
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
  images?: Image[];
}

// Request
export interface GetProductsRequestParams {
  page?: string;
  limit?: string;
  category?: string;
  brand?: string;
  sortBy?: string;
  orderBy?: string;
}

export interface CreateAndUpdateProductBody {
  name_vi: string;
  name_en: string;
  thumbnail: string;
  price: number;
  price_after_discount: number;
  general_info: string;
  description: string;
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

export type CreateProductResponse = SuccessResponse<{
  insertedId: string;
}>;
