import * as yup from 'yup';

export const schema = yup.object({
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

export const registerSchema = schema.pick(['email', 'password', 'confirm_password']);
export const loginSchema = schema.pick(['email', 'password']);

export type RegisterSchema = yup.InferType<typeof registerSchema>;
export type LoginSchema = yup.InferType<typeof loginSchema>;
