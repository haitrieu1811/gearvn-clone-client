import { BlogType } from './blog.type';
import { Brand } from './brand.type';
import { Category } from './category.type';
import { Product } from './product.type';
import { Purchase } from './purchase.type';

export interface ExtendedCategory extends Category {
  checked: boolean;
}

export interface ExtendedBrand extends Brand {
  checked: boolean;
}

export interface ExtendedProduct extends Product {
  checked: boolean;
}

export interface ExtendedBlog extends BlogType {
  checked: boolean;
}

export interface ExtendedPurchase extends Purchase {
  checked: boolean;
  disabled: boolean;
}
