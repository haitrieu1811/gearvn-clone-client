import { BlogType } from './blog.type';
import { Brand } from './brand.type';
import { Category } from './category.type';
import { Order } from './order.type';
import { Product } from './product.type';
import { Purchase } from './purchase.type';
import { Customer } from './user.type';
import { VoucherType } from './voucher.type';

// Category mở rộng thêm thuộc tính checked
export interface ExtendedCategory extends Category {
  checked: boolean;
}

// Brand mở rộng thêm thuộc tính checked
export interface ExtendedBrand extends Brand {
  checked: boolean;
}

// Product mở rộng thêm thuộc tính checked
export interface ExtendedProduct extends Product {
  checked: boolean;
}

// Blog mở rộng thêm thuộc tính checked
export interface ExtendedBlog extends BlogType {
  checked: boolean;
}

// Purchase mở rộng thêm thuộc tính checked và disabled
export interface ExtendedPurchase extends Purchase {
  checked: boolean;
  disabled: boolean;
}

// Voucher mở rộng thêm thuộc tính checked
export interface ExtendedVoucher extends VoucherType {
  checked: boolean;
}

// Order mở rộng thêm thuộc tính checked
export interface ExtendedOrder extends Order {
  checked: boolean;
}

// User mở rộng thêm thuộc tính checked
export interface ExtendedCustomer extends Customer {
  checked: boolean;
}
