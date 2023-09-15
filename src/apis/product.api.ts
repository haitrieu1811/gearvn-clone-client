import {
  AddReviewRequestBody,
  CreateAndUpdateProductRequestBody,
  CreateProductResponse,
  GetProductDetailResponse,
  GetProductsRequestParams,
  GetProductsResponse,
  GetReviewDetailResponse,
  GetReviewsResponse
} from 'src/types/product.type';
import { OnlyMessageResponse } from 'src/types/utils.type';
import http from 'src/utils/http';

const productApi = {
  // Lấy danh sách sản phẩm
  getList(params: GetProductsRequestParams) {
    return http.get<GetProductsResponse>('/products', { params });
  },
  // Lấy chi tiết sản phẩm
  getDetail(productId: string) {
    return http.get<GetProductDetailResponse>(`/products/${productId}`);
  },
  // Tạo sản phẩm
  create(body: CreateAndUpdateProductRequestBody) {
    return http.post<CreateProductResponse>('/products', body);
  },
  // Cập nhật sản phẩm
  update({ productId, body }: { productId: string; body: CreateAndUpdateProductRequestBody }) {
    return http.patch<OnlyMessageResponse>(`/products/${productId}`, body);
  },
  // Xóa sản phẩm
  delete(productIds: string[]) {
    return http.delete<OnlyMessageResponse>('/products', { data: { product_ids: productIds } });
  },
  // Thêm đánh giá cho sản phẩm
  addReview({ productId, body }: { productId: string; body: AddReviewRequestBody }) {
    return http.post<OnlyMessageResponse>(`/reviews/product/${productId}`, body);
  },
  // Lấy danh sách đánh giá của sản phẩm
  getReviews(productId: string) {
    return http.get<GetReviewsResponse>(`/reviews/product/${productId}`);
  },
  // Lấy chi tiết đánh giá của sản phẩm
  getReviewDetail(productId: string) {
    return http.get<GetReviewDetailResponse>(`/reviews/detail/product/${productId}`);
  },
  // Xóa hình ảnh đính kèm của đánh giá sản phẩm
  deleteReviewImage({ reviewId, imageId }: { reviewId: string; imageId: string }) {
    return http.delete(`/reviews/${reviewId}/image/${imageId}`);
  },
  // Xóa đánh giá của sản phẩm
  deleteReview(reviewId: string) {
    return http.delete<OnlyMessageResponse>(`/reviews/${reviewId}`);
  }
};

export default productApi;
