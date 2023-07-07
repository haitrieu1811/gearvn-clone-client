import axios, { AxiosError } from 'axios';
import HTTP_STATUS from 'src/constants/httpStatus';

export const isAxiosError = <T>(error: unknown): error is AxiosError<T> => {
  return axios.isAxiosError(error);
};

export const isEntiryError = <FormError>(error: unknown): error is AxiosError<FormError> => {
  return isAxiosError(error) && error.response?.status === HTTP_STATUS.UNPROCESSABLE_ENTITY;
};
