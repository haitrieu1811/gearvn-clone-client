import { useMutation } from '@tanstack/react-query';
import { Dispatch, ReactNode, SetStateAction, createContext, useState } from 'react';

import authApi from 'src/apis/auth.api';
import { User } from 'src/types/user.type';
import { getAccessTokenFromLS, getProfileFromLS } from 'src/utils/auth';

interface AppContextType {
  isAuthenticated: boolean;
  setIsAuthenticated: Dispatch<SetStateAction<boolean>>;
  profile: User | null;
  setProfile: Dispatch<SetStateAction<User | null>>;
  reset: () => void;
  logout: () => void;
}

const initialContext: AppContextType = {
  isAuthenticated: Boolean(getAccessTokenFromLS()),
  setIsAuthenticated: () => null,
  profile: getProfileFromLS(),
  setProfile: () => null,
  reset: () => null,
  logout: () => null
};

export const AppContext = createContext<AppContextType>(initialContext);

const AppProvider = ({ children }: { children: ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(initialContext.isAuthenticated);
  const [profile, setProfile] = useState<User | null>(initialContext.profile);

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
      window.location.reload();
    }
  });

  // Xử lý đăng xuất
  const logout = () => {
    logoutMutation.mutate();
  };

  return (
    <AppContext.Provider
      value={{
        isAuthenticated,
        setIsAuthenticated,
        profile,
        setProfile,
        reset,
        logout
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export default AppProvider;
