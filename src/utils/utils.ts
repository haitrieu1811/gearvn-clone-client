import axios, { AxiosError } from 'axios';
import turndown from 'turndown';

import HTTP_STATUS from 'src/constants/httpStatus';
import { ErrorResponse } from 'src/types/utils.type';

export const isAxiosError = <T>(error: unknown): error is AxiosError<T> => {
  return axios.isAxiosError(error);
};

export const isEntityError = <FormError>(error: unknown): error is AxiosError<FormError> => {
  return isAxiosError(error) && error.response?.status === HTTP_STATUS.UNPROCESSABLE_ENTITY;
};

export const isUnauthorizedError = <UnauthorizedError>(error: unknown): error is AxiosError<UnauthorizedError> => {
  return isAxiosError(error) && error.response?.status === HTTP_STATUS.UNAUTHORIZED;
};

export const isExpiredTokenError = <UnauthorizedError>(error: unknown): error is AxiosError<UnauthorizedError> => {
  return isUnauthorizedError<ErrorResponse<{}>>(error) && error.response?.data.message === 'Jwt expired';
};

export const formatCurrency = (currency: number) => {
  return new Intl.NumberFormat('de-DE').format(currency);
};

export const getImageUrl = (name: string) => {
  return `https://gearvn-clone-ap-southeast-1.s3.ap-southeast-1.amazonaws.com/images/${name}`;
};

export const rateSale = (originalPrice: number, salePrice: number) => {
  return Math.round(((originalPrice - salePrice) / originalPrice) * 100);
};

const removeSpecialCharacter = (text: string): string => {
  text = text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '');
  text = text.replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
  return text;
};

export const generateNameId = ({ name, id }: { name: string; id: string }) => {
  return removeSpecialCharacter(name).replace(/\s/g, '-') + `-i-${id}`;
};

export const getIdFromNameId = (nameId: string) => {
  const arr = nameId.split('-i-');
  return arr[arr.length - 1];
};

export const htmlToPlainText = (html: string) => {
  const div = document.createElement('div');
  div.innerHTML = html;
  return div.innerText;
};

export const htmlToMarkdown = (html: string) => {
  const turndownService = new turndown();
  return turndownService.turndown(html);
};

export const convertMomentFromNowToVietnamese = (momentFromNow: string) => {
  return momentFromNow
    .replace('a few seconds ago', 'vài giây trước')
    .replace('seconds ago', 'giây trước')
    .replace('a minute ago', '1 phút trước')
    .replace('minutes ago', 'phút trước')
    .replace('an hour ago', '1 giờ trước')
    .replace('hours ago', 'giờ trước')
    .replace('a day ago', '1 ngày trước')
    .replace('days ago', 'ngày trước')
    .replace('a month ago', '1 tháng trước')
    .replace('months ago', 'tháng trước')
    .replace('a year ago', '1 năm trước')
    .replace('years ago', 'năm trước');
};
