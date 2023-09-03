import { Category } from './category.type';
import { Pagination, SuccessResponse } from './utils.type';

interface Brand {
  _id: string;
  name: string;
}
interface Image {
  _id: string;
  name: string;
}

export interface Product {
  _id: string;
  name_vi: string;
  name_en: string;
  thumbnail: string;
  price: number;
  price_after_discount: number;
  available_count: number;
  rating_score: number;
  rating_count: number;
  rating_five_count: number;
  rating_four_count: number;
  rating_three_count: number;
  rating_two_count: number;
  rating_one_count: number;
  created_at: string;
  updated_at: string;

  brand?: Brand;
  category?: Category;
  specifications?: string;
  general_info: string;
  description: string;
  images?: Image[];
}

export interface ProductReview {
  _id: string;
  rating: number;
  comment: string;
  author: {
    _id: string;
    email: string;
    fullName: string;
    avatar: string;
  };
  images: Image[];
  replies: ProductReviewReply[];
  created_at: string;
  updated_at: string;
}

export interface ProductReviewReply {
  _id: string;
  comment: string;
  author: {
    _id: string;
    email: string;
    fullName: string;
    avatar: string;
  };
  created_at: string;
  updated_at: string;
}

export interface ProductReviewDetail {
  _id: string;
  rating: number;
  comment: string;
  images: Image[];
  created_at: string;
  updated_at: string;
}

// Request
export interface GetProductsRequestParams {
  page?: string;
  limit?: string;
  category?: string;
  brand?: string;
  name?: string;
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
  available_count: number;
}

export interface AddReviewRequestBody {
  comment?: string;
  rating?: number;
  parent_id?: string;
  images?: string[];
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

export type GetReviewsResponse = SuccessResponse<{
  reviews: ProductReview[];
  pagination: Pagination;
}>;

export type GetReviewDetailResponse = SuccessResponse<{
  review: ProductReviewDetail;
}>;
