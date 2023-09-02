import {
  AddReviewRequestBody,
  CreateAndUpdateProductBody,
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
  create(body: CreateAndUpdateProductBody) {
    return http.post<CreateProductResponse>('/products', body);
  },
  // Cập nhật sản phẩm
  update({ productId, body }: { productId: string; body: CreateAndUpdateProductBody }) {
    return http.patch<OnlyMessageResponse>(`/products/${productId}`, body);
  },
  // Xóa sản phẩm
  delete(productIds: string[]) {
    return http.delete<OnlyMessageResponse>('/products', { data: { product_ids: productIds } });
  },
  // Thêm ảnh cho sản phẩm
  addImage({ productId, body }: { productId: string; body: { images: string[] } }) {
    return http.post<OnlyMessageResponse>(`/products/image/${productId}`, body);
  },
  // Xóa ảnh của sản phẩm
  deleteImage(mediaId: string) {
    return http.delete<OnlyMessageResponse>(`/products/image/${mediaId}`);
  },
  // Thêm đánh giá cho sản phẩm
  addReview({ productId, body }: { productId: string; body: AddReviewRequestBody }) {
    return http.post<OnlyMessageResponse>(`/products/${productId}/reviews/`, body);
  },
  // Lấy danh sách đánh giá của sản phẩm
  getReviews(productId: string) {
    return http.get<GetReviewsResponse>(`/products/${productId}/reviews`);
  },
  // Lấy chi tiết đánh giá của sản phẩm
  getReviewDetail(productId: string) {
    return http.get<GetReviewDetailResponse>(`/products/${productId}/reviews/detail`);
  }
};

export default productApi;
