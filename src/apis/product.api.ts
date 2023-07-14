import { CreateProductRequestBody, GetProductsRequestParams, GetProductsResponse } from 'src/types/product.type';
import { OnlyMessageResponse } from 'src/types/utils.type';
import http from 'src/utils/http';

const URL_GET_LIST = '/products/list';
const URL_CREATE = '/products/create';

const productApi = {
  getList(params: GetProductsRequestParams) {
    return http.get<GetProductsResponse>(URL_GET_LIST, { params });
  },
  create(body: CreateProductRequestBody) {
    return http.post<OnlyMessageResponse>(URL_CREATE, body);
  }
};

export default productApi;
