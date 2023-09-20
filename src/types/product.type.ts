import { Category } from './category.type';
import { Pagination, SuccessResponse } from './utils.type';

// Type: Thương hiệu
interface Brand {
  _id: string;
  name: string;
}

// Type: Hình ảnh
export interface Image {
  _id: string;
  name: string;
  created_at: string;
  updated_at: string;
}

// Type: Người đánh giá
interface ReviewAuthor {
  _id: string;
  email: string;
  fullname: string;
  avatar: string;
}

// Type: Sản phẩm
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

  author: {
    _id: string;
    email: string;
    fullname: string;
    avatar: string;
  };
  brand?: Brand;
  category?: Category;
  general_info: string;
  description: string;
  images?: Image[];
}

// Type: Đánh giá của sản phẩm
export interface ProductReview {
  _id: string;
  rating: number;
  comment: string;
  author: ReviewAuthor;
  images: Image[];
  replies: ProductReviewReply[];
  created_at: string;
  updated_at: string;
}

// Type: Trả lời đánh giá của sản phẩm
export interface ProductReviewReply {
  _id: string;
  comment: string;
  images: Image[];
  author: ReviewAuthor;
  created_at: string;
  updated_at: string;
}

// Type: Chi tiết đánh giá của sản phẩm
export interface ProductReviewDetail {
  _id: string;
  rating: number;
  comment: string;
  images: Image[];
  created_at: string;
  updated_at: string;
}

// Request: Lấy danh sách sản phẩm
export interface GetProductsRequestParams {
  page?: string;
  limit?: string;
  category?: string;
  brand?: string;
  name?: string;
  sortBy?: string;
  orderBy?: string;
}

// Request: Tạo và cập nhật sản phẩm
export interface CreateAndUpdateProductRequestBody {
  name_vi: string;
  name_en: string;
  thumbnail: string;
  price: number;
  price_after_discount: number;
  general_info: string;
  description: string;
  brand_id: string;
  category_id: string;
  available_count: number;
  images?: string[]; // Tên của hình ảnh
}

// Request: Thêm đánh giá
export interface AddReviewRequestBody {
  comment?: string;
  rating?: number;
  parent_id?: string;
  images?: string[];
}

// Response: Lấy danh sách sản phẩm
export type GetProductsResponse = SuccessResponse<{
  products: Product[];
  pagination: Pagination;
}>;

// Response: Lấy chi tiết sản phẩm
export type GetProductDetailResponse = SuccessResponse<{
  product: Product;
}>;

// Response: Tạo sản phẩm
export type CreateProductResponse = SuccessResponse<{
  insertedId: string;
}>;

// Response: Lấy danh sách đánh giá
export type GetReviewsResponse = SuccessResponse<{
  reviews: ProductReview[];
  pagination: Pagination;
}>;

// Response: Lấy chi tiết đánh giá
export type GetReviewDetailResponse = SuccessResponse<{
  review: ProductReviewDetail;
}>;
