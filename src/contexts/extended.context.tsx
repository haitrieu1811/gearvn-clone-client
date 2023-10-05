import { Dispatch, ReactNode, SetStateAction, createContext, useMemo, useState } from 'react';

import {
  ExtendedBlog,
  ExtendedBrand,
  ExtendedCategory,
  ExtendedCustomer,
  ExtendedOrder,
  ExtendedProduct,
  ExtendedPurchase,
  ExtendedVoucher
} from 'src/types/extended.type';

interface ExtendedContext {
  extendedCategories: ExtendedCategory[];
  setExtendedCategories: Dispatch<SetStateAction<ExtendedCategory[]>>;
  extendedBrands: ExtendedBrand[];
  setExtendedBrands: Dispatch<SetStateAction<ExtendedBrand[]>>;
  extendedProducts: ExtendedProduct[];
  setExtendedProducts: Dispatch<SetStateAction<ExtendedProduct[]>>;
  extendedBlogs: ExtendedBlog[];
  setExtendedBlogs: Dispatch<SetStateAction<ExtendedBlog[]>>;
  extendedCartList: ExtendedPurchase[];
  setExtendedCartList: Dispatch<SetStateAction<ExtendedPurchase[]>>;
  extendedVouchers: ExtendedVoucher[];
  setExtendedVouchers: Dispatch<SetStateAction<ExtendedVoucher[]>>;
  extendedOrders: ExtendedOrder[];
  setExtendedOrders: Dispatch<SetStateAction<ExtendedOrder[]>>;
  extendedCustomers: ExtendedCustomer[];
  setExtendedCustomers: Dispatch<SetStateAction<ExtendedCustomer[]>>;
  cartTotal: number;
  checkedCartList: ExtendedPurchase[];
}

const initialContext: ExtendedContext = {
  extendedCategories: [],
  setExtendedCategories: () => null,
  extendedBrands: [],
  setExtendedBrands: () => null,
  extendedProducts: [],
  setExtendedProducts: () => null,
  extendedBlogs: [],
  setExtendedBlogs: () => null,
  extendedCartList: [],
  setExtendedCartList: () => null,
  extendedVouchers: [],
  setExtendedVouchers: () => null,
  extendedOrders: [],
  setExtendedOrders: () => null,
  extendedCustomers: [],
  setExtendedCustomers: () => null,
  cartTotal: 0,
  checkedCartList: []
};

export const ExtendedContext = createContext<ExtendedContext>(initialContext);

const ExtendedProvider = ({ children }: { children: ReactNode }) => {
  const [extendedCategories, setExtendedCategories] = useState<ExtendedCategory[]>(initialContext.extendedCategories);
  const [extendedBrands, setExtendedBrands] = useState<ExtendedBrand[]>(initialContext.extendedBrands);
  const [extendedProducts, setExtendedProducts] = useState<ExtendedProduct[]>(initialContext.extendedProducts);
  const [extendedBlogs, setExtendedBlogs] = useState<ExtendedBlog[]>(initialContext.extendedBlogs);
  const [extendedCartList, setExtendedCartList] = useState<ExtendedPurchase[]>(initialContext.extendedCartList);
  const [extendedVouchers, setExtendedVouchers] = useState<ExtendedVoucher[]>(initialContext.extendedVouchers);
  const [extendedOrders, setExtendedOrders] = useState<ExtendedOrder[]>(initialContext.extendedOrders);
  const [extendedCustomers, setExtendedCustomers] = useState<ExtendedCustomer[]>(initialContext.extendedCustomers);

  // Danh sách sản phẩm đã chọn trong giỏ hàng
  const checkedCartList = useMemo(() => extendedCartList.filter((cartItem) => cartItem.checked), [extendedCartList]);

  // Tổng tiền sản phẩm đã chọn trong giỏ hàng
  const cartTotal = useMemo(
    () =>
      checkedCartList?.reduce((acc, cartItem) => acc + cartItem.buy_count * cartItem.product.price_after_discount, 0),
    [checkedCartList]
  );

  return (
    <ExtendedContext.Provider
      value={{
        extendedCategories,
        setExtendedCategories,
        extendedBrands,
        setExtendedBrands,
        extendedProducts,
        setExtendedProducts,
        extendedBlogs,
        setExtendedBlogs,
        extendedCartList,
        setExtendedCartList,
        extendedVouchers,
        setExtendedVouchers,
        extendedOrders,
        setExtendedOrders,
        extendedCustomers,
        setExtendedCustomers,
        cartTotal,
        checkedCartList
      }}
    >
      {children}
    </ExtendedContext.Provider>
  );
};

export default ExtendedProvider;
