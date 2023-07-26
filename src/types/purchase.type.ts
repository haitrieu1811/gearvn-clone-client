import { PurchaseStatus } from 'src/constants/enum';
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

// Response
export type AddToCartResposne = SuccessResponse<{
  purchase: AddToCartPurchase;
}>;

export type GetCartResponse = SuccessResponse<{
  cart_size: number;
  cart_list: Purchase[];
}>;
