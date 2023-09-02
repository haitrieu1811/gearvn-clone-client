import {
  GetOrderDetailResponse,
  GetOrderListRequestParams,
  GetOrderListResponse,
  GetQuantityOrderResponse
} from 'src/types/order.type';
import { OnlyMessageResponse } from 'src/types/utils.type';
import http from 'src/utils/http';

const orderApi = {
  // Lấy danh sách tất cả đơn hàng
  getAll(params: GetOrderListRequestParams) {
    return http.get<GetOrderListResponse>('/orders/all', { params });
  },
  // Lấy danh sách đơn hàng của người dùng
  getList(params: GetOrderListRequestParams) {
    return http.get<GetOrderListResponse>('/orders', { params });
  },
  // Lấy chi tiết đơn hàng
  getDetail(orderId: string) {
    return http.get<GetOrderDetailResponse>(`/orders/${orderId}`);
  },
  // Lấy số lượng đơn hàng
  getQuantity() {
    return http.get<GetQuantityOrderResponse>('/orders/quantity');
  },
  // Cập nhật trạng thái đơn hàng
  updateStatus({ orderId, status }: { orderId: string; status: number }) {
    return http.put<OnlyMessageResponse>(`/orders/update-status/${orderId}`, { status });
  },
  // Xóa đơn hàng
  delete(orderId: string) {
    return http.delete<OnlyMessageResponse>(`/orders/${orderId}`);
  }
};

export default orderApi;
