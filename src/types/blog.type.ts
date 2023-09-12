import { Pagination, SuccessResponse } from './utils.type';

// Type: Blog trong danh sách blog
export interface BlogListItem {
  _id: string;
  thumbnail: string;
  name_vi: string;
  name_en: string;
  content_vi: string;
  content_en: string;
  created_at: string;
  updated_at: string;
}

// Type: Blog chi tiết
export interface BlogDetail {
  _id: string;
  thumbnail: string;
  name_vi: string;
  name_en: string;
  content_vi: string;
  content_en: string;
  status: number;
  user_id: string;
  created_at: string;
  updated_at: string;
}

// Request: Tạo blog mới
export interface CreateBlogRequestBody {
  thumbnail: string;
  name_en: string;
  name_vi: string;
  content_vi: string;
  content_en: string;
}

// Request: Cập nhật thông tin blog
export interface UpdateBlogRequestBody {
  thumbnail?: string;
  name_en?: string;
  name_vi?: string;
  content_vi?: string;
  content_en?: string;
}

// Response: Lấy danh sách blog
export type GetBlogListResponse = SuccessResponse<{
  blogs: BlogListItem[];
  pagination: Pagination;
}>;

// Response: Lấy thông tin chi tiết blog
export type GetBlogDetailResponse = SuccessResponse<{
  blog: BlogDetail;
}>;
