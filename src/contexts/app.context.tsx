import { createContext, ReactNode, useState, Dispatch, SetStateAction } from 'react';

import { User } from 'src/types/user.type';
import { getAccessTokenFromLS, getProfileFromLS } from 'src/utils/auth';
import { Category } from 'src/types/category.type';

interface ExtendedCategory extends Category {
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
}

const initialContext = {
  isAuthenticated: Boolean(getAccessTokenFromLS()),
  setIsAuthenticated: () => null,
  profile: getProfileFromLS(),
  setProfile: () => null,
  reset: () => null,
  extendedCategories: [],
  setExtendedCategories: () => null
};

export const AppContext = createContext<AppContextType>(initialContext);

const AppProvider = ({ children }: { children: ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(initialContext.isAuthenticated);
  const [profile, setProfile] = useState<User | null>(initialContext.profile);
  const [extendedCategories, setExtendedCategories] = useState<ExtendedCategory[]>(initialContext.extendedCategories);

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
    setExtendedCategories
  };

  return <AppContext.Provider value={VALUES}>{children}</AppContext.Provider>;
};

export default AppProvider;
