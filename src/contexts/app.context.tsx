import { useMutation, useQuery } from '@tanstack/react-query';
import { Dispatch, ReactNode, SetStateAction, createContext, useState, useMemo } from 'react';

import authApi from 'src/apis/auth.api';
import conversationApi from 'src/apis/conversation.api';
import { BlogListItem } from 'src/types/blog.type';
import { Brand } from 'src/types/brand.type';
import { Category } from 'src/types/category.type';
import { ConversationReceiver } from 'src/types/conversation.type';
import { Product } from 'src/types/product.type';
import { Purchase } from 'src/types/purchase.type';
import { User } from 'src/types/user.type';
import { getAccessTokenFromLS, getProfileFromLS } from 'src/utils/auth';

interface ExtendedCategory extends Category {
  checked: boolean;
}

interface ExtendedBrand extends Brand {
  checked: boolean;
}

interface ExtendedProduct extends Product {
  checked: boolean;
}

interface ExtendedBlog extends BlogListItem {
  checked: boolean;
}

export interface ExtendedPurchase extends Purchase {
  checked: boolean;
  disabled: boolean;
}

interface AppContextType {
  isAuthenticated: boolean;
  setIsAuthenticated: Dispatch<SetStateAction<boolean>>;
  profile: User | null;
  setProfile: Dispatch<SetStateAction<User | null>>;
  reset: () => void;
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
}

const initialContext = {
  isAuthenticated: Boolean(getAccessTokenFromLS()),
  setIsAuthenticated: () => null,
  profile: getProfileFromLS(),
  setProfile: () => null,
  reset: () => null,
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
  setExtendedCartList: () => null
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

  // Reset auth
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
    }
  });

  // Xử lý đăng xuất
  const logout = () => {
    logoutMutation.mutate();
  };

  // Query: Lấy dánh sách người đã nhắn tin với mình
  const getReceiversQuery = useQuery({
    queryKey: ['conversation_receivers'],
    queryFn: () => conversationApi.getReceivers()
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
        setExtendedCartList
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export default AppProvider;
