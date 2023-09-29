import { useMutation, useQuery } from '@tanstack/react-query';
import { Dispatch, ReactNode, SetStateAction, createContext, useMemo, useState } from 'react';

import authApi from 'src/apis/auth.api';
import conversationApi from 'src/apis/conversation.api';
import { ConversationReceiver } from 'src/types/conversation.type';
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
  isAuthenticated: boolean;
  setIsAuthenticated: Dispatch<SetStateAction<boolean>>;
  profile: User | null;
  setProfile: Dispatch<SetStateAction<User | null>>;
  reset: () => void;
  cartTotal: number;
  checkedCartList: ExtendedPurchase[];
  isOpenChat: boolean;
  setIsOpenChat: Dispatch<SetStateAction<boolean>>;
  logout: () => void;
  getConversationReceiversQuery: ReturnType<typeof useQuery> | undefined;
  conversationReceivers: ConversationReceiver[];
  conversationUnreadCount: number;

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
}

const initialContext: AppContextType = {
  isAuthenticated: Boolean(getAccessTokenFromLS()),
  setIsAuthenticated: () => null,
  profile: getProfileFromLS(),
  setProfile: () => null,
  reset: () => null,
  cartTotal: 0,
  checkedCartList: [],
  isOpenChat: false,
  setIsOpenChat: () => null,
  logout: () => null,
  getConversationReceiversQuery: undefined,
  conversationReceivers: [],
  conversationUnreadCount: 0,

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
  setExtendedCustomers: () => null
};

export const AppContext = createContext<AppContextType>(initialContext);

const AppProvider = ({ children }: { children: ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(initialContext.isAuthenticated);
  const [profile, setProfile] = useState<User | null>(initialContext.profile);
  const [isOpenChat, setIsOpenChat] = useState<boolean>(initialContext.isOpenChat);

  const [extendedCategories, setExtendedCategories] = useState<ExtendedCategory[]>(initialContext.extendedCategories);
  const [extendedBrands, setExtendedBrands] = useState<ExtendedBrand[]>(initialContext.extendedBrands);
  const [extendedProducts, setExtendedProducts] = useState<ExtendedProduct[]>(initialContext.extendedProducts);
  const [extendedBlogs, setExtendedBlogs] = useState<ExtendedBlog[]>(initialContext.extendedBlogs);
  const [extendedCartList, setExtendedCartList] = useState<ExtendedPurchase[]>(initialContext.extendedCartList);
  const [extendedVouchers, setExtendedVouchers] = useState<ExtendedVoucher[]>(initialContext.extendedVouchers);
  const [extendedOrders, setExtendedOrders] = useState<ExtendedOrder[]>(initialContext.extendedOrders);
  const [extendedCustomers, setExtendedCustomers] = useState<ExtendedCustomer[]>(initialContext.extendedCustomers);

  // Reset auth (logout)
  const reset = () => {
    setIsAuthenticated(false);
    setProfile(null);
  };

  // Mutation: Đăng xuất
  const logoutMutation = useMutation({
    mutationFn: authApi.logout,
    onSuccess: () => {
      setIsAuthenticated(false);
      setProfile(null);
      socket.emit('logout');
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

  // Query: Lấy dánh sách người đã nhắn tin với mình
  const getReceiversQuery = useQuery({
    queryKey: ['conversation_receivers', profile?._id],
    queryFn: () => conversationApi.getReceivers(),
    enabled: !!profile?._id
  });

  // Danh sách người đã nhắn tin với mình
  const conversationReceivers = useMemo(
    () => getReceiversQuery.data?.data.data.receivers,
    [getReceiversQuery.data?.data.data.receivers]
  );

  // Tổng số lượng tin nhắn chưa đọc
  const conversationUnreadCount = useMemo(
    () => conversationReceivers?.reduce((acc, receiver) => acc + receiver.unread_count, 0) || 0,
    [conversationReceivers]
  );

  return (
    <AppContext.Provider
      value={{
        isAuthenticated,
        setIsAuthenticated,
        profile,
        setProfile,
        reset,
        cartTotal,
        checkedCartList,
        isOpenChat,
        setIsOpenChat,
        logout,
        getConversationReceiversQuery: getReceiversQuery,
        conversationReceivers: conversationReceivers || [],
        conversationUnreadCount,

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
        setExtendedCustomers
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export default AppProvider;
