import { ReactNode, createContext } from 'react';

interface ChatContextType {}

const initialContext: ChatContextType = {};

export const ChatContext = createContext<ChatContextType>(initialContext);

export const ChatProvider = ({ children }: { children: ReactNode }) => {
  return <ChatContext.Provider value={{}}>{children}</ChatContext.Provider>;
};
