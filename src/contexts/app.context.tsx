import { createContext, ReactNode, useState, Dispatch, SetStateAction } from 'react';

import { User } from 'src/types/user.type';
import { getAccessTokenFromLS, getProfileFromLS } from 'src/utils/auth';
import { Category } from 'src/types/category.type';
import { Brand } from 'src/types/brand.type';
import { Product } from 'src/types/product.type';
import { BlogListItem } from 'src/types/blog.type';
import { Purchase } from 'src/types/purchase.type';
import { useMutation } from '@tanstack/react-query';
import notificationApi from 'src/apis/notification.api';
import { AddNotificationRequestBody } from 'src/types/notification.type';

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
  handleAddNotification: ({ title, content, type, path }: AddNotificationRequestBody) => void;
}

const initialContext = {
  isAuthenticated: Boolean(getAccessTokenFromLS()),
  setIsAuthenticated: () => null,
  profile: getProfileFromLS(),
  setProfile: () => null,
  reset: () => null,
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
  handleAddNotification: () => null
};

export const AppContext = createContext<AppContextType>(initialContext);

const AppProvider = ({ children }: { children: ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(initialContext.isAuthenticated);
  const [profile, setProfile] = useState<User | null>(initialContext.profile);
  const [extendedCategories, setExtendedCategories] = useState<ExtendedCategory[]>(initialContext.extendedCategories);
  const [extendedBrands, setExtendedBrands] = useState<ExtendedBrand[]>(initialContext.extendedBrands);
  const [extendedProducts, setExtendedProducts] = useState<ExtendedProduct[]>(initialContext.extendedProducts);
  const [extendedBlogs, setExtendedBlogs] = useState<ExtendedBlog[]>(initialContext.extendedBlogs);
  const [extendedCartList, setExtendedCartList] = useState<ExtendedPurchase[]>(initialContext.extendedCartList);

  const reset = () => {
    setIsAuthenticated(false);
    setProfile(null);
  };

  // Mutation thêm thông báo
  const addNotificationMutation = useMutation({
    mutationFn: notificationApi.addNotification
  });

  // Xử lý thêm thông báo
  const handleAddNotification = ({ title, content, type, path }: AddNotificationRequestBody) => {
    addNotificationMutation.mutate({ title, content, type, path });
  };

  return (
    <AppContext.Provider
      value={{
        isAuthenticated,
        setIsAuthenticated,
        profile,
        setProfile,
        reset,
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
        handleAddNotification
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export default AppProvider;
