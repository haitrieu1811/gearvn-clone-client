import { GetOrderDetailResponse, GetOrdersRequestParams, GetOrdersResponse } from 'src/types/order.type';
import { OnlyMessageResponse } from 'src/types/utils.type';
import http from 'src/utils/http';

const orderApi = {
  // Lấy danh sách tất cả đơn hàng
  getAll(params: GetOrdersRequestParams) {
    return http.get<GetOrdersResponse>('/orders/all', { params });
  },
  // Lấy danh sách đơn hàng của người dùng
  getList(params: GetOrdersRequestParams) {
    return http.get<GetOrdersResponse>('/orders', { params });
  },
  // Lấy chi tiết đơn hàng
  getDetail(orderId: string) {
    return http.get<GetOrderDetailResponse>(`/orders/${orderId}`);
  },
  // Cập nhật trạng thái đơn hàng
  updateStatus({ orderId, status }: { orderId: string; status: number }) {
    return http.patch<OnlyMessageResponse>(`/orders/${orderId}`, { status });
  },
  // Xóa đơn hàng
  delete(orderIds: string[]) {
    return http.delete<OnlyMessageResponse>(`/orders`, { data: { order_ids: orderIds } });
  }
};

export default orderApi;
