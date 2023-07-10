import * as yup from 'yup';

export const userSchema = yup.object({
  email: yup
    .string()
    .required('Email không được để trống')
    .email('Email không đúng định dạng')
    .min(5, 'Email phải có độ dài từ 5 đến 160 kí tự')
    .max(160, 'Email phải có độ dài từ 5 đến 160 kí tự'),
  password: yup
    .string()
    .required('Mật khẩu không được để trống')
    .min(6, 'Mật khẩu phải có độ dài từ 6 đến 32 kí tự')
    .max(32, 'Mật khẩu phải có độ dài từ 6 đến 32 kí tự'),
  confirm_password: yup
    .string()
    .required('Nhập lại khẩu không được để trống')
    .oneOf([yup.ref('password')], 'Nhập lại mật khẩu không chính xác')
});

export const categorySchema = yup.object({
  name_vi: yup
    .string()
    .required('Tên tiếng Việt không được để trống')
    .min(1, 'Tên tiếng Việt phải có độ dài từ 1 đến 160 kí tự')
    .max(160, 'Tên tiếng Việt phải có độ dài từ 1 đến 160 kí tự'),
  name_en: yup
    .string()
    .required('Tên tiếng Anh không được để trống')
    .min(1, 'Tên tiếng Anh phải có độ dài từ 1 đến 160 kí tự')
    .max(160, 'Tên tiếng Anh phải có độ dài từ 1 đến 160 kí tự')
});

export const registerSchema = userSchema.pick(['email', 'password', 'confirm_password']);
export const loginSchema = userSchema.pick(['email', 'password']);
export const createCategorySchema = categorySchema.pick(['name_vi', 'name_en']);

export type RegisterSchema = yup.InferType<typeof registerSchema>;
export type LoginSchema = yup.InferType<typeof loginSchema>;
export type CreateCategorySchema = yup.InferType<typeof createCategorySchema>;
