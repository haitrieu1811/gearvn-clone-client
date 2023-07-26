import { GetOrderListRequestBody, GetOrderListResponse } from 'src/types/order.type';
import http from 'src/utils/http';

const orderApi = {
  getList(params: GetOrderListRequestBody) {
    return http.get<GetOrderListResponse>('/orders/list', { params });
  }
};

export default orderApi;
