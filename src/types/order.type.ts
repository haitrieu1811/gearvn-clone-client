import { OrderStatus } from 'src/constants/enum';
import { Pagination, SuccessResponse } from './utils.type';

interface PurchaseInOrder {
  _id: string;
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

export interface Order {
  _id: string;
  status: number;
  purchases: PurchaseInOrder[];
  created_at: string;
  updated_at: string;
}

interface Contact {
  province: string;
  district: string;
  ward: string;
  street: string;
  phone_number: string;
  customer_name: string;
}

interface OrderDetail {
  _id: string;
  status: OrderStatus;
  total_buy_count: number;
  total_amount: number;
  purchases: PurchaseInOrder[];
  contact: Contact;
  created_at: string;
  updated_at: string;
}

// Request
export interface GetOrderListRequestBody {
  page?: string;
  limit?: string;
  status?: string;
}

// Response
export type GetOrderListResponse = SuccessResponse<{
  orders_size: number;
  orders: Order[];
  pagination: Pagination;
}>;

export type GetQuantityOrderResponse = SuccessResponse<{
  qty_all: number;
  qty_new: number;
  qty_processing: number;
  qty_delivering: number;
  qty_succeed: number;
  qty_cancelled: number;
}>;

export type GetOrderDetailResponse = SuccessResponse<{
  order: OrderDetail;
}>;
