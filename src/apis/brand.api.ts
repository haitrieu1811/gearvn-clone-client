import {
  CreateBrandRequestBody,
  GetBrandResponse,
  GetBrandsRequestParams,
  GetBrandsResponse,
  UpdateBrandRequestBody
} from 'src/types/brand.type';
import { OnlyMessageResponse } from 'src/types/utils.type';
import http from 'src/utils/http';

const URL_GET_BRANDS = '/products/brand';
const URL_GET_BRAND = '/products/brand';
const URL_CREATE_BRAND = '/products/brand';
const URL_UPDATE_BRAND = '/products/brand';
const URL_DELETE_BRAND = '/products/brand';

const brandApi = {
  getList(params: GetBrandsRequestParams) {
    return http.get<GetBrandsResponse>(URL_GET_BRANDS, { params });
  },
  getOne(brandId: string) {
    return http.get<GetBrandResponse>(`${URL_GET_BRAND}/${brandId}`);
  },
  create(body: CreateBrandRequestBody) {
    return http.post<OnlyMessageResponse>(URL_CREATE_BRAND, body);
  },
  update({ body, brandId }: { body: UpdateBrandRequestBody; brandId: string }) {
    return http.put<OnlyMessageResponse>(`${URL_UPDATE_BRAND}/${brandId}`, body);
  },
  delete(brandId: string) {
    return http.delete<OnlyMessageResponse>(`${URL_DELETE_BRAND}/${brandId}`);
  }
};

export default brandApi;
