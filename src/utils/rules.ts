import * as yup from 'yup';
import REGEX from 'src/constants/regex';
import { VoucherDiscountUnit } from 'src/constants/enum';

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
  old_password: yup
    .string()
    .required('Mật khẩu cũ không được để trống')
    .min(6, 'Mật khẩu cũ phải có độ dài từ 6 đến 32 kí tự')
    .max(32, 'Mật khẩu cũ phải có độ dài từ 6 đến 32 kí tự'),
  fullname: yup
    .string()
    .required('Họ tên không được để trống')
    .min(1, 'Họ tên dài từ 1 đến 100 ký tự')
    .max(100, 'Họ tên dài từ 1 đến 100 ký tự'),
  gender: yup.string().required('Hãy chọn giới tính'),
  phone_number: yup
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
  customer_name: userSchema.fields.fullname as yup.StringSchema<string | undefined, yup.AnyObject, undefined, ''>,
  customer_phone: userSchema.fields.phone_number as yup.StringSchema<string | undefined, yup.AnyObject, undefined, ''>,
  receive_method: yup.string().required('Hãy chọn phương thức nhận hàng'),
  province: addressSchema.fields.province as yup.StringSchema<string | undefined, yup.AnyObject, undefined, ''>,
  district: addressSchema.fields.district as yup.StringSchema<string | undefined, yup.AnyObject, undefined, ''>,
  ward: addressSchema.fields.ward as yup.StringSchema<string | undefined, yup.AnyObject, undefined, ''>,
  street: addressSchema.fields.street as yup.StringSchema<string | undefined, yup.AnyObject, undefined, ''>,
  payment_method: yup.string().required('Hãy chọn phương thức thanh toán'),
  note: yup.string().max(250, 'Ghi chú dài tối đa 250 kí tự')
});

export const voucherSchema = yup.object({
  code: yup.string().required('Mã giảm giá không được để trống'),
  discount_unit: yup.string().required('Hãy chọn đơn vị giảm giá'),
  discount: yup
    .string()
    .required('Giá trị giảm giá không được để trống')
    .test('is-numeric', 'Giá trị giảm giá phải là một số', (value) => !isNaN(Number(value)))
    .test('is-positive', 'Giá trị giảm giá phải là một số nguyên dương', (value) => Number(value) >= 0)
    .test(
      'is-less-than-100-percent',
      'Giá trị giảm giá phải nhỏ hơn 100 vì đơn vị giảm giá là phần trăm (%)',
      (value, { parent }) => {
        const { discount_unit } = parent;
        return Number(discount_unit) !== VoucherDiscountUnit.Percentage || Number(value) <= 100;
      }
    )
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
  'available_count'
]);
export const createBlogSchema = blogSchema.pick(['name_vi', 'name_en', 'content_vi', 'content_en']);
export const updateMeSchema = userSchema.pick(['fullname', 'phone_number', 'gender', 'date_of_birth']);
export const changePasswordSchema = userSchema.pick(['old_password', 'password', 'confirm_password']);
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
export type ChangePasswordSchema = yup.InferType<typeof changePasswordSchema>;
export type AddAddressSchema = yup.InferType<typeof addAddressSchema>;
export type PaymentOrderSchema = yup.InferType<typeof paymentOrderSchema>;
export type ForgotPasswordSchema = yup.InferType<typeof forgotPasswordSchema>;
export type ResetPasswordSchema = yup.InferType<typeof resetPasswordSchema>;
export type VoucherSchema = yup.InferType<typeof voucherSchema>;
