import { createContext, ReactNode, useState, Dispatch, SetStateAction } from 'react';

import { User } from 'src/types/user.type';
import { getAccessTokenFromLS, getProfileFromLS } from 'src/utils/auth';
import { Category } from 'src/types/category.type';
import { Brand } from 'src/types/brand.type';
import { Product } from 'src/types/product.type';

interface ExtendedCategory extends Category {
  checked: boolean;
}

interface ExtendedBrand extends Brand {
  checked: boolean;
}

interface ExtendedProduct extends Product {
  checked: boolean;
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
  setExtendedProducts: () => null
};

export const AppContext = createContext<AppContextType>(initialContext);

const AppProvider = ({ children }: { children: ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(initialContext.isAuthenticated);
  const [profile, setProfile] = useState<User | null>(initialContext.profile);
  const [extendedCategories, setExtendedCategories] = useState<ExtendedCategory[]>(initialContext.extendedCategories);
  const [extendedBrands, setExtendedBrands] = useState<ExtendedBrand[]>(initialContext.extendedBrands);
  const [extendedProducts, setExtendedProducts] = useState<ExtendedProduct[]>(initialContext.extendedProducts);

  const reset = () => {
    setIsAuthenticated(false);
    setProfile(null);
  };

  const VALUES = {
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
    setExtendedProducts
  };

  return <AppContext.Provider value={VALUES}>{children}</AppContext.Provider>;
};

export default AppProvider;
