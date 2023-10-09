import { useMutation } from '@tanstack/react-query';
import { Dispatch, ReactNode, SetStateAction, createContext, useMemo, useState } from 'react';
import { Socket } from 'socket.io-client';

import authApi from 'src/apis/auth.api';
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
import { User } from 'src/types/user.type';
import { getAccessTokenFromLS, getProfileFromLS } from 'src/utils/auth';
import socket from 'src/utils/socket';

interface AppContextType {
  // App
  socket: Socket;
  setSocket: Dispatch<SetStateAction<Socket>>;
  isAuthenticated: boolean;
  setIsAuthenticated: Dispatch<SetStateAction<boolean>>;
  profile: User | null;
  setProfile: Dispatch<SetStateAction<User | null>>;
  resetAuth: () => void;
  logout: () => void;
  // Extended
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

const initialContext: AppContextType = {
  // App
  socket,
  setSocket: () => null,
  isAuthenticated: Boolean(getAccessTokenFromLS()),
  setIsAuthenticated: () => null,
  profile: getProfileFromLS(),
  setProfile: () => null,
  resetAuth: () => null,
  logout: () => null,
  // Extended
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

export const AppContext = createContext<AppContextType>(initialContext);

const AppProvider = ({ children }: { children: ReactNode }) => {
  // App state
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(initialContext.isAuthenticated);
  const [profile, setProfile] = useState<User | null>(initialContext.profile);
  const [socket, setSocket] = useState<Socket>(initialContext.socket);

  // Extended state
  const [extendedCategories, setExtendedCategories] = useState<ExtendedCategory[]>(initialContext.extendedCategories);
  const [extendedBrands, setExtendedBrands] = useState<ExtendedBrand[]>(initialContext.extendedBrands);
  const [extendedProducts, setExtendedProducts] = useState<ExtendedProduct[]>(initialContext.extendedProducts);
  const [extendedBlogs, setExtendedBlogs] = useState<ExtendedBlog[]>(initialContext.extendedBlogs);
  const [extendedCartList, setExtendedCartList] = useState<ExtendedPurchase[]>(initialContext.extendedCartList);
  const [extendedVouchers, setExtendedVouchers] = useState<ExtendedVoucher[]>(initialContext.extendedVouchers);
  const [extendedOrders, setExtendedOrders] = useState<ExtendedOrder[]>(initialContext.extendedOrders);
  const [extendedCustomers, setExtendedCustomers] = useState<ExtendedCustomer[]>(initialContext.extendedCustomers);

  // Reset auth (khi đăng xuất)
  const resetAuth = () => {
    setIsAuthenticated(false);
    setProfile(null);
  };

  // Mutation: Đăng xuất
  const logoutMutation = useMutation({
    mutationFn: authApi.logout,
    onSuccess: () => {
      setIsAuthenticated(false);
      setProfile(null);
      socket.disconnect();
    }
  });

  // Xử lý đăng xuất
  const logout = () => {
    logoutMutation.mutate();
  };

  // Danh sách sản phẩm đã chọn trong giỏ hàng
  const checkedCartList = useMemo(() => extendedCartList.filter((cartItem) => cartItem.checked), [extendedCartList]);

  // Tổng tiền sản phẩm đã chọn trong giỏ hàng
  const cartTotal = useMemo(
    () =>
      checkedCartList?.reduce((acc, cartItem) => acc + cartItem.buy_count * cartItem.product.price_after_discount, 0),
    [checkedCartList]
  );

  return (
    <AppContext.Provider
      value={{
        // App
        socket,
        setSocket,
        isAuthenticated,
        setIsAuthenticated,
        profile,
        setProfile,
        resetAuth,
        logout,
        // Extended
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
    </AppContext.Provider>
  );
};

export default AppProvider;
