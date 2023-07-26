import { Gender } from 'src/constants/enum';
import { Pagination, SuccessResponse } from './utils.type';

export interface Order {
  _id: string;
  address: { province: string; district: string; ward: string; street: string };
  purchases: {
    _id: string;
    name_vi: string;
    name_en: string;
    thumbnail: string;
    price: number;
    price_after_discount: number;
  }[];
  user: {
    _id: string;
    email: string;
    fullName: string;
    avatar: string;
    gender: Gender;
    phoneNumber: string;
    date_of_birth: string;
    created_at: string;
    updated_at: string;
  };
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
