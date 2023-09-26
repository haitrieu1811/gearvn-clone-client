import { Gender, OrderStatus, PaymentMethod, PurchaseStatus, ReceiveMethod } from 'src/constants/enum';
import { SuccessResponse } from './utils.type';

// Type: Purchase
export interface Purchase {
  _id: string;
  unit_price: number;
  unit_price_after_discount: number;
  buy_count: number;
  status: PurchaseStatus;
  created_at: string;
  updated_at: string;
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

// Request: Thêm sản phẩm vào giỏ hàng
export interface AddToCartRequestBody {
  productId: string;
  buyCount: number;
}

// Request: Cập nhật giỏ hàng
export interface UpdateCartRequestBody {
  purchaseId: string;
  buyCount: number;
}

// Request: Thanh toán
export interface CheckoutRequestBody {
  purchases: string[];
  customer_gender: Gender;
  customer_name: string;
  customer_phone: string;
  province: string;
  district: string;
  ward: string;
  street: string;
  note?: string;
  transport_fee?: number;
  total_amount_before_discount: number;
  total_amount: number;
  total_amount_reduced?: number;
  total_items: number;
  receive_method: ReceiveMethod;
  payment_method: PaymentMethod;
  status?: OrderStatus;
}

// Response: Thêm sản phẩm vào giỏ hàng
export type AddToCartResponse = SuccessResponse<{
  purchase_id: string;
}>;

// Response: Lấy giỏ hàng
export type GetCartResponse = SuccessResponse<{
  cart_size: number;
  cart_list: Purchase[];
}>;

// Response: Thanh toán
export type CheckoutResponse = SuccessResponse<{
  order_id: string;
}>;
