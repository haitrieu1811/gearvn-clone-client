import { createContext, ReactNode, useState, Dispatch, SetStateAction } from 'react';

import { User } from 'src/types/user.type';
import { getAccessTokenFromLS, getProfileFromLS } from 'src/utils/auth';

interface AppContextType {
  isAuthenticated: boolean;
  setIsAuthenticated: Dispatch<SetStateAction<boolean>>;
  profile: User | null;
  setProfile: Dispatch<SetStateAction<User | null>>;
}

const initialContext = {
  isAuthenticated: Boolean(getAccessTokenFromLS()),
  setIsAuthenticated: () => null,
  profile: getProfileFromLS(),
  setProfile: () => null
};

export const AppContext = createContext<AppContextType>(initialContext);

const AppProvider = ({ children }: { children: ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(initialContext.isAuthenticated);
  const [profile, setProfile] = useState<User | null>(initialContext.profile);

  const VALUES = {
    isAuthenticated,
    setIsAuthenticated,
    profile,
    setProfile
  };

  return <AppContext.Provider value={VALUES}>{children}</AppContext.Provider>;
};

export default AppProvider;
