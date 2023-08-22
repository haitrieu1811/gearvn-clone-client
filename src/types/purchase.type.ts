import { Gender, OrderStatus, PaymentMethod, PurchaseStatus, ReceiveMethod } from 'src/constants/enum';
import { SuccessResponse } from './utils.type';

export interface Purchase {
  _id: string;
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
interface AddToCartPurchase {
  _id: string;
  buy_count: number;
  product_id: string;
  user_id: string;
  status: PurchaseStatus;
  created_at: string;
  updated_at: string;
}

// Checkout
export interface CheckoutReqBody {
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
  total_amount: number;
  total_amount_reduced?: number;
  total_items: number;
  receive_method: ReceiveMethod;
  payment_method: PaymentMethod;
  status?: OrderStatus;
}

export type AddToCartResposne = SuccessResponse<{
  purchase: AddToCartPurchase;
}>;

export type GetCartResponse = SuccessResponse<{
  cart_size: number;
  cart_list: Purchase[];
}>;

export type CheckoutResponse = SuccessResponse<{
  order_id: string;
}>;
