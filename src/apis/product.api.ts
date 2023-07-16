import {
  CreateAndUpdateProductBody,
  GetProductDetailResponse,
  GetProductsRequestParams,
  GetProductsResponse
} from 'src/types/product.type';
import { OnlyMessageResponse } from 'src/types/utils.type';
import http from 'src/utils/http';

const productApi = {
  getList(params: GetProductsRequestParams) {
    return http.get<GetProductsResponse>('/products', { params });
  },
  getDetail(productId: string) {
    return http.get<GetProductDetailResponse>(`/products/${productId}`);
  },
  create(body: CreateAndUpdateProductBody) {
    return http.post<OnlyMessageResponse>('/products', body);
  },
  update({ productId, body }: { productId: string; body: CreateAndUpdateProductBody }) {
    return http.patch<OnlyMessageResponse>(`/products/${productId}`, body);
  },
  delete(productIds: string[]) {
    return http.delete<OnlyMessageResponse>('/products', { data: { product_ids: productIds } });
  }
};

export default productApi;
