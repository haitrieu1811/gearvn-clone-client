import {
  AddToCartRequestBody,
  AddToCartResponse,
  CheckoutRequestBody,
  CheckoutResponse,
  GetCartResponse,
  UpdateCartRequestBody
} from 'src/types/purchase.type';
import { OnlyMessageResponse } from 'src/types/utils.type';
import http from 'src/utils/http';

const purchaseApi = {
  // Thêm sản phẩm vào giỏ hàng
  addToCart({ productId, buyCount }: AddToCartRequestBody) {
    return http.post<AddToCartResponse>('/purchases/add-to-cart', { product_id: productId, buy_count: buyCount });
  },
  // Lấy giỏ hàng
  getCart() {
    return http.get<GetCartResponse>('/purchases/get-cart');
  },
  // Cập nhật giỏ hàng
  update({ purchaseId, buyCount }: UpdateCartRequestBody) {
    return http.put<OnlyMessageResponse>(`/purchases/${purchaseId}`, { buy_count: buyCount });
  },
  // Xóa sản phẩm trong giỏ hàng
  delete(purchaseIds: string[]) {
    return http.delete<OnlyMessageResponse>('/purchases', { data: { purchase_ids: purchaseIds } });
  },
  // Xóa tất cả sản phẩm trong giỏ hàng
  deleteAll() {
    return http.delete<OnlyMessageResponse>('/purchases/delete-all');
  },
  // Thanh toán
  checkout(body: CheckoutRequestBody) {
    return http.post<CheckoutResponse>('/purchases/checkout', body);
  }
};

export default purchaseApi;
