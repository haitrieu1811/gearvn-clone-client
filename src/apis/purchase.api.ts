import { AddToCartResposne, GetCartResponse } from 'src/types/purchase.type';
import { Address } from 'src/types/user.type';
import { OnlyMessageResponse } from 'src/types/utils.type';
import http from 'src/utils/http';

const purchaseApi = {
  addToCart({ productId, buyCount }: { productId: string; buyCount: number }) {
    return http.post<AddToCartResposne>('/purchases/add-to-cart', { product_id: productId, buy_count: buyCount });
  },
  getCart() {
    return http.get<GetCartResponse>('/purchases/get-cart');
  },
  update({ purchaseId, buyCount }: { purchaseId: string; buyCount: number }) {
    return http.put<OnlyMessageResponse>(`/purchases/${purchaseId}`, { buy_count: buyCount });
  },
  delete(purchaseIds: string[]) {
    return http.delete<OnlyMessageResponse>('/purchases', { data: { purchase_ids: purchaseIds } });
  },
  deleteAll() {
    return http.delete<OnlyMessageResponse>('/purchases/delete-all');
  },
  checkout({ purchaseIds, address }: { purchaseIds: string[]; address: Address }) {
    const { province, district, ward, street } = address;
    return http.post<OnlyMessageResponse>('/purchases/checkout', {
      purchase_ids: purchaseIds,
      province,
      district,
      ward,
      street
    });
  }
};

export default purchaseApi;
