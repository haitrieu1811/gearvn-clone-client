import {
  CreateBlogRequestBody,
  GetBlogDetailResponse,
  GetBlogListRequestQuery,
  GetBlogListResponse,
  UpdateBlogRequestBody
} from 'src/types/blog.type';
import { OnlyMessageResponse } from 'src/types/utils.type';
import http from 'src/utils/http';

const blogApi = {
  getList(params?: GetBlogListRequestQuery) {
    return http.get<GetBlogListResponse>('/blogs', { params });
  },
  getDetail(blogId: string) {
    return http.get<GetBlogDetailResponse>(`blogs/${blogId}`);
  },
  create(body: CreateBlogRequestBody) {
    return http.post<OnlyMessageResponse>('/blogs', body);
  },
  update({ body, blogId }: { body: UpdateBlogRequestBody; blogId: string }) {
    return http.patch<OnlyMessageResponse>(`/blogs/${blogId}`, body);
  },
  delete(blogIds: string[]) {
    return http.delete<OnlyMessageResponse>('/blogs', { data: { blog_ids: blogIds } });
  }
};

export default blogApi;
