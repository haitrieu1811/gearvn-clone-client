import * as yup from 'yup';
import REGEX from 'src/constants/regex';

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
    .oneOf([yup.ref('password')], 'Nhập lại mật khẩu không chính xác'),
  fullName: yup
    .string()
    .required('Họ tên không được để trống')
    .min(1, 'Họ tên dài từ 1 đến 100 ký tự')
    .max(100, 'Họ tên dài từ 1 đến 100 ký tự'),
  gender: yup.string().required('Hãy chọn giới tính'),
  phoneNumber: yup
    .string()
    .required('Số điện thoại không được để trống')
    .matches(REGEX.PHONE_NUMBER, 'Số điện thoại không hợp lệ'),
  date_of_birth: yup.date().required().max(new Date(), 'Hãy chọn một ngày trong quá khứ')
});

export const addressSchema = yup.object({
  province: yup.string().required('Tỉnh/thành phố không được để trống'),
  district: yup.string().required('Quận/huyện không được để trống'),
  ward: yup.string().required('Phường/xã không được để trống'),
  street: yup
    .string()
    .required('Số nhà/tên đường không được để trống')
    .min(1, 'Số nhà tên đường dài từ 1 đến 250 ký tự')
    .max(250, 'Số nhà tên đường dài từ 1 đến 250 ký tự'),
  type: yup.number().required('Loại địa chỉ không được để trống')
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
    .min(12, 'Tên sản phẩm dài từ 12 đến 500 ký tự')
    .max(500, 'Tên sản phẩm dài từ 5 đến 500 ký tự'),
  name_en: yup
    .string()
    .required('Tên sản phẩm tiếng Anh không được để trống')
    .min(12, 'Tên sản phẩm dài từ 12 đến 500 ký tự')
    .max(500, 'Tên sản phẩm dài từ 5 đến 500 ký tự'),
  price: yup.string().required('Giá sản phẩm không được để trống'),
  price_after_discount: yup.string().required('Giá sau khi giảm không được để trống'),
  general_info: yup.string().required('Thông tin chung không được để trống'),
  description: yup.string().required('Mô tả sản phẩm không được để trống'),
  brand_id: yup.string().required('Hãy chọn một danh mục'),
  category_id: yup.string().required('Hãy chọn một danh mục'),
  specifications: yup.string().required('Thông số kỹ thuật không được để trống'),
  available_count: yup.string().required('Số lượng sản phẩm không được để trống')
});

export const blogSchema = yup.object({
  name_vi: yup.string().required('Tiêu đề tiếng Việt bài viết không được để trống').trim(),
  name_en: yup.string().required('Tiêu đề tiếng Anh bài viết không được để trống').trim(),
  content_vi: yup.string().required('Nội dung tiếng Việt bài viết không được để trống').trim(),
  content_en: yup.string().required('Nội dung tiếng Anh bài viết không được để trống').trim()
});

export const orderSchema = yup.object({
  customer_gender: yup.string().required('Hãy chọn giới tính'),
  customer_name: userSchema.fields.fullName as yup.StringSchema<string | undefined, yup.AnyObject, undefined, ''>,
  customer_phone: userSchema.fields.phoneNumber as yup.StringSchema<string | undefined, yup.AnyObject, undefined, ''>,
  receive_method: yup.number().required('Hãy chọn phương thức nhận hàng'),
  province: addressSchema.fields.province as yup.StringSchema<string | undefined, yup.AnyObject, undefined, ''>,
  district: addressSchema.fields.district as yup.StringSchema<string | undefined, yup.AnyObject, undefined, ''>,
  ward: addressSchema.fields.ward as yup.StringSchema<string | undefined, yup.AnyObject, undefined, ''>,
  street: addressSchema.fields.street as yup.StringSchema<string | undefined, yup.AnyObject, undefined, ''>,
  payment_method: yup.number().required('Hãy chọn phương thức thanh toán'),
  note: yup.string().max(250, 'Ghi chú dài tối đa 250 kí tự')
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
  'specifications',
  'available_count'
]);
export const createBlogSchema = blogSchema.pick(['name_vi', 'name_en', 'content_vi', 'content_en']);
export const updateMeSchema = userSchema.pick(['fullName', 'phoneNumber', 'gender', 'date_of_birth']);
export const addAddressSchema = addressSchema.pick(['province', 'district', 'ward', 'street', 'type']);
export const paymentOrderSchema = orderSchema.pick([
  'district',
  'customer_name',
  'customer_phone',
  'note',
  'payment_method',
  'customer_gender',
  'province',
  'receive_method',
  'street',
  'ward'
]);
export const forgotPasswordSchema = userSchema.pick(['email']);
export const resetPasswordSchema = userSchema.pick(['password', 'confirm_password']);

export type RegisterSchema = yup.InferType<typeof registerSchema>;
export type LoginSchema = yup.InferType<typeof loginSchema>;
export type CreateCategorySchema = yup.InferType<typeof createCategorySchema>;
export type CreateBrandSchema = yup.InferType<typeof createBrandSchema>;
export type CreateProductSchema = yup.InferType<typeof createProductSchema>;
export type CreateBlogSchema = yup.InferType<typeof createBlogSchema>;
export type UpdateMeSchema = yup.InferType<typeof updateMeSchema>;
export type AddAddressSchema = yup.InferType<typeof addAddressSchema>;
export type PaymentOrderSchema = yup.InferType<typeof paymentOrderSchema>;
export type ForgotPasswordSchema = yup.InferType<typeof forgotPasswordSchema>;
export type ResetPasswordSchema = yup.InferType<typeof resetPasswordSchema>;
