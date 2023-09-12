import {
  CreateBrandRequestBody,
  GetBrandResponse,
  GetBrandsResponse,
  UpdateBrandRequestBody
} from 'src/types/brand.type';
import { OnlyMessageResponse, PaginationRequestParams } from 'src/types/utils.type';
import http from 'src/utils/http';

const brandApi = {
  // Lấy danh sách thương hiệu
  getList(params?: PaginationRequestParams) {
    return http.get<GetBrandsResponse>('/brands', { params });
  },
  // Lấy thông tin thương hiệu
  getOne(brandId: string) {
    return http.get<GetBrandResponse>(`/brands/${brandId}`);
  },
  // Tạo mới thương hiệu
  create(body: CreateBrandRequestBody) {
    return http.post<OnlyMessageResponse>('/brands', body);
  },
  // Cập nhật thông tin thương hiệu
  update({ body, brandId }: { body: UpdateBrandRequestBody; brandId: string }) {
    return http.put<OnlyMessageResponse>(`/brands/${brandId}`, body);
  },
  // Xóa thương hiệu
  delete(brandIds: string[]) {
    return http.delete<OnlyMessageResponse>('/brands', { data: { brand_ids: brandIds } });
  }
};

export default brandApi;
