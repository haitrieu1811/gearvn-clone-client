import { GetProductsRequestParams, GetProductsResponse } from 'src/types/product.type';
import http from 'src/utils/http';

const URL_GET_LIST = '/products/list';

const productApi = {
  getList(params: GetProductsRequestParams) {
    return http.get<GetProductsResponse>(URL_GET_LIST, { params });
  }
};

export default productApi;
