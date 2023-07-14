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

export const brandSchema = yup.object({
  name: yup.string().required('Tên nhãn hiệu không được để trống')
});

export const productSchema = yup.object({
  name_vi: yup
    .string()
    .required('Tên sản phẩm tiếng Việt không được để trống')
    .min(12, 'Tên sản phẩm dài từ 5 đến 500 ký tự')
    .max(500, 'Tên sản phẩm dài từ 5 đến 500 ký tự'),
  name_en: yup
    .string()
    .required('Tên sản phẩm tiếng Anh không được để trống')
    .min(12, 'Tên sản phẩm dài từ 5 đến 500 ký tự')
    .max(500, 'Tên sản phẩm dài từ 5 đến 500 ký tự'),
  price: yup.string().required('Giá sản phẩm không được để trống'),
  price_after_discount: yup.string().required('Giá sau khi giảm không được để trống'),
  general_info: yup.string().required('Thông tin chung không được để trống'),
  description: yup.string().required('Mô tả sản phẩm không được để trống'),
  brand_id: yup.string().required('Hãy chọn một danh mục'),
  category_id: yup.string().required('Hãy chọn một danh mục'),
  specifications: yup.string().required('Thông số kỹ thuật không được để trống')
});

export const registerSchema = userSchema.pick(['email', 'password', 'confirm_password']);
export const loginSchema = userSchema.pick(['email', 'password']);
export const createCategorySchema = categorySchema.pick(['name_vi', 'name_en']);
export const createBrandSchema = brandSchema.pick(['name']);
export const createProductSchema = productSchema.pick([
  'brand_id',
  'category_id',
  'description',
  'general_info',
  'name_en',
  'name_vi',
  'price',
  'price_after_discount',
  'specifications'
]);

export type RegisterSchema = yup.InferType<typeof registerSchema>;
export type LoginSchema = yup.InferType<typeof loginSchema>;
export type CreateCategorySchema = yup.InferType<typeof createCategorySchema>;
export type CreateBrandSchema = yup.InferType<typeof createBrandSchema>;
export type CreateProductSchema = yup.InferType<typeof createProductSchema>;
