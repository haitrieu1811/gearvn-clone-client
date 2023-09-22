import { Pagination, SuccessResponse } from './utils.type';

// Type: Blog
export interface BlogType {
  _id: string;
  thumbnail: string;
  name_vi: string;
  name_en: string;
  content_vi: string;
  content_en: string;
  status: number;
  author: {
    _id: string;
    email: string;
    status: number;
    role: number;
    avatar: string;
    gender: number;
    verify: number;
    date_of_birth: string;
    fullname: string;
    phone_number: string;
    created_at: string;
    updated_at: string;
  };
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
  blogs: BlogType[];
  pagination: Pagination;
}>;

// Response: Lấy thông tin chi tiết blog
export type GetBlogDetailResponse = SuccessResponse<{
  blog: BlogType;
}>;
