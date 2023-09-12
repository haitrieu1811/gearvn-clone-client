import {
  CreateBlogRequestBody,
  GetBlogDetailResponse,
  GetBlogListResponse,
  UpdateBlogRequestBody
} from 'src/types/blog.type';
import { OnlyMessageResponse, PaginationRequestParams } from 'src/types/utils.type';
import http from 'src/utils/http';

const blogApi = {
  // Lấy danh sách blog
  getList(params?: PaginationRequestParams) {
    return http.get<GetBlogListResponse>('/blogs', { params });
  },
  // Lấy thông tin chi tiết blog
  getDetail(blogId: string) {
    return http.get<GetBlogDetailResponse>(`blogs/${blogId}`);
  },
  // Tạo blog mới
  create(body: CreateBlogRequestBody) {
    return http.post<OnlyMessageResponse>('/blogs', body);
  },
  // Cập nhật thông tin blog
  update({ body, blogId }: { body: UpdateBlogRequestBody; blogId: string }) {
    return http.patch<OnlyMessageResponse>(`/blogs/${blogId}`, body);
  },
  // Xóa blog
  delete(blogIds: string[]) {
    return http.delete<OnlyMessageResponse>('/blogs', { data: { blog_ids: blogIds } });
  }
};

export default blogApi;
