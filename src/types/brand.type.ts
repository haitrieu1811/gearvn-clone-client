import { SuccessResponse, Pagination, OnlyMessageResponse } from './utils.type';

export interface Brand {
  _id: string;
  name: string;
  created_at: string;
  updated_at: string;
}

// Request
export interface GetBrandsRequestParams {
  page?: string;
  limit?: string;
}

export interface CreateBrandRequestBody {
  name: string;
}

export interface UpdateBrandRequestBody {
  name: string;
}

// Response
export type GetBrandsResponse = SuccessResponse<{
  brands: Brand[];
  pagination: Pagination;
}>;

export type GetBrandResponse = SuccessResponse<{
  brand: Brand;
}>;
