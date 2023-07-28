import {
  GetOrderDetailResponse,
  GetOrderListRequestBody,
  GetOrderListResponse,
  GetQuantityOrderResponse
} from 'src/types/order.type';
import http from 'src/utils/http';

const orderApi = {
  getList(params: GetOrderListRequestBody) {
    return http.get<GetOrderListResponse>('/orders', { params });
  },
  getDetail(orderId: string) {
    return http.get<GetOrderDetailResponse>(`/orders/${orderId}`);
  },
  getQuantity() {
    return http.get<GetQuantityOrderResponse>('/orders/quantity');
  }
};

export default orderApi;
