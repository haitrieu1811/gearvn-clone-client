export interface SuccessResponse<Data> {
  message: string;
  data: Data;
}

export interface ErrorResponse<Data> {
  message: string;
  data?: Data;
}

export interface OnlyMessageResponse {
  message: string;
}

export interface Pagination {
  total: number;
  page: number;
  limit: number;
  page_size: number;
}

export interface PaginationRequestParams {
  page?: string;
  limit?: string;
}
