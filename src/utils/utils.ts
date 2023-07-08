import axios, { AxiosError } from 'axios';
import HTTP_STATUS from 'src/constants/httpStatus';
import { ErrorResponse } from 'src/types/utils.type';

export const isAxiosError = <T>(error: unknown): error is AxiosError<T> => {
  return axios.isAxiosError(error);
};

export const isEntiryError = <FormError>(error: unknown): error is AxiosError<FormError> => {
  return isAxiosError(error) && error.response?.status === HTTP_STATUS.UNPROCESSABLE_ENTITY;
};

export const isUnauthorizedError = <UnauthorizedError>(error: unknown): error is AxiosError<UnauthorizedError> => {
  return isAxiosError(error) && error.response?.status === HTTP_STATUS.UNAUTHORIZED;
};

export const isExpiredTokenError = <UnauthorizedError>(error: unknown): error is AxiosError<UnauthorizedError> => {
  return isUnauthorizedError<ErrorResponse<{}>>(error) && error.response?.data.message === 'Jwt expired';
};
