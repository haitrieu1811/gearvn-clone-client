import { OrderStatus, PaymentMethod, ReceiveMethod } from 'src/constants/enum';
import { Pagination, PaginationRequestParams, SuccessResponse } from './utils.type';

// Type: Thông tin sản phẩm mua trong đơn hàng
interface PurchaseInOrder {
  _id: string;
  unit_price: number;
  unit_price_after_discount: number;
  buy_count: number;
  product: {
    _id: string;
    name_vi: string;
    name_en: string;
    thumbnail: string;
    price: number;
    price_after_discount: number;
    created_at: string;
    updated_at: string;
  };
}

// Type: Đơn hàng
export interface Order {
  _id: string;
  status: number;
  customer_name?: string;
  customer_phone?: string;
  province?: string;
  district?: string;
  ward?: string;
  street?: string;
  note?: string;
  total_amount: number;
  purchases: PurchaseInOrder[];
  created_at: string;
  updated_at: string;
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
export interface GetOrderListRequestParams extends PaginationRequestParams {
  status?: string;
}

// Response: Lấy danh sách đơn hàng
export type GetOrderListResponse = SuccessResponse<{
  orders: Order[];
  pagination: Pagination;
}>;

// Response: Lấy số lượng đơn hàng theo trạng thái
export type GetQuantityOrderResponse = SuccessResponse<{
  qty_all: number;
  qty_new: number;
  qty_processing: number;
  qty_delivering: number;
  qty_succeed: number;
  qty_cancelled: number;
}>;

// Response: Lấy thông tin chi tiết đơn hàng
export type GetOrderDetailResponse = SuccessResponse<{
  order: OrderDetail;
}>;
