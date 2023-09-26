import { OrderStatus, PaymentMethod, ReceiveMethod } from 'src/constants/enum';
import { Pagination, PaginationRequestParams, SuccessResponse } from './utils.type';

interface ProductInPurchase {
  _id: string;
  name_vi: string;
  name_en: string;
  thumbnail: string;
  price: number;
  price_after_discount: number;
  available_count: number;
  created_at: string;
  updated_at: string;
}

interface PurchaseInOrder {
  _id: string;
  unit_price: number;
  unit_price_after_discount: number;
  buy_count: number;
  product: ProductInPurchase;
}

export interface Order {
  _id: string;
  status: number;
  province: string;
  district: string;
  ward: string;
  street: string;
  customer_gender: number;
  customer_name: string;
  customer_phone: string;
  transport_fee: number;
  total_amount_before_discount: number;
  total_amount: number;
  total_amount_reduced: number;
  note: string;
  total_items: number;
  receive_method: number;
  payment_method: number;
  purchases: PurchaseInOrder[];
  created_at: string;
  updated_at: string;
}

// Type: Số lượng đơn hàng theo trạng thái
export interface OrderCountByStatus {
  all: number;
  new: number;
  processing: number;
  delivering: number;
  succeed: number;
  canceled: number;
}

// Type: Chi tiết đơn hàng
interface OrderDetail {
  _id: string;
  customer_gender: number;
  customer_name: string;
  customer_phone: string;
  province: string;
  district: string;
  ward: string;
  street: string;
  note: string;
  transport_fee: number;
  status: OrderStatus;
  total_amount_before_discount: number;
  total_amount: number;
  total_amount_reduced: number;
  total_items: number;
  receive_method: ReceiveMethod;
  payment_method: PaymentMethod;
  purchases: PurchaseInOrder[];
  created_at: string;
  updated_at: string;
}

// Request: Lấy danh sách đơn hàng
export interface GetOrdersRequestParams extends PaginationRequestParams {
  status?: string;
}

// Response: Lấy danh sách đơn hàng
export type GetOrdersResponse = SuccessResponse<{
  orders: Order[];
  quantity: OrderCountByStatus;
  pagination: Pagination;
}>;

// Response: Lấy thông tin chi tiết đơn hàng
export type GetOrderDetailResponse = SuccessResponse<{
  order: OrderDetail;
}>;
