import { Pagination, SuccessResponse } from './utils.type';

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

// Request
export interface GetBlogListRequestQuery {
  page?: string;
  limit?: string;
}

export interface CreateBlogRequestBody {
  thumbnail: string;
  name_en: string;
  name_vi: string;
  content_vi: string;
  content_en: string;
}

export interface UpdateBlogRequestBody {
  thumbnail?: string;
  name_en?: string;
  name_vi?: string;
  content_vi?: string;
  content_en?: string;
}

// Response
export type GetBlogListResponse = SuccessResponse<{
  blogs: BlogListItem[];
  pagination: Pagination;
}>;

export type GetBlogDetailResponse = SuccessResponse<{
  blog: BlogDetail;
}>;
